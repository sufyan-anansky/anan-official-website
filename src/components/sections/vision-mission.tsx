"use client";

import Image from "next/image";
import { Eye, Rocket } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const cards = [
  {
    key: "vision",
    icon: Eye,
    image: "/images/our%20visions/futuristic.webp",
  },
  {
    key: "mission",
    icon: Rocket,
    image: "/images/our%20visions/rocket.webp",
  },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function VisionMission() {
  const t = useTranslations("visionMission");
  const locale = useLocale();
  const reduceMotion = Boolean(useReducedMotion());
  const isRtl = locale === "ar";

  return (
    <section
      id="vision-mission"
      aria-labelledby="vision-mission-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate mx-auto max-w-7xl overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_18%,var(--color-glow-emerald),transparent_58%)]"
      />

      <div className="container-shell">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.65, ease }}
          className="mb-2xl flex flex-col items-start gap-md text-start sm:mb-3xl"
        >
          <SectionEyebrow as="h2" id="vision-mission-title">
            {t("title")}
          </SectionEyebrow>
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

        <div className="grid grid-cols-1 gap-lg md:grid-cols-2 md:gap-xl">
          {cards.map(({ key, icon: Icon, image }, index) => (
            <motion.article
              key={key}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.75, delay: index * 0.14, ease }
              }
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -5,
                      transition: { duration: 0.25, ease },
                    }
              }
              className="group relative overflow-hidden rounded-2xl border border-border-hairline bg-carbon-surface shadow-xl"
            >
              <div className="relative h-56 overflow-hidden sm:h-72">
                <Image
                  src={image}
                  alt={t(`${key}.imageAlt`)}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={cn(
                    "object-cover",
                    !reduceMotion &&
                      "transition-transform duration-700 group-hover:scale-[1.03]",
                  )}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-carbon-surface via-carbon-surface/10 to-transparent"
                />
              </div>

              <div className="relative px-lg pb-xl text-start sm:px-xl sm:pb-2xl">
                <div className="-mt-9 mb-md flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-carbon-surface text-primary shadow-[0_0_28px_var(--color-glow-emerald)]">
                  {key === "vision" ? (
                    <motion.span
                      animate={reduceMotion ? undefined : { x: [-2, 2, -2] }}
                      transition={
                        reduceMotion
                          ? undefined
                          : {
                              duration: 2.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      className="inline-flex"
                    >
                      <Icon aria-hidden="true" className="h-8 w-8" />
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={
                        reduceMotion
                          ? undefined
                          : { y: [0, -4, 0], rotate: [0, -4, 0] }
                      }
                      transition={
                        reduceMotion
                          ? undefined
                          : {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      className="inline-flex"
                    >
                      <Icon aria-hidden="true" className="h-8 w-8" />
                    </motion.span>
                  )}
                </div>
                <h3
                  className={cn(
                    "text-headline-md text-text-pure font-medium text-2xl",
                    isRtl ? "font-arabic" : "font-display",
                  )}
                >
                  {t(`${key}.title`)}
                </h3>
                <p
                  className={cn(
                    "mt-md text-text-muted",
                    isRtl
                      ? "font-arabic text-body-md sm:text-body-lg"
                      : "font-body text-body-md sm:text-body-lg",
                  )}
                >
                  {t(`${key}.description`)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
