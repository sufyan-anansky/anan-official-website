"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const STEPS = [
  "discovery",
  "planning",
  "design",
  "development",
  "launch",
  "support",
] as const;

// Put your images in /public/images/how-we-work/
const IMAGES: Record<(typeof STEPS)[number], string> = {
  discovery: "/images/how-we-work/discovery2.webp",
  planning: "/images/how-we-work/planning3.webp",
  design: "/images/how-we-work/design2.webp",
  development: "/images/how-we-work/development2.webp",
  launch: "/images/how-we-work/launch2.webp",
  support: "/images/how-we-work/support2.webp",
};

export function WorkflowVisual({ activeStep = 0 }: { activeStep?: number }) {
  const isRtl = useLocale() === "ar";
  const t = useTranslations("howWeWork");

  const current = STEPS[Math.min(activeStep, STEPS.length - 1)];

  return (
    <div
      aria-hidden="true"
      className="relative isolate aspect-[5/4] w-full overflow-hidden rounded-[2rem] border border-outline-variant/60 bg-carbon-surface shadow-2xl"
    >
      {/* Fallback glow, visible while images load or if one is missing */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,var(--color-glow-emerald),transparent_70%)]" />

      {/* One image per step, cross-fading */}
      {STEPS.map((step, index) => {
        const isActive = index === activeStep;

        return (
          <Image
            key={step}
            src={IMAGES[step]}
            alt=""
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={`object-cover transition-all duration-700 ease-out will-change-transform ${
              isActive ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
            }`}
          />
        );
      })}

      {/* Readability overlay + emerald tint to match the theme */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-base/90 via-carbon-base/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,var(--color-glow-emerald),transparent_65%)] opacity-60" />

      {/* Caption: step number + title, swaps with the image */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-md p-lg sm:p-xl">
        <div key={current} className="min-w-0 animate-[fadeUp_0.5s_ease-out]">
          <span className="font-mono text-label-mono-sm text-primary">
            {String(activeStep + 1).padStart(2, "0")} /{" "}
            {String(STEPS.length).padStart(2, "0")}
          </span>
          <p
            className={`mt-xs truncate text-headline-sm font-semibold text-text-pure ${
              isRtl ? "font-arabic" : "font-display"
            }`}
          >
            {t(`steps.${current}.title`)}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex shrink-0 items-center gap-xs pb-xs">
          {STEPS.map((step, index) => (
            <span
              key={step}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === activeStep
                  ? "w-6 bg-primary shadow-[0_0_10px_var(--color-primary)]"
                  : "w-1.5 bg-text-pure/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
