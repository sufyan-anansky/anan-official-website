"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { KeyboardEvent, PointerEvent } from "react";
import { useId, useRef, useState } from "react";
import {
  ServiceVisual,
  type ServiceVisualLabels,
} from "@/components/sections/services/service-visual";
import { services } from "@/content/services";
import { cn } from "@/lib/cn";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

type ServiceId = (typeof services)[number]["id"];

const notificationKeys = ["first", "second", "third"] as const;
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Which of the three service groups each card belongs to, and which points of
 * that group it lists. All 17 points are covered exactly once.
 */
const servicePoints = {
  workflows: { group: 2, keys: ["integration", "payments"] },
  platforms: {
    group: 1,
    keys: ["mobile", "web", "saas", "portals", "erp", "dashboards"],
  },
  data: { group: 3, keys: ["ai", "agents"] },
  analytics: { group: 2, keys: ["iot", "cloud", "devops", "qa"] },
  reporting: { group: 3, keys: ["analysis", "uiux", "consulting"] },
} as const satisfies Record<
  ServiceId,
  { group: 1 | 2 | 3; keys: readonly string[] }
>;

type ServiceCardProps = Readonly<{
  id: ServiceId;
  gridClass: string;
  title: string;
  description: string;
  groupNumber: number;
  groupTitle: string;
  points: readonly string[];
  showLabel: string;
  hideLabel: string;
  labels: ServiceVisualLabels;
  isRtl: boolean;
  reduceMotion: boolean;
}>;

function ServiceCard({
  id,
  gridClass,
  title,
  description,
  groupNumber,
  groupTitle,
  points,
  showLabel,
  hideLabel,
  labels,
  isRtl,
  reduceMotion,
}: ServiceCardProps) {
  const ref = useRef<HTMLElement>(null);
  const panelId = useId();
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  // Feeds the spotlight and the rim glow in services-effects.css. Writes CSS
  // variables directly so pointer movement never re-renders the card.
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") setOpen(false);
  };

  // The panel opens as a circle growing out of the toggle button, which sits
  // in the top end corner, so the origin mirrors with the language.
  const origin = isRtl ? "2.15rem" : "calc(100% - 2.15rem)";
  const panelVariants: Variants = reduceMotion
    ? {
        closed: {
          opacity: 0,
          visibility: "hidden",
          transition: { duration: 0 },
        },
        open: {
          opacity: 1,
          visibility: "visible",
          transition: { duration: 0 },
        },
      }
    : {
        closed: {
          opacity: 0,
          clipPath: `circle(0% at ${origin} 2.15rem)`,
          transitionEnd: { visibility: "hidden" },
          transition: { duration: 0.4, ease },
        },
        open: {
          opacity: 1,
          clipPath: `circle(150% at ${origin} 2.15rem)`,
          visibility: "visible",
          transition: { duration: 0.6, ease },
        },
      };
  const listVariants: Variants = {
    closed: {},
    open: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } },
  };
  const itemVariants: Variants = {
    closed: { opacity: 0, x: isRtl ? -14 : 14 },
    open: { opacity: 1, x: 0, transition: { duration: 0.45, ease } },
  };

  return (
    <motion.article
      ref={ref}
      data-service-card
      variants={{
        hidden: reduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 32, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: reduceMotion ? { duration: 0 } : { duration: 0.8, ease },
        },
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              transition: { type: "spring", stiffness: 300, damping: 22 },
            }
      }
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      className={cn(
        "service-card group relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2.4rem] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-surface-container)_72%,transparent),color-mix(in_srgb,var(--color-carbon-surface)_92%,transparent))] shadow-xl lg:h-[22.6rem] lg:min-h-0",
        gridClass,
        id === "platforms" && "md:col-span-2",
      )}
    >
      <span className="service-card-dots" aria-hidden="true" />

      <ServiceVisual type={id} labels={labels} hovered={hovered} />

      {/* Toggle for the points panel. It works the same with a mouse, touch or
          keyboard, so the visuals above stay fully interactive. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? hideLabel : showLabel}
        onClick={() => setOpen((value) => !value)}
        className="absolute end-[1rem] top-[1rem] z-30 grid h-[2.25rem] w-[2.25rem] place-items-center rounded-full border border-outline-variant/50 bg-carbon-base/60 text-text-muted backdrop-blur-md transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {!open && !reduceMotion ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-primary"
            initial={{ opacity: 0 }}
            whileInView={{ scale: [1, 1.9], opacity: [0.55, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              delay: 1.2,
              repeat: 2,
              ease: "easeOut",
            }}
          />
        ) : null}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 300, damping: 18 }
          }
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Fills the space between the top of the card and the text block, so
          the panel never covers the title or description. */}
      <div className="pointer-events-none relative z-20 min-h-0 flex-1">
        <motion.div
          id={panelId}
          initial="closed"
          animate={open ? "open" : "closed"}
          variants={panelVariants}
          style={{ visibility: "hidden" }}
          className="pointer-events-auto absolute inset-0 overflow-y-auto overscroll-contain bg-[color-mix(in_srgb,var(--color-carbon-surface)_90%,transparent)] px-[1.75rem] pb-[0.75rem] pt-[1.1rem] backdrop-blur-xl [mask-image:linear-gradient(to_bottom,#000_calc(100%-1.25rem),transparent)] [scrollbar-width:thin]"
        >
          <motion.div
            variants={reduceMotion ? undefined : itemVariants}
            className="flex items-center gap-[0.7rem] pe-[2.75rem]"
          >
            <span className="grid h-[1.9rem] min-w-[2.2rem] shrink-0 place-items-center rounded-lg bg-primary/10 px-[0.4rem] font-mono text-[0.8rem] font-semibold text-primary">
              {String(groupNumber).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "text-[1rem] font-medium leading-snug text-text-pure",
                isRtl ? "font-arabic" : "font-display",
              )}
            >
              {groupTitle}
            </span>
          </motion.div>

          <motion.ul
            variants={reduceMotion ? undefined : listVariants}
            className={cn(
              "mt-[0.9rem] grid list-none gap-y-[0.6rem] p-0",
              id === "platforms" && "md:grid-cols-2 md:gap-x-[2rem]",
            )}
          >
            {points.map((point) => (
              <motion.li
                key={point}
                variants={reduceMotion ? undefined : itemVariants}
                className="flex items-start gap-[0.7rem] text-start"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6rem] h-[0.35rem] w-[0.35rem] shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
                />
                <span
                  className={cn(
                    "text-[0.9rem] leading-[1.65] text-text-muted",
                    isRtl ? "font-arabic" : "font-body",
                  )}
                >
                  {point}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <div className="relative z-10 px-[1.75rem] pb-[1.75rem] text-start">
        <h3
          className={cn(
            "text-[1.375rem] font-medium leading-tight text-text-pure",
            isRtl ? "font-arabic" : "font-display",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-[0.6rem] text-[1.0625rem] leading-snug text-text-muted",
            id === "platforms" ? "max-w-[17rem]" : "max-w-[16rem]",
            isRtl ? "font-arabic" : "font-body",
          )}
        >
          {description}
        </p>
      </div>
    </motion.article>
  );
}

export function Services() {
  const locale = useLocale();
  const t = useTranslations("services");
  const reduceMotion = Boolean(useReducedMotion());
  const isRtl = locale === "ar";

  const labels: ServiceVisualLabels = {
    tagNew: t("visual.tagNew"),
    tagReviewed: t("visual.tagReviewed"),
    notifications: notificationKeys.map((key) => ({
      title: t(`visual.notifications.${key}.title`),
      time: t(`visual.notifications.${key}.time`),
    })),
    ai: t("visual.ai"),
    design: {
      title: t("visual.design.title"),
      description: t("visual.design.description"),
      note: t("visual.design.note"),
      defaultAction: t("visual.design.defaultAction"),
      boldAction: t("visual.design.boldAction"),
    },
  };

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative max-w-7xl mx-auto isolate scroll-mt-navbar overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_22%,var(--color-glow-emerald),transparent_58%)]" />

      <div className="container-shell">
        {/* Alignment is logical (start), so it flips by itself in Arabic.
            The old `items-end text-end` for "ar" pushed it to the LEFT in RTL. */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.65, ease }}
          className="mb-2xl flex flex-col items-start gap-md text-start sm:mb-3xl"
        >
          <SectionEyebrow className="mb-2xl sm:mb-3xl">
            {t("eyebrow")}
          </SectionEyebrow>
          <h2
            id="services-title"
            className={cn(
              "max-w-3xl text-headline-lg-mobile font-medium leading-tight text-text-pure sm:text-headline-lg",
              isRtl ? "font-arabic" : "font-display",
            )}
          >
            {t("title")}
          </h2>
          <p
            className={cn(
              "max-w-2xl text-text-muted",
              isRtl
                ? "font-arabic text-body-md"
                : "font-body text-body-md sm:text-body-lg",
            )}
          >
            {t("description")}
          </p>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={{
            hidden: {},
            visible: {
              transition: reduceMotion
                ? { staggerChildren: 0 }
                : { staggerChildren: 0.1, delayChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-12 lg:gap-[2.1rem]"
        >
          {services.map(({ id, gridClass }) => {
            const { group, keys } = servicePoints[id];
            return (
              <ServiceCard
                key={id}
                id={id}
                gridClass={gridClass}
                title={t(`cards.${id}.title`)}
                description={t(`cards.${id}.description`)}
                groupNumber={group}
                groupTitle={t(`groups.g${group}`)}
                points={keys.map((key) => t(`points.${id}.${key}`))}
                showLabel={t("showPoints")}
                hideLabel={t("hidePoints")}
                labels={labels}
                isRtl={isRtl}
                reduceMotion={reduceMotion}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
