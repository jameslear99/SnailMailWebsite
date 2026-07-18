"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import {
  HERO_SNAIL_SLIDE_INTERVAL_MS,
  HERO_SNAIL_SLIDESHOW,
} from "@/config/marketing-assets";
import { SnailArtComposite } from "@/components/public/snail-art-composite";

const FADE_MS = 700;

export function HeroSnailSlideshow({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slideCount = HERO_SNAIL_SLIDESHOW.length;

  useEffect(() => {
    if (paused) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideCount);
    }, HERO_SNAIL_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused, slideCount]);

  return (
    <div
      className={cn("flex w-full flex-col items-center lg:items-end", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative aspect-square w-full max-w-[min(72vw,300px)] sm:max-w-[340px] lg:max-w-[min(42vw,480px)] lg:-mt-2"
        aria-live="polite"
        aria-label={`Featured snail ${index + 1} of ${slideCount}`}
      >
        {HERO_SNAIL_SLIDESHOW.map((setId, slideIndex) => (
          <div
            key={setId}
            className={cn(
              "absolute inset-0 transition-opacity ease-in-out motion-reduce:transition-none",
              slideIndex === index ? "z-10 opacity-100" : "z-0 opacity-0",
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={slideIndex !== index}
          >
            <SnailArtComposite
              setId={setId}
              fill
              eager
              priority={slideIndex === 0}
              className="size-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
