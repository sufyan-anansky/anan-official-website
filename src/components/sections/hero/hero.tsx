"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, useReducedMotion, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

const skeletonCss = `
.hero-sk-bar {
  --sk-base: color-mix(in srgb, var(--color-text-pure) 8%, transparent);
  --sk-hi: color-mix(in srgb, var(--color-text-pure) 18%, transparent);
  --sk-h: 62%;
  color: transparent;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  background-image:
    linear-gradient(100deg, transparent 30%, var(--sk-hi) 50%, transparent 70%),
    linear-gradient(var(--sk-base), var(--sk-base));
  background-repeat: no-repeat;
  background-size: 250% var(--sk-h), 100% var(--sk-h);
  background-position: 0% 50%, 0 50%;
  animation: hero-sk-bar 1.8s ease-in-out infinite;
}
.hero-sk-title {
  --sk-base: color-mix(in srgb, var(--color-text-pure) 12%, transparent);
  --sk-hi: color-mix(in srgb, var(--color-text-pure) 24%, transparent);
  --sk-h: 68%;
}
.hero-sk-dim {
  --sk-base: color-mix(in srgb, var(--color-text-pure) 6%, transparent);
  --sk-h: 56%;
}
@keyframes hero-sk-bar {
  to { background-position: 100% 50%, 0 50%; }
}
[dir="rtl"] .hero-sk-bar { animation-direction: reverse; }

.hero-sk-pill {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-text-pure) 10%, transparent);
  background: color-mix(in srgb, var(--color-text-pure) 6%, transparent);
}
.hero-sk-pill--primary {
  border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
  background: color-mix(in srgb, var(--color-primary) 18%, transparent);
}
.hero-sk-pill::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, color-mix(in srgb, var(--color-text-pure) 18%, transparent) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: hero-sk-sweep 1.8s ease-in-out infinite;
}
@keyframes hero-sk-sweep {
  to { transform: translateX(100%); }
}
[dir="rtl"] .hero-sk-pill::after { animation-direction: reverse; }

.hero-sk-fx,
.hero-sk-rail {
  background: color-mix(in srgb, var(--color-text-pure) 7%, transparent);
}
.hero-sk-fixture {
  animation: hero-sk-pulse 1.8s ease-in-out infinite;
}
@keyframes hero-sk-pulse {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-sk-bar,
  .hero-sk-pill::after,
  .hero-sk-fixture {
    animation: none;
  }
}
`;

const spotPositions = [34, 50, 66] as const;

// Same dimensions as the real fixture parts in volumetric-studio.tsx.
const fixtureParts = [
  "h-[4.6em] w-[1.5em] rounded-[0.35em]",
  "h-[1.6em] w-[0.7em]",
  "-mt-[0.2em] h-[2.4em] w-[2.4em] rounded-full",
  "h-[0.9em] w-[3.2em]",
  "h-[6.2em] w-[8.6em] rounded-t-[0.5em]",
  "h-[1.8em] w-[9.4em] rounded-b-[1.1em] rounded-t-[0.3em]",
] as const;

/** Dim silhouette of the room: glow, ceiling track and the three fixtures. */
function HeroSkeletonBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden [--spot-left-0:34%] [--spot-left-1:50%] [--spot-left-2:66%] max-sm:[--spot-left-0:22%] max-sm:[--spot-left-2:78%]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--color-glow-emerald),transparent_64%)]" />
      <div
        className="hero-sk-rail absolute inset-x-0 top-[1.4%] h-[3.2%]"
        style={{ clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)" }}
      />
      {spotPositions.map((position, index) => (
        <div
          key={position}
          className="absolute inset-y-0 w-0"
          style={{
            left: `var(--spot-left-${index}, ${position}%)`,
            fontSize: "clamp(5px, 0.48vw, 9px)",
          }}
        >
          <div
            className="hero-sk-fixture absolute left-0 top-[1%] flex -translate-x-1/2 flex-col items-center"
            style={{ animationDelay: `${index * -0.3}s` }}
          >
            {fixtureParts.map((part) => (
              <span key={part} className={`hero-sk-fx block ${part}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroSkeleton({ isRtl }: Readonly<{ isRtl: boolean }>) {
  const t = useTranslations("hero");

  return (
    <>
      <style>{skeletonCss}</style>
      <HeroSkeletonBackdrop />

      <div className="absolute inset-0 flex">
        <div className="container-shell relative grid min-h-[calc(100svh-var(--navbar-height))] w-full content-center pb-3xl pt-[clamp(9rem,26svh,17rem)] sm:pb-4xl lg:pb-5xl">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <div
              className={`mt-lg max-w-5xl pb-[0.12em] text-display-xl-mobile font-semibold ${
                isRtl ? "!leading-[1.5]" : "!leading-[1]"
              } tracking-tight sm:text-headline-lg lg:text-display-xl ${
                isRtl ? "font-arabic" : "font-display"
              }`}
            >
              <span className="hero-sk-bar hero-sk-title">
                {t.rich("title", { accent: (chunks) => chunks })}
              </span>
            </div>

            <p className="mt-lg max-w-2xl text-body-md text-text-muted sm:text-body-lg">
              <span className="hero-sk-bar">{t("description")}</span>
            </p>

            <div className="mt-xl flex w-full flex-col items-stretch justify-center gap-sm sm:w-auto sm:flex-row sm:items-center">
              <div className="relative flex w-full sm:w-auto">
                <ButtonLink
                  href="/#contact"
                  variant="primary"
                  className="invisible w-full sm:w-auto"
                >
                  <span>{t("primaryCta")}</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </ButtonLink>
                <span
                  aria-hidden="true"
                  className="hero-sk-pill hero-sk-pill--primary absolute inset-0 rounded-full"
                />
              </div>
              <div className="relative flex w-full sm:w-auto">
                <ButtonLink
                  href="/#services"
                  variant="secondary"
                  className="invisible w-full sm:w-auto"
                >
                  <span>{t("secondaryCta")}</span>
                </ButtonLink>
                <span
                  aria-hidden="true"
                  className="hero-sk-pill absolute inset-0 rounded-full"
                />
              </div>
            </div>

            <div
              className={`mt-4xl flex items-center gap-md text-text-dim ${
                isRtl
                  ? "font-arabic text-body-sm"
                  : "font-mono text-label-mono-sm"
              }`}
            >
              <span
                className="h-px w-8 bg-outline-variant"
                aria-hidden="true"
              />
              <span className="hero-sk-bar hero-sk-dim">{t("caption")}</span>
              <span
                className="h-px w-8 bg-outline-variant"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const VolumetricStudio = dynamic(
  () =>
    import("@/components/ui/volumetric-studio").then(
      (module) => module.VolumetricStudio,
    ),
  { ssr: false },
);

export function Hero() {
  const locale = useLocale();
  const t = useTranslations("hero");
  const shouldReduceMotion = useReducedMotion();
  const [isStudioReady, setIsStudioReady] = useState(false);
  const handleStudioReady = useCallback(() => setIsStudioReady(true), []);
  const revealTransition =
    shouldReduceMotion !== false
      ? { duration: 0 }
      : { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      aria-busy={!isStudioReady}
      className="relative isolate flex min-h-[calc(100svh-var(--navbar-height))] overflow-hidden border-b border-border-hairline bg-carbon-base"
    >
      <VolumetricStudio
        className="z-[-1]"
        reducedMotion={shouldReduceMotion !== false}
        onReady={handleStudioReady}
      />

      {/* Fades out over the real content, which fades in underneath it, so the
          bars turn into the text in place instead of blinking away. */}
      <AnimatePresence>
        {!isStudioReady && (
          <motion.div
            key="hero-skeleton"
            aria-hidden="true"
            inert
            className="pointer-events-none absolute inset-0 z-20 select-none"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion !== false ? 0 : 0.5,
              ease: "easeOut",
            }}
          >
            <HeroSkeleton isRtl={locale === "ar"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top padding clears the ceiling track and the three fixtures. */}
      <div
        inert={!isStudioReady}
        className={`container-shell relative z-10 grid min-h-[calc(100svh-var(--navbar-height))] w-full content-center pb-3xl pt-[clamp(9rem,26svh,17rem)] transition-opacity duration-500 motion-reduce:transition-none sm:pb-4xl lg:pb-5xl ${
          isStudioReady ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <motion.div
          initial={shouldReduceMotion === false ? { opacity: 0, y: 18 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="mx-auto flex max-w-5xl flex-col items-center text-center"
        >
          {/* Light-to-muted vertical gradient, like the headline catching the
              beams. The bottom padding keeps descenders inside the clip box. */}
          <h1
            id="hero-title"
            className={`max-w-5xl bg-gradient-to-b mt-lg from-text-pure from-35% to-text-muted bg-clip-text pb-[0.12em] text-display-xl-mobile font-semibold ${locale === "ar" ? "!leading-[1.5]" : "!leading-[1]"} tracking-tight text-transparent sm:text-headline-lg lg:text-display-xl ${
              locale === "ar" ? "font-arabic" : "font-display"
            }`}
          >
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
            })}
          </h1>

          <p className="mt-lg max-w-2xl text-body-md text-text-muted sm:text-body-lg">
            {t("description")}
          </p>

          <div className="mt-xl flex w-full flex-col items-stretch justify-center gap-sm sm:w-auto sm:flex-row sm:items-center">
            <ButtonLink
              href="/#contact"
              variant="primary"
              className="w-full sm:w-auto"
            >
              <span>{t("primaryCta")}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 rtl:-scale-x-100"
              />
            </ButtonLink>
            <ButtonLink
              href="/#services"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <span>{t("secondaryCta")}</span>
            </ButtonLink>
          </div>

          <div
            className={`mt-4xl flex items-center gap-md text-text-dim ${
              locale === "ar"
                ? "font-arabic text-body-sm"
                : "font-mono text-label-mono-sm"
            }`}
          >
            <span className="h-px w-8 bg-outline-variant" aria-hidden="true" />
            <span>{t("caption")}</span>
            <span className="h-px w-8 bg-outline-variant" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
