"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  SNAIL_ART_SETS,
  SNAIL_LAYER_ORDER,
  type RandomSnailLook,
  type SnailArtLayer,
  type SnailArtSetId,
} from "@/config/marketing-assets";

const REQUIRED_LAYERS: SnailArtLayer[] = ["antenna", "body", "shell", "face"];

function layerSrc(setId: SnailArtSetId, layer: SnailArtLayer): string | undefined {
  return SNAIL_ART_SETS[setId]?.[layer];
}

export function getSnailSetLayerUrls(
  setId: SnailArtSetId,
  includeAccessory = true,
): { layer: SnailArtLayer; src: string }[] {
  const set = SNAIL_ART_SETS[setId];
  if (!set) return [];

  if (!REQUIRED_LAYERS.every((layer) => set[layer])) return [];

  return SNAIL_LAYER_ORDER.filter(
    (layer) => includeAccessory || layer !== "accessory",
  )
    .map((layer) => ({ layer, src: set[layer]! }))
    .filter((entry) => entry.src.length > 0);
}

function resolveRandomLayerUrls(look: RandomSnailLook): { layer: SnailArtLayer; src: string }[] {
  const layers: { layer: SnailArtLayer; src: string }[] = [];

  for (const layer of SNAIL_LAYER_ORDER) {
    const setId = look[layer];
    if (!setId) continue;
    const src = layerSrc(setId, layer);
    if (!src) continue;
    layers.push({ layer, src });
  }

  if (!REQUIRED_LAYERS.every((layer) => layers.some((entry) => entry.layer === layer))) {
    return [];
  }

  return layers;
}

function LayerStack({
  layers,
  priority = false,
  eager = false,
  sizes,
  onReady,
}: {
  layers: { layer: SnailArtLayer; src: string }[];
  priority?: boolean;
  eager?: boolean;
  sizes: string;
  onReady?: () => void;
}) {
  const loadedLayers = useRef(new Set<string>());
  const readySent = useRef(false);
  const layerKey = layers.map(({ layer, src }) => `${layer}:${src}`).join("|");

  useEffect(() => {
    loadedLayers.current = new Set();
    readySent.current = false;
  }, [layerKey]);

  const markLayerLoaded = useCallback(
    (layer: SnailArtLayer) => {
      loadedLayers.current.add(layer);
      if (loadedLayers.current.size < layers.length || readySent.current) return;
      readySent.current = true;
      onReady?.();
    },
    [layers.length, onReady],
  );

  return (
    <>
      {layers.map(({ layer, src }) => (
        <div key={layer} className="absolute inset-0">
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            loading={priority || eager ? "eager" : "lazy"}
            sizes={sizes}
            className="object-contain"
            onLoadingComplete={() => markLayerLoaded(layer)}
          />
        </div>
      ))}
    </>
  );
}

/** Composites a single matching-number snail set (antenna → accessory). */
export function SnailArtComposite({
  setId,
  size = 160,
  className,
  includeAccessory = true,
  priority = false,
  eager = false,
  fill = false,
  onReady,
}: {
  setId: SnailArtSetId;
  size?: number;
  className?: string;
  includeAccessory?: boolean;
  priority?: boolean;
  eager?: boolean;
  fill?: boolean;
  onReady?: () => void;
}) {
  const layers = getSnailSetLayerUrls(setId, includeAccessory);
  if (layers.length === 0) return null;

  return (
    <div
      className={cn("relative shrink-0", fill && "size-full", className)}
      style={fill ? undefined : { width: size, height: size }}
      aria-hidden
    >
      <LayerStack
        layers={layers}
        priority={priority}
        eager={eager}
        sizes={fill ? "560px" : `${Math.ceil(size * 1.5)}px`}
        onReady={onReady}
      />
    </div>
  );
}

/** Composites independently chosen layers — like in-app random generation. */
export function RandomSnailComposite({
  look,
  size = 88,
  className,
  priority = false,
}: {
  look: RandomSnailLook;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const layers = resolveRandomLayerUrls(look);
  if (layers.length === 0) return null;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <LayerStack layers={layers} priority={priority} sizes={`${Math.ceil(size * 1.5)}px`} />
    </div>
  );
}
