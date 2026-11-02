"use client";

import { useGSAP } from "@gsap/react";
import { Layers3, UsersRound } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const metrics = [
  { key: "clients", value: 20, suffix: "+" },
  { key: "projects", value: 12, suffix: "+" },
] as const;

const projectTypes = [
  { key: "incubator", value: 5 },
  { key: "independent", value: 7 },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function Achievements() {
  const t = useTranslations("achievements");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const reduceMotion = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        section.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const digits = Number(el.dataset.digits ?? 1);
          if (!Number.isFinite(target)) return;

          const counter = { value: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(counter, {
                value: target,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = Math.floor(counter.value)
                    .toString()
                    .padStart(digits, "0");
                },
              });
            },
          });
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [isRtl], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="achievements-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate mx-auto max-w-7xl overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_20%,var(--color-glow-emerald),transparent_62%)]"
      />

      <div className="container-shell">
        <SectionEyebrow as="h2" id="achievements-title">
          {t("title")}
        </SectionEyebrow>

        <div className="mt-2xl grid gap-xl md:grid-cols-3 md:items-stretch">
          {metrics.map(({ key, value, suffix }, index) => (
            <motion.article
              key={key}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.75, delay: index * 0.12, ease }
              }
              className="border-s-2 border-primary/70 py-sm ps-lg text-start"
            >
              <p
                className={cn(
                  "text-display-xl-mobile text-3xl font-semibold leading-none text-primary sm:text-display-xl",
                  isRtl ? "font-arabic" : "font-display",
                )}
                aria-label={`${value}${suffix}`}
              >
                <span dir="ltr" className="inline-flex items-baseline">
                  <span data-count={value} data-digits="1">
                    {value}
                  </span>
                  <span>{suffix}</span>
                </span>
              </p>
              <h3
                className={cn(
                  "mt-md text-headline-sm font-medium text-text-pure",
                  isRtl ? "font-arabic" : "font-display",
                )}
              >
                {t(`${key}.title`)}
              </h3>
              <p
                className={cn(
                  "mt-sm max-w-2xl text-text-muted",
                  isRtl
                    ? "font-arabic text-body-md"
                    : "font-body text-body-md sm:text-body-lg",
                )}
              >
                {t(`${key}.description`)}
              </p>
            </motion.article>
          ))}

          <div className="flex flex-col justify-center gap-lg border-s-2 border-border-subtle py-sm ps-lg text-start md:row-span-1">
            {projectTypes.map(({ key, value }) => (
              <motion.div
                key={key}
                initial={
                  reduceMotion ? false : { opacity: 0, x: isRtl ? 20 : -20 }
                }
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.65,
                        delay: key === "incubator" ? 0.12 : 0.24,
                        ease,
                      }
                }
                className="grid grid-cols-[auto_1fr] items-start gap-sm sm:gap-md"
              >
                <span
                  data-count={value}
                  data-digits="2"
                  className="row-span-2 font-display text-headline-md font-semibold leading-none text-text-pure sm:text-headline-lg"
                >
                  {`0${value}`}
                </span>
                <h3
                  className={cn(
                    "text-body-md font-medium text-primary sm:text-body-lg",
                    isRtl ? "font-arabic" : "font-body",
                  )}
                >
                  {t(`${key}.title`)}
                </h3>
                <p
                  className={cn(
                    "text-text-muted",
                    isRtl
                      ? "font-arabic text-body-sm sm:text-body-md"
                      : "font-body text-body-sm sm:text-body-md",
                  )}
                >
                  {t(`${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-3xl grid gap-2xl border-t border-border-hairline pt-xl md:grid-cols-2 md:gap-3xl">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.7, ease }
            }
            className="text-start"
          >
            <div className="flex items-center gap-sm text-primary">
              <Layers3 aria-hidden="true" className="h-6 w-6 shrink-0" />
              <h3
                className={cn(
                  "text-headline-sm font-medium text-text-pure",
                  isRtl ? "font-arabic" : "font-display",
                )}
              >
                {t("expertise.title")}
              </h3>
            </div>
            <p
              className={cn(
                "mt-md text-text-muted",
                isRtl
                  ? "font-arabic text-body-md"
                  : "font-body text-body-md sm:text-body-lg",
              )}
            >
              {t("expertise.description")}
            </p>
          </motion.article>

          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.7, delay: 0.14, ease }
            }
            className="text-start"
          >
            <div className="flex items-center gap-sm text-primary">
              <UsersRound aria-hidden="true" className="h-6 w-6 shrink-0" />
              <h3
                className={cn(
                  "text-headline-sm font-medium text-text-pure",
                  isRtl ? "font-arabic" : "font-display",
                )}
              >
                {t("team.title")}
              </h3>
            </div>
            <p
              className={cn(
                "mt-md text-text-muted",
                isRtl
                  ? "font-arabic text-body-md"
                  : "font-body text-body-md sm:text-body-lg",
              )}
            >
              {t("team.description")}
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
