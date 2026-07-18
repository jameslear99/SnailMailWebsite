"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { generateSnailScrollRows } from "@/config/marketing-assets";
import { RandomSnailComposite } from "@/components/public/snail-art-composite";

const ROW_DURATIONS = ["140s", "180s", "120s", "160s"] as const;
const SNAIL_SIZE = 76;
const ROW_GAP = 20;

function SnailMarqueeRow({
  looks,
  duration,
  reverse = false,
  className,
}: {
  looks: ReturnType<typeof generateSnailScrollRows>[number];
  duration: string;
  reverse?: boolean;
  className?: string;
}) {
  const track = [...looks, ...looks];

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max items-center motion-reduce:animate-none",
          reverse ? "animate-snail-marquee-reverse" : "animate-snail-marquee",
        )}
        style={{
          gap: ROW_GAP,
          animationDuration: duration,
        }}
      >
        {track.map((look, i) => (
          <RandomSnailComposite
            key={`${i}-${look.antenna}-${look.body}-${look.shell}-${look.face}-${look.accessory ?? "none"}`}
            look={look}
            size={SNAIL_SIZE}
            priority={i < 6}
          />
        ))}
      </div>
    </div>
  );
}

/** Four-row infinite scroll of random snail combinations. */
export function SnailScrollWall({ className }: { className?: string }) {
  const rows = useMemo(
    () => generateSnailScrollRows({ rowCount: 4, snailsPerRow: 40 }),
    [],
  );

  return (
    <div
      className={cn(
        "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden",
        "mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
      aria-hidden
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {rows.map((row, i) => (
          <SnailMarqueeRow
            key={i}
            looks={row}
            duration={ROW_DURATIONS[i] ?? "150s"}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}
