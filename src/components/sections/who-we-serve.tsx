"use client";

import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Globe2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { PointerEvent } from "react";
import { useRef, useState } from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/cn";

const audienceKeys = [
  "entrepreneurs",
  "startups",
  "smallBusinesses",
  "largeBusinesses",
  "industrial",
  "government",
  "automation",
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

const panelGradient =
  "bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-surface-container)_72%,transparent),color-mix(in_srgb,var(--color-carbon-surface)_92%,transparent))]";

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

function GlobeOrb({ className }: Readonly<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduceMotion = Boolean(useReducedMotion());
  const active = inView && !reduceMotion;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-active={active}
      className={cn(
        "who-orb relative h-[6.5rem] w-[6.5rem] shrink-0",
        className,
      )}
    >
      <span className="who-ping absolute inset-[18%] rounded-full border border-primary/50" />
      <span className="who-ping absolute inset-[18%] rounded-full border border-primary/40 [animation-delay:-1.5s]" />

      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        <defs>
          <radialGradient id="who-globe-fill" cx="38%" cy="32%" r="75%">
            <stop
              offset="0"
              stopColor="var(--color-primary)"
              stopOpacity="0.3"
            />
            <stop
              offset="1"
              stopColor="var(--color-primary)"
              stopOpacity="0.03"
            />
          </radialGradient>
        </defs>

        <circle
          cx="60"
          cy="60"
          r="40"
          fill="url(#who-globe-fill)"
          stroke="var(--color-primary)"
          strokeOpacity="0.55"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="40"
          ry="12"
          stroke="var(--color-primary)"
          strokeOpacity="0.3"
        />
        <ellipse
          cx="60"
          cy="42"
          rx="33"
          ry="6"
          stroke="var(--color-primary)"
          strokeOpacity="0.2"
        />
        <ellipse
          cx="60"
          cy="78"
          rx="33"
          ry="6"
          stroke="var(--color-primary)"
          strokeOpacity="0.2"
        />
        {[0, 1, 2].map((index) => (
          <ellipse
            key={index}
            cx="60"
            cy="60"
            rx="40"
            ry="40"
            className="who-meridian"
            style={{ animationDelay: `${index * -2}s` }}
            stroke="var(--color-primary)"
            strokeOpacity="0.4"
          />
        ))}

        <g transform="rotate(-24 60 60)">
          <ellipse
            cx="60"
            cy="60"
            rx="56"
            ry="18"
            stroke="var(--color-primary)"
            strokeOpacity="0.35"
            strokeDasharray="2 5"
          />
          <circle
            r="3"
            fill="var(--color-primary)"
            style={{ filter: "drop-shadow(0 0 4px var(--color-primary))" }}
          >
            {active ? (
              <animateMotion
                dur="9s"
                repeatCount="indefinite"
                path="M4 60a56 18 0 1 0 112 0a56 18 0 1 0 -112 0"
              />
            ) : null}
          </circle>
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type CheckMarkProps = Readonly<{
  reached: boolean;
  reduceMotion: boolean;
}>;

/** Ring that fills and draws its tick once the scroll line reaches it. */
function CheckMark({ reached, reduceMotion }: CheckMarkProps) {
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.45, ease };

  return (
    <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center">
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-full bg-carbon-base ring-1 transition-all duration-500",
          reached
            ? "shadow-[0_0_18px_var(--color-primary)] ring-primary/70"
            : "ring-outline-variant/50",
        )}
      />
      <svg
        viewBox="0 0 24 24"
        className="relative h-6 w-6"
        fill="none"
        aria-hidden="true"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="var(--color-primary)"
          initial={false}
          animate={{ fillOpacity: reached ? 1 : 0.1 }}
          transition={transition}
        />
        <motion.path
          d="M7.5 12.5l3 3 6-6.5"
          stroke="var(--color-carbon-base)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: reached ? 1 : 0 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.12 }}
        />
      </svg>
    </span>
  );
}

/* -------------------------------------------------------------------------- */

export function WhoWeServe() {
  const t = useTranslations("whoWeServe");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const reduceMotion = Boolean(useReducedMotion());
  const count = audienceKeys.length;

  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [reached, setReached] = useState(reduceMotion ? count : 1);

  // Background glow drifts slowly against the scroll.
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(sectionProgress, [0, 1], ["-6%", "6%"]);

  // The line fills as the list scrolls through, and each row lights up when
  // the line reaches it.
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ["start 78%", "end 58%"],
  });
  const fill = useSpring(listProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.3,
  });

  useMotionValueEvent(listProgress, "change", (value) => {
    if (reduceMotion) return;
    setReached(Math.max(1, Math.min(count, Math.ceil(value * count + 0.15))));
  });

  // "From the end side" mirrors with the language.
  const slide = isRtl ? -18 : 18;
  const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: slide, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease },
    },
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="who-we-serve-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate mx-auto max-w-7xl scroll-mt-navbar overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      {/* Glow sits behind the list, which is on the right in LTR and the left
          in RTL, so its anchor mirrors too. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[10%] inset-x-0 -z-10"
        style={{
          y: reduceMotion ? 0 : glowY,
          background: `radial-gradient(ellipse at ${isRtl ? 32 : 68}% 38%, var(--color-glow-emerald), transparent 58%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="who-drift pointer-events-none absolute -bottom-[10%] start-[4%] -z-10 h-[40%] w-[30%] rounded-full"
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
              id="who-we-serve-title"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 24, filter: "blur(10px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.8, ease }
              }
              className={cn(
                "text-headline-lg-mobile font-medium leading-tight text-text-pure sm:text-headline-lg",
                isRtl ? "font-arabic !leading-[1.5]" : "font-display",
              )}
            >
              {t.rich("title", {
                accent: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </motion.h2>

            <motion.div
              onPointerMove={handleGlowMove}
              initial={
                reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }
              }
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
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
              viewport={{ once: true, amount: 0.35 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.7, delay: 0.12, ease }
              }
              className="service-card relative mt-2xl overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_9%,transparent),color-mix(in_srgb,var(--color-carbon-surface)_92%,transparent))] p-lg text-start shadow-[0_0_36px_var(--color-glow-emerald)] sm:p-xl"
            >
              <span className="service-card-dots" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="who-bar absolute inset-y-[12%] end-0 w-[3px] rounded-full"
              />

              <div className="relative z-10 flex items-center justify-between gap-lg">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-text-pure",
                      isRtl
                        ? "font-arabic text-body-lg"
                        : "font-body text-body-lg",
                    )}
                  >
                    {t("marketLabel")}
                  </p>
                  <p
                    className={cn(
                      "mt-sm flex items-center gap-sm font-medium text-primary",
                      isRtl
                        ? "font-arabic text-body-md sm:text-body-lg"
                        : "font-body text-body-md sm:text-body-lg",
                    )}
                  >
                    <Globe2 aria-hidden="true" className="h-5 w-5 shrink-0" />
                    <span>{t("market")}</span>
                  </p>
                </div>
                <GlobeOrb className="hidden sm:block" />
              </div>
            </motion.div>
          </div>

          <motion.div
            onPointerMove={handleGlowMove}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.8, ease }
            }
            className={cn(
              "service-card relative overflow-hidden rounded-[2rem] p-md shadow-xl sm:p-lg lg:col-span-6",
              panelGradient,
            )}
          >
            <span className="service-card-dots" aria-hidden="true" />

            <motion.ul
              ref={listRef}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reduceMotion ? undefined : listVariants}
              className="relative z-10 flex flex-col gap-xs"
            >
              {/* Track and fill line behind the check marks */}
              <span
                aria-hidden="true"
                className="absolute inset-y-[1.5rem] start-[1.5rem] w-px bg-outline-variant/40"
              />
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-[1.5rem] start-[1.5rem] w-px origin-top bg-gradient-to-b from-primary via-primary to-primary/40 shadow-[0_0_10px_var(--color-primary)]"
                style={{ scaleY: reduceMotion ? 1 : fill }}
              />

              {audienceKeys.map((key, index) => {
                const isReached = index < reached;
                return (
                  <motion.li
                    key={key}
                    variants={reduceMotion ? undefined : itemVariants}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            x: isRtl ? -6 : 6,
                            transition: {
                              type: "spring",
                              stiffness: 320,
                              damping: 24,
                            },
                          }
                    }
                    className="group flex items-center gap-sm rounded-2xl px-[0.75rem] py-[0.7rem] text-start transition-colors duration-300 hover:bg-primary/5 sm:gap-md"
                  >
                    <CheckMark
                      reached={isReached}
                      reduceMotion={reduceMotion}
                    />
                    <span
                      className={cn(
                        "transition-colors duration-500 group-hover:text-text-pure",
                        isReached ? "text-text-pure" : "text-text-muted",
                        isRtl
                          ? "font-arabic text-body-md sm:text-body-lg"
                          : "font-body text-body-md sm:text-body-lg",
                      )}
                    >
                      {t(`audiences.${key}`)}
                    </span>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
