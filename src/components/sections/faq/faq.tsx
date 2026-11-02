"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

const QUESTIONS = [
  "solutions",
  "fit",
  "gettingStarted",
  "customization",
  "data",
  "timing",
] as const;

export function Faq() {
  const locale = useLocale();
  const t = useTranslations("faq");
  const isRtl = locale === "ar";
  const reduceMotion = Boolean(useReducedMotion());
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate scroll-mt-navbar overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_20%,var(--color-glow-emerald),transparent_68%)]"
      />

      <div className="container-shell">
        <header className="mx-auto mb-2xl flex max-w-3xl flex-col items-center gap-md text-center sm:mb-3xl">
          <h2
            id="faq-title"
            className={`text-headline-lg-mobile font-medium leading-tight text-text-pure sm:text-headline-lg ${
              isRtl ? "font-arabic" : "font-display"
            }`}
          >
            {t("title")}
          </h2>
          <p
            className={`max-w-2xl text-text-muted ${
              isRtl
                ? "font-arabic text-body-md"
                : "font-body text-body-md sm:text-body-lg"
            }`}
          >
            {t("description")}
          </p>
        </header>

        <ol
          aria-label={t("listLabel")}
          className="mx-auto max-w-5xl divide-y divide-outline-variant/40 border-y border-outline-variant/40"
        >
          {QUESTIONS.map((question, index) => {
            const isOpen = openQuestion === question;
            const panelId = `faq-answer-${question}`;

            return (
              <li key={question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenQuestion(isOpen ? null : question)}
                  className="group flex min-h-16 w-full items-center gap-md py-md text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:min-h-20 sm:gap-lg sm:py-lg"
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-label-mono-sm transition-colors duration-200 sm:h-8 sm:w-8 ${
                      isOpen
                        ? "border-primary bg-primary text-on-primary"
                        : "border-primary/30 bg-primary/10 text-primary"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    id={`faq-question-${question}`}
                    className={`flex-1 text-sm  text-headline-sm font-medium transition-colors duration-200 sm:text-headline-md ${
                      isOpen
                        ? "text-text-pure"
                        : "text-text-pure group-hover:text-primary"
                    } ${isRtl ? "font-arabic" : "font-display"}`}
                  >
                    {t(`items.${question}.question`)}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.span>
                </button>

                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={`faq-question-${question}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  initial={false}
                  animate={
                    isOpen
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <p
                    className={`pb-lg text-sm sm:text-base pe-12 text-text-muted sm:pb-xl sm:pe-16 ${
                      isRtl
                        ? "font-arabic text-body-md"
                        : "font-body text-body-md sm:text-body-lg"
                    }`}
                  >
                    {t(`items.${question}.answer`)}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ol>

        <p
          className={`mx-auto mt-xl flex flex-wrap items-center justify-center gap-xs text-center text-text-muted ${
            isRtl ? "font-arabic text-body-md" : "font-body text-body-md"
          }`}
        >
          {t("moreQuestions")}
          <Link
            href="/#contact"
            className="inline-flex min-h-touch items-center gap-xs rounded-md px-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("contactLink")}
            <ArrowDown
              aria-hidden="true"
              className={`h-4 w-4 ${isRtl ? "-scale-x-100" : ""}`}
            />
          </Link>
        </p>
      </div>
    </section>
  );
}
