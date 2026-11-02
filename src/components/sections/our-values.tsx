"use client";

import Image from "next/image";
import {
  ChartNoAxesCombined,
  SlidersHorizontal,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { PointerEvent } from "react";
import { useRef } from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/cn";

const valueKeys = ["efficiency", "clarity", "experience"] as const;

const valueIcons = {
  efficiency: SlidersHorizontal,
  clarity: ChartNoAxesCombined,
  experience: UsersRound,
} as const;

const ease = [0.16, 1, 0.3, 1] as const;

const panelGradient =
  "bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-surface-container)_72%,transparent),color-mix(in_srgb,var(--color-carbon-surface)_92%,transparent))]";

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

// The ring around each icon draws itself when its card arrives.
const ringVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.1, delay: 0.25, ease },
  },
};

/**
 * Feeds the pointer spotlight and rim glow defined for `.service-card`.
 * Reads the element from the event, so it needs no ref and nothing is touched
 * during render.
 */
function handleGlowMove(event: PointerEvent<HTMLElement>) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  element.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/* -------------------------------------------------------------------------- */
/* Icon orb                                                                   */
/* -------------------------------------------------------------------------- */

type ValueOrbProps = Readonly<{
  icon: LucideIcon;
  reduceMotion: boolean;
}>;

function ValueOrb({ icon: Icon, reduceMotion }: ValueOrbProps) {
  return (
    <span className="relative grid h-14 w-14 shrink-0 place-items-center sm:h-16 sm:w-16">
      <svg
        viewBox="0 0 64 64"
        className="absolute inset-0 h-full w-full -rotate-90"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--color-outline-variant)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          variants={reduceMotion ? undefined : ringVariants}
          style={{ filter: "drop-shadow(0 0 4px var(--color-primary))" }}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-[0.4rem] rounded-full bg-carbon-base"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[0.4rem] rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20"
      />
      <Icon
        aria-hidden="true"
        className="relative h-6 w-6 text-primary transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-7 sm:w-7"
      />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Mini visuals, one per value. Decorative, hidden on small screens.          */
/* -------------------------------------------------------------------------- */

type VizProps = Readonly<{
  isRtl: boolean;
  reduceMotion: boolean;
}>;

/** Efficiency: three sliders being tuned. */
function EfficiencyViz({ isRtl, reduceMotion }: VizProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const run = inView && !reduceMotion;
  const direction = isRtl ? -1 : 1;
  const travel = [34, 52, 26] as const;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="hidden w-[4.5rem] shrink-0 flex-col gap-[0.7rem] sm:flex"
    >
      {travel.map((distance, index) => (
        <span
          key={distance}
          className="relative block h-[0.2rem] rounded-full bg-outline-variant/40"
        >
          <motion.span
            className="absolute start-0 top-1/2 -mt-[0.3rem] h-[0.6rem] w-[0.6rem] rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
            animate={
              run
                ? {
                    x: [0, distance * direction, distance * 0.4 * direction, 0],
                  }
                : { x: distance * 0.4 * direction }
            }
            transition={{
              duration: 4 + index,
              delay: index * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </span>
      ))}
    </div>
  );
}

/** Clarity: bars settling into a clear picture. */
function ClarityViz({ reduceMotion }: VizProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const run = inView && !reduceMotion;
  const heights = [40, 65, 50, 85, 70] as const;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="hidden h-[2.8rem] w-[4.5rem] shrink-0 items-end justify-between sm:flex"
    >
      {heights.map((height, index) => (
        <span
          key={index}
          className="block w-[0.5rem] rounded-t-sm bg-primary/70"
          style={{ height: `${height}%` }}
        >
          <motion.span
            className="block h-full w-full origin-bottom rounded-t-sm bg-primary shadow-[0_0_10px_var(--color-glow-emerald)]"
            animate={
              run ? { scaleY: [0.45, 1, 0.65, 0.95, 0.45] } : { scaleY: 1 }
            }
            transition={{
              duration: 3.6,
              delay: index * 0.18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </span>
      ))}
    </div>
  );
}

/** Experience: people, one of them online. */
function ExperienceViz({ reduceMotion }: VizProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const run = inView && !reduceMotion;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="hidden w-[4.5rem] shrink-0 items-center justify-center sm:flex"
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className={cn(
            "relative grid h-8 w-8 place-items-center rounded-full border-2 border-carbon-surface bg-primary/20",
            index > 0 && "-ms-3",
          )}
          animate={run ? { y: [0, -5, 0] } : { y: 0 }}
          transition={{
            duration: 2.6,
            delay: index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          {index === 2 && run ? (
            <motion.span
              className="absolute inset-0 rounded-full border border-primary"
              animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ) : null}
        </motion.span>
      ))}
    </div>
  );
}

const valueViz = {
  efficiency: EfficiencyViz,
  clarity: ClarityViz,
  experience: ExperienceViz,
} as const;

/* -------------------------------------------------------------------------- */

export function OurValues() {
  const t = useTranslations("ourValues");
  const isRtl = useLocale() === "ar";
  const reduceMotion = Boolean(useReducedMotion());

  const sectionRef = useRef<HTMLElement>(null);

  // Background glow and the image inside its frame drift against the scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  // The dashboard tilts toward the cursor.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 18 });

  const handleFrameMove = (event: PointerEvent<HTMLDivElement>) => {
    handleGlowMove(event);
    if (event.pointerType !== "mouse" || reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
    tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 8);
  };

  const handleFrameLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Cards arrive from the end side, which mirrors with the language.
  const slide = isRtl ? -28 : 28;
  const cardVariants: Variants = {
    hidden: { opacity: 0, x: slide, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease },
    },
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-values-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate mx-auto max-w-7xl scroll-mt-navbar overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      {/* The cards are on the right in LTR and the left in RTL, so the glow
          anchor mirrors with them. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[10%] inset-x-0 -z-10"
        style={{
          y: reduceMotion ? 0 : glowY,
          background: `radial-gradient(ellipse at ${isRtl ? 32 : 68}% 48%, var(--color-glow-emerald), transparent 58%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="ov-drift pointer-events-none absolute -top-[8%] start-[6%] -z-10 h-[38%] w-[28%] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent)",
        }}
      />

      <div className="container-shell">
        <SectionEyebrow className="mb-2xl sm:mb-3xl">
          {t("eyebrow")}
        </SectionEyebrow>

        <div className="grid items-center gap-2xl lg:grid-cols-12 lg:gap-3xl">
          <div className="lg:col-span-6">
            <motion.h2
              id="our-values-title"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 24, filter: "blur(10px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.8, ease }
              }
              className={cn(
                "text-headline-lg-mobile font-medium leading-tight text-text-pure sm:text-headline-lg",
                isRtl ? "font-arabic !leading-[1.5]" : "font-display",
              )}
            >
              {t.rich("statement", {
                accent: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </motion.h2>

            <motion.div
              initial={
                reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }
              }
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.8, delay: 0.12, ease }
              }
              onPointerMove={handleFrameMove}
              onPointerLeave={handleFrameLeave}
              style={{
                rotateX: reduceMotion ? 0 : rotateX,
                rotateY: reduceMotion ? 0 : rotateY,
                transformPerspective: 1100,
              }}
              className="service-card relative mt-2xl overflow-hidden rounded-[1.75rem] bg-carbon-surface shadow-2xl shadow-black/30"
            >
              <motion.div style={{ y: reduceMotion ? 0 : imageY, scale: 1.1 }}>
                <Image
                  src="/images/our-values/dashboard.png"
                  alt={t("imageAlt")}
                  width={1600}
                  height={900}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="block h-auto w-full object-cover"
                />
              </motion.div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-base/35 via-transparent to-primary/5"
              />
              <span className="ov-scan" aria-hidden="true" />
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reduceMotion ? undefined : listVariants}
            className="flex flex-col gap-md lg:col-span-6 lg:gap-lg"
          >
            {valueKeys.map((key) => {
              const Viz = valueViz[key];
              return (
                <motion.article
                  key={key}
                  variants={reduceMotion ? undefined : cardVariants}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -4,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 22,
                          },
                        }
                  }
                  onPointerMove={handleGlowMove}
                  className={cn(
                    "service-card group relative overflow-hidden rounded-[1.75rem] p-lg text-start shadow-xl sm:p-xl",
                    panelGradient,
                  )}
                >
                  <span className="service-card-dots" aria-hidden="true" />

                  <div className="relative z-10 flex items-center gap-md sm:gap-lg">
                    <ValueOrb
                      icon={valueIcons[key]}
                      reduceMotion={reduceMotion}
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        className={cn(
                          "text-headline-sm font-medium text-text-pure",
                          isRtl ? "font-arabic" : "font-display",
                        )}
                      >
                        {t(`${key}.title`)}
                      </h3>
                      <p
                        className={cn(
                          "mt-xs text-text-muted",
                          isRtl
                            ? "font-arabic text-body-sm sm:text-body-md"
                            : "font-body text-body-sm sm:text-body-md",
                        )}
                      >
                        {t(`${key}.description`)}
                      </p>
                    </div>
                    <Viz isRtl={isRtl} reduceMotion={reduceMotion} />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
