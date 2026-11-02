"use client";

import Image from "next/image";
import {
  Bot,
  Dumbbell,
  MapPinned,
  PanelsTopLeft,
  ScanLine,
  ShoppingBag,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties, PointerEvent } from "react";
import { useRef } from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { experienceProjects } from "@/content/experience-projects";
import { cn } from "@/lib/cn";

const projectKeys = [
  "cardsEcommerce",
  "trackingCamel",
  "gymTech",
  "handmade",
  "ananServices",
  "bibanTracking",
  "whatsappAiAgent",
] as const;

const projectIcons: Record<(typeof projectKeys)[number], LucideIcon> = {
  cardsEcommerce: ShoppingBag,
  trackingCamel: MapPinned,
  gymTech: Dumbbell,
  handmade: Smartphone,
  ananServices: PanelsTopLeft,
  bibanTracking: ScanLine,
  whatsappAiAgent: Bot,
};

const ease = [0.16, 1, 0.3, 1] as const;

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease },
  },
};

// The layers behind the screenshot "deal out" shortly after the card lands.
const layersVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.25, ease },
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

export function ExperienceProjects() {
  const t = useTranslations("experienceProjects");
  const isRtl = useLocale() === "ar";
  const reduceMotion = Boolean(useReducedMotion());

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="products"
      ref={sectionRef}
      aria-labelledby="experience-projects-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate mx-auto max-w-7xl scroll-mt-navbar overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[10%] inset-x-0 -z-10 bg-[radial-gradient(ellipse_at_50%_24%,var(--color-glow-emerald),transparent_62%)]"
        style={{ y: reduceMotion ? 0 : glowY }}
      />
      <span
        aria-hidden="true"
        className="xp-drift pointer-events-none absolute -bottom-[8%] end-[4%] -z-10 h-[34%] w-[26%] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent)",
        }}
      />

      <div className="container-shell">
        <SectionEyebrow as="h2" id="experience-projects-title">
          {t("title")}
        </SectionEyebrow>
        <motion.p
          initial={
            reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease }}
          className={cn(
            "mb-2xl mt-md max-w-3xl text-text-muted sm:mb-3xl",
            isRtl
              ? "font-arabic text-body-md sm:text-body-lg"
              : "font-body text-body-md sm:text-body-lg",
          )}
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={reduceMotion ? undefined : gridVariants}
          className="grid grid-cols-1 gap-md sm:grid-cols-2 sm:gap-lg lg:grid-cols-3"
        >
          {projectKeys.map((key, index) => {
            const Icon = projectIcons[key];
            const { image } = experienceProjects[key];

            return (
              <motion.a
                key={key}
                rel="noopener noreferrer"
                variants={reduceMotion ? undefined : cardVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 22,
                        },
                      }
                }
                onPointerMove={handleGlowMove}
                style={{ "--xp-d": `${index * -0.7}s` } as CSSProperties}
                className="xp-card service-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-carbon-surface text-start no-underline shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {/* Header: wipes to the primary colour on hover or focus. */}
                <div className="relative isolate flex-1 overflow-hidden border-b border-border-hairline bg-surface-container/70 p-lg sm:p-xl">
                  <span
                    aria-hidden="true"
                    className="xp-fill absolute inset-0 -z-10 bg-primary"
                  />
                  <div className="flex items-center justify-between gap-sm">
                    <span className="xp-tag inline-flex min-h-7 items-center rounded-full border border-primary/20 bg-primary/5 px-sm font-mono text-label-mono-sm text-primary">
                      {t(`projects.${key}.tag`)}
                    </span>
                    <span
                      aria-hidden="true"
                      className="xp-chip grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="xp-title mt-md font-display text-headline-sm font-semibold leading-tight tracking-tight text-text-pure sm:text-headline-md">
                    <bdi>{t(`projects.${key}.name`)}</bdi>
                    <span className="sr-only"> {t("newTab")}</span>
                  </h3>
                  <p
                    className={cn(
                      "xp-desc mt-xs line-clamp-3 text-text-muted",
                      isRtl
                        ? "font-arabic text-body-sm sm:text-body-md"
                        : "font-body text-body-sm sm:text-body-md",
                    )}
                  >
                    {t(`projects.${key}.description`)}
                  </p>
                </div>

                {/* Screenshot stack, flush with the bottom of the card. */}
                <div className="relative h-[15.5rem] shrink-0 sm:h-[16.5rem]">
                  <motion.div
                    aria-hidden="true"
                    variants={reduceMotion ? undefined : layersVariants}
                    className="pointer-events-none absolute inset-0"
                  >
                    <span
                      className="xp-layer xp-layer--2 absolute inset-x-[11%] bottom-0 top-[0.8rem] rounded-t-[1.6rem] shadow-[inset_0_1px_0_rgb(255_255_255/0.22)]"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-primary) 38%, var(--color-carbon-surface))",
                      }}
                    />
                    <span
                      className="xp-layer xp-layer--1 absolute inset-x-[5.5%] bottom-0 top-[1.6rem] rounded-t-[1.6rem] shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-text-muted) 42%, var(--color-carbon-surface))",
                      }}
                    />
                  </motion.div>

                  <div className="xp-notch xp-shine absolute inset-x-0 bottom-0 top-[2.4rem] overflow-hidden rounded-t-[1.6rem] bg-carbon-base">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      unoptimized={image.endsWith(".svg")}
                      className="xp-shot object-cover object-top"
                    />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
