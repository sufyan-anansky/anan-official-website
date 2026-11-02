"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const spotPositions = [34, 50, 66] as const;

/*
 * Scene geometry, as a percentage of the hero box.
 * Back wall: x 17%–83%, y 9%–80%. Everything else is derived from it, so the
 * walls, ceiling, floor and edge lines always meet at the same corners.
 */

// Metal tones are derived from your existing tokens, no new colours.
const sceneVars = {
  "--metal-hi":
    "color-mix(in srgb, var(--color-text-pure) 80%, var(--color-carbon-elevated))",
  "--metal-mid":
    "color-mix(in srgb, var(--color-text-pure) 38%, var(--color-carbon-elevated))",
  "--metal-lo":
    "color-mix(in srgb, var(--color-text-pure) 12%, var(--color-carbon-base))",
  "--light-core":
    "color-mix(in srgb, var(--color-primary) 40%, var(--color-text-pure))",
} as CSSProperties;

const metalVertical =
  "linear-gradient(90deg, var(--metal-lo), var(--metal-hi) 42%, var(--metal-mid) 68%, var(--metal-lo))";

// Cylindrical shading shared by the fixture housing and collar.
const cylinderShading =
  "linear-gradient(90deg, rgb(0 0 0 / 0.85), rgb(255 255 255 / 0.16) 20%, rgb(0 0 0 / 0.55) 48%, rgb(255 255 255 / 0.1) 76%, rgb(0 0 0 / 0.9))";

const ribs =
  "repeating-linear-gradient(180deg, transparent 0, transparent 0.85em, rgb(0 0 0 / 0.75) 0.85em, rgb(0 0 0 / 0.75) 1em, rgb(255 255 255 / 0.1) 1em, rgb(255 255 255 / 0.1) 1.08em)";

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

type LitProps = Readonly<{ isLit: boolean }>;

function LightCone({ isLit }: LitProps) {
  return (
    <div
      className={cn(
        "absolute left-0 -translate-x-1/2 transition-opacity duration-700 [mix-blend-mode:screen]",
        isLit ? "opacity-100" : "opacity-0",
      )}
      style={{
        top: "calc(1% + 16.2em)",
        height: "calc(63% - 16.2em)",
        width: "clamp(96px, 22vw, 420px)",
      }}
    >
      {/* Wide, soft haze */}
      <div className="absolute inset-0" style={{ filter: "blur(14px)" }}>
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 46%, transparent), color-mix(in srgb, var(--color-primary) 14%, transparent) 55%, transparent)",
          }}
        />
      </div>
      {/* Brighter core beam */}
      <div
        className="absolute inset-y-0 left-[22%] right-[22%]"
        style={{ filter: "blur(8px)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--light-core) 70%, transparent), color-mix(in srgb, var(--color-primary) 18%, transparent) 60%, transparent 96%)",
          }}
        />
      </div>
    </div>
  );
}

function Fixture({ isLit }: LitProps) {
  return (
    <div className="absolute left-0 top-[1%] flex -translate-x-1/2 flex-col items-center">
      {/* Rail bracket */}
      <span
        className="relative block h-[4.6em] w-[1.5em] rounded-[0.35em]"
        style={{
          background: metalVertical,
          boxShadow: "0 0.2em 0.6em rgb(0 0 0 / 0.6)",
        }}
      >
        <span className="absolute left-1/2 top-[0.7em] h-[0.5em] w-[0.5em] -translate-x-1/2 rounded-full bg-carbon-base" />
        <span className="absolute left-1/2 top-[3.3em] h-[0.5em] w-[0.5em] -translate-x-1/2 rounded-full bg-carbon-base" />
      </span>

      {/* Stem and ball joint */}
      <span
        className="block h-[1.6em] w-[0.7em]"
        style={{ background: metalVertical }}
      />
      <span
        className="-mt-[0.2em] block h-[2.4em] w-[2.4em] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, var(--metal-mid), var(--color-carbon-base) 70%)",
          boxShadow: "0 0.3em 0.8em rgb(0 0 0 / 0.6)",
        }}
      />
      <span className="block h-[0.9em] w-[3.2em] bg-carbon-base" />

      {/* Ribbed housing */}
      <span
        className="relative block h-[6.2em] w-[8.6em] rounded-t-[0.5em]"
        style={{
          backgroundColor: "var(--color-carbon-elevated)",
          backgroundImage: `${ribs}, ${cylinderShading}`,
          boxShadow: "0 0.4em 1.2em rgb(0 0 0 / 0.55)",
        }}
      >
        {/* Yoke ears */}
        <span
          className="absolute -left-[0.9em] top-[1.4em] h-[3.4em] w-[0.9em] rounded-l-[0.3em]"
          style={{ background: metalVertical }}
        />
        <span
          className="absolute -right-[0.9em] top-[1.4em] h-[3.4em] w-[0.9em] rounded-r-[0.3em]"
          style={{ background: metalVertical }}
        />
      </span>

      {/* Lens collar with emitter */}
      <span
        className="relative block h-[1.8em] w-[9.4em] rounded-b-[1.1em] rounded-t-[0.3em]"
        style={{
          backgroundColor: "var(--color-carbon-base)",
          backgroundImage: cylinderShading,
        }}
      >
        <span
          className="absolute bottom-[0.45em] left-1/2 h-[0.75em] w-[5.2em] -translate-x-1/2 rounded-full transition-all duration-700"
          style={
            isLit
              ? {
                  background: "var(--color-text-pure)",
                  boxShadow:
                    "0 0 1.2em 0.25em var(--color-primary), 0 0.5em 2em 0.5em color-mix(in srgb, var(--color-primary) 55%, transparent)",
                }
              : { background: "var(--color-surface-container-high)" }
          }
        />
      </span>

      {/* Glow spilling out of the lens */}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-[88%] h-[7em] w-[16em] -translate-x-1/2 transition-opacity duration-700 [mix-blend-mode:screen]",
          isLit ? "opacity-100" : "opacity-0",
        )}
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--light-core) 60%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}

type VolumetricStudioProps = Readonly<{
  className?: string;
  reducedMotion: boolean;
  onReady?: () => void;
}>;

export function VolumetricStudio({
  className,
  reducedMotion,
  onReady,
}: VolumetricStudioProps) {
  const [lightsOn, setLightsOn] = useState(false);
  const isLit = reducedMotion || lightsOn;

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (reducedMotion) return;

    const sequence: ReadonlyArray<readonly [number, boolean]> = [
      [600, true],
      [100, false],
      [300, true],
      [50, false],
      [200, true],
      [40, false],
      [60, true],
      [40, false],
      [400, true],
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    for (const [delay, isOn] of sequence) {
      elapsed += delay;
      timers.push(setTimeout(() => setLightsOn(isOn), elapsed));
    }

    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 isolate overflow-hidden bg-carbon-base [--spot-left-0:34%] [--spot-left-1:50%] [--spot-left-2:66%] max-sm:[--spot-left-0:22%] max-sm:[--spot-left-2:78%]",
        className,
      )}
      style={sceneVars}
    >
      {/* ---- Room: ceiling, side walls, back wall, floor ---- */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 83% 9%, 17% 9%)",
          background: "color-mix(in srgb, var(--color-carbon-base) 55%, black)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 17% 9%, 17% 80%, 0 100%)",
          background:
            "linear-gradient(90deg, var(--color-carbon-base), var(--color-surface-container-low))",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(100% 0, 83% 9%, 83% 80%, 100% 100%)",
          background:
            "linear-gradient(270deg, var(--color-carbon-base), var(--color-surface-container-low))",
        }}
      />
      <div
        className="absolute inset-x-[8%] top-[9%] h-[71%] rounded-b-[2em]"
        style={{
          background:
            "linear-gradient(180deg, var(--color-carbon-elevated), var(--color-surface-container-low))",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(17% 80%, 83% 80%, 100% 100%, 0 100%)",
          background:
            "linear-gradient(180deg, var(--color-carbon-surface), var(--color-carbon-base) 85%)",
        }}
      />

      {/* Wall wash from the existing glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--color-glow-emerald),transparent_64%)]" />

      {/* Corner and edge lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0L17 9M100 0L83 9M17 80L0 100M83 80L100 100M17 9H83M17 9V80M83 9V80"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ stroke: "var(--color-outline-variant)", opacity: 0.55 }}
        />
      </svg>

      {/* Back-wall light pools under each fixture */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isLit ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: spotPositions
            .map(
              (position, index) =>
                `radial-gradient(ellipse 15% 22% at var(--spot-left-${index}, ${position}%) 60%, var(--color-glow-emerald), transparent 72%)`,
            )
            .join(", "),
        }}
      />

      {/* Glowing baseboard line */}
      <div
        className={cn(
          "absolute inset-x-[17%] top-[80%] transition-opacity duration-700",
          isLit ? "opacity-100" : "opacity-40",
        )}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-outline-variant) 20%, var(--light-core) 50%, var(--color-outline-variant) 80%, transparent)",
          }}
        />
        <div
          className="-mt-px h-[3px] blur-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-outline-variant) 20%, var(--light-core) 50%, var(--color-outline-variant) 80%, transparent)",
          }}
        />
      </div>

      {/* ---- Ceiling track ---- */}
      <div
        className="absolute inset-x-0 top-[3.6%] h-[2.6%] bg-black/60 blur-[6px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-[1.4%] h-[3.2%]"
        style={{
          clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)",
          backgroundColor: "var(--color-carbon-elevated)",
          backgroundImage:
            "linear-gradient(180deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.07) 38%, rgb(0 0 0 / 0.55))",
        }}
      />

      {/* ---- Spotlights: beam first, fixture on top ---- */}
      {spotPositions.map((position, index) => (
        <div
          key={position}
          className="absolute inset-y-0 w-0"
          style={{
            left: `var(--spot-left-${index}, ${position}%)`,
            fontSize: "clamp(5px, 0.48vw, 9px)",
          }}
        >
          <LightCone isLit={isLit} />
          <Fixture isLit={isLit} />
        </div>
      ))}

      {/* Film grain stops gradient banding in the dark areas */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_34%,var(--color-carbon-base)_100%)]" />
    </div>
  );
}
