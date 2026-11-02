"use client";

import { useGSAP } from "@gsap/react";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WorkflowVisual } from "@/components/sections/how-we-work/workflow-visual";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  "discovery",
  "planning",
  "design",
  "development",
  "launch",
  "support",
] as const;

export function HowWeWork() {
  const locale = useLocale();
  const t = useTranslations("howWeWork");
  const isRtl = locale === "ar";
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-process-step]",
          section,
        );

        items.forEach((item, index) => {
          const fill = item.querySelector<HTMLElement>("[data-fill]");
          const body = item.querySelector<HTMLElement>("[data-body]");

          // Green line segment fills from this node down to the next one
          if (fill) {
            gsap.fromTo(
              fill,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top 60%",
                  end: "bottom 60%",
                  scrub: true,
                },
              },
            );
          }

          // Soft reveal as each step enters
          if (body) {
            gsap.fromTo(
              body,
              { autoAlpha: 0, x: isRtl ? 24 : -24, y: 16 },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 85%", once: true },
              },
            );
          }

          // Active node (white + check) follows the scroll in both directions
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            onEnter: () => setActiveStep(index),
            onLeaveBack: () => setActiveStep(Math.max(0, index - 1)),
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
      id="how-we-work"
      aria-labelledby="how-we-work-title"
      dir={isRtl ? "rtl" : "ltr"}
      // overflow-clip (not hidden) so the sticky left column keeps working
      className="relative max-w-7xl mx-auto isolate scroll-mt-navbar overflow-clip border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_35%,var(--color-glow-emerald),transparent_55%)]"
      />

      <div className="container-shell grid gap-3xl lg:grid-cols-2 lg:gap-5xl">
        {/* Pinned left column */}
        <div className="flex flex-col gap-2xl lg:sticky lg:top-[calc(var(--navbar-height)+2rem)] lg:self-start">
          <div className="flex flex-col gap-md">
            <h2
              id="how-we-work-title"
              className={`max-w-md text-headline-lg-mobile font-bold uppercase leading-[1.05] tracking-tight sm:text-headline-lg ${
                isRtl ? "font-arabic" : "font-display"
              }`}
            >
              {t("title")}
            </h2>
          </div>

          <WorkflowVisual activeStep={activeStep} />
        </div>

        {/* Timeline */}
        <ol aria-label={t("stepsLabel")} className="relative">
          {STEPS.map((step, index) => {
            const isActive = index <= activeStep;
            const isLast = index === STEPS.length - 1;

            return (
              <li
                key={step}
                data-process-step
                aria-current={activeStep === index ? "step" : undefined}
                className={`relative grid grid-cols-[2rem_3.5rem_minmax(0,1fr)] items-start gap-x-md sm:grid-cols-[2rem_4.5rem_minmax(0,1fr)] sm:gap-x-lg ${
                  isLast ? "min-h-0 pb-0" : "min-h-[10rem] lg:min-h-[15rem]"
                }`}
              >
                {/* Node + connector */}
                <div className="relative h-full">
                  <span
                    aria-hidden="true"
                    className={`relative z-10 mx-auto grid h-8 w-8 place-items-center rounded-full border transition-all duration-500 ${
                      isActive
                        ? "border-text-pure bg-text-pure text-carbon-base shadow-[0_0_20px_var(--color-glow-emerald)]"
                        : "border-outline-variant bg-carbon-elevated text-text-dim"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>

                  {!isLast && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 top-8 mx-auto w-px bg-outline-variant/60"
                      />
                      <span
                        data-fill
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 top-8 mx-auto w-px origin-top bg-primary shadow-[0_0_10px_var(--color-primary)] motion-reduce:scale-y-100"
                      />
                    </>
                  )}
                </div>

                {/* Big number */}
                <span
                  data-body
                  aria-hidden="true"
                  className="-mt-1 font-display text-[3.5rem] font-bold leading-none text-primary sm:text-[4.5rem]"
                >
                  {index + 1}
                </span>

                {/* Copy */}
                <div data-body className="text-start">
                  <h3
                    className={`text-headline-sm font-semibold text-text-pure sm:text-headline-md ${
                      isRtl ? "font-arabic" : "font-display"
                    }`}
                  >
                    {t(`steps.${step}.title`)}
                  </h3>
                  <p
                    className={`mt-sm max-w-md text-text-muted ${
                      isRtl
                        ? "font-arabic text-body-md"
                        : "font-body text-body-md sm:text-body-lg"
                    }`}
                  >
                    {t(`steps.${step}.description`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
