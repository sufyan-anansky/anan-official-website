"use client";

import { useGSAP } from "@gsap/react";
import {
  PackageCheck,
  Target,
  Maximize,
  CheckCircle2,
  Cpu,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARDS: { key: string; icon: LucideIcon }[] = [
  { key: "smartDaily", icon: PackageCheck },
  { key: "encryptedTasks", icon: Target },
  { key: "complianceReady", icon: Maximize },
  { key: "teamSync", icon: CheckCircle2 },
  { key: "analytics", icon: Cpu },
  { key: "support", icon: Handshake },
];

export function Features() {
  const locale = useLocale();
  const t = useTranslations("features");
  const isRtl = locale === "ar";

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const progress = progressRef.current;
        if (!section || !viewport || !track || !progress) return;

        // How far the track must travel so the last card reaches the edge
        const getDistance = () =>
          Math.max(0, track.scrollWidth - viewport.clientWidth);

        // LTR: scroll down -> cards go left. RTL: scroll down -> cards go right.
        const direction = isRtl ? 1 : -1;

        gsap.set(progress, { scaleX: 0 });

        gsap.to(track, {
          x: () => direction * getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance() + window.innerHeight * 0.25}`,
            pin: true,
            scrub: 0.7, // smooth + reverses automatically when scrolling up
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
          },
        });

        // Cards lift/scale slightly as they pass through the center
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", track);
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.55, scale: 0.94 },
            {
              opacity: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: gsap.getTweensOf(track)[0],
                start: isRtl ? "left 40%" : "left 90%",
                end: isRtl ? "left 90%" : "left 40%",
                scrub: true,
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [isRtl], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      id="features"
      aria-labelledby="features-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative max-w-7xl mx-auto isolate flex min-h-screen scroll-mt-navbar flex-col justify-center overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_48%,var(--color-glow-emerald),transparent_68%)]"
      />

      <div className="container-shell w-full">
        <header className="mb-xl flex flex-col items-start gap-md text-start sm:mb-3xl">
          <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
          <h2
            id="features-title"
            className={`max-w-4xl text-headline-lg-mobile font-medium text-text-pure sm:text-headline-lg ${
              isRtl ? "font-arabic !leading-[1.5]" : "font-display"
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

        {/* Viewport: the track slides inside; section clips at the screen edge */}
        <div
          ref={viewportRef}
          className="motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto"
        >
          <div
            ref={trackRef}
            className="flex w-max gap-lg will-change-transform"
          >
            {CARDS.map(({ key, icon: Icon }) => (
              <article
                key={key}
                data-card
                className="relative isolate flex min-h-[14rem] sm:min-h-[18rem] w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border border-outline-variant/50 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-surface-container)_78%,transparent),color-mix(in_srgb,var(--color-carbon-surface)_96%,transparent))] p-md shadow-2xl sm:w-[26rem] sm:p-lg"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_20%,var(--color-glow-emerald),transparent_52%)]"
                />

                <div
                  aria-hidden="true"
                  className="w-fit rounded-full bg-gradient-to-br from-primary/80 via-primary/25 to-outline-variant/20 p-px shadow-[0_0_32px_var(--color-glow-emerald)]"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-primary/20 bg-carbon-elevated text-primary sm:h-[4.5rem] sm:w-[4.5rem]">
                    <Icon className="h-5 w-5 sm:h-8 sm:w-8" />
                  </span>
                </div>

                <div className="mt-md text-start">
                  <h4
                    className={`text-headline-sm font-semibold text-text-pure sm:text-headline-md ${
                      isRtl ? "font-arabic" : "font-display"
                    }`}
                  >
                    {t(`cards.${key}.title`)}
                  </h4>
                  <p
                    className={`mt-md text-text-muted ${
                      isRtl
                        ? "font-arabic text-body-md"
                        : "font-body text-body-md sm:text-body-lg"
                    }`}
                  >
                    {t(`cards.${key}.description`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Scroll progress, fills from the start side in either language */}
        <div
          aria-hidden="true"
          className="mt-2xl h-px w-full bg-outline-variant/30 motion-reduce:hidden"
        >
          <span
            ref={progressRef}
            className={`block h-full bg-primary shadow-[0_0_12px_var(--color-primary)] ${
              isRtl ? "origin-right" : "origin-left"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
