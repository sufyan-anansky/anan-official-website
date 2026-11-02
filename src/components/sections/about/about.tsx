"use client";

import { useGSAP } from "@gsap/react";
import { ArrowDown, Blocks, BriefcaseBusiness, Handshake } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AboutOrbit,
  type PrincipleKey,
} from "@/components/sections/about/about-orbit";
import { ButtonLink } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PRINCIPLES = [
  { key: "solutions", icon: Blocks },
  { key: "business", icon: BriefcaseBusiness },
  { key: "partnership", icon: Handshake },
] as const;

export function About() {
  const locale = useLocale();
  const t = useTranslations("about");
  const isRtl = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const [activePrinciple, setActivePrinciple] = useState<PrincipleKey | null>(
    null,
  );

  // Split by words only, so Arabic letters stay joined
  const titleWords = t("title").split(" ");

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const q = <T extends HTMLElement>(sel: string) =>
        section.querySelector<T>(sel);
      const qa = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, section);
      const dir = isRtl ? -1 : 1;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const glow = q("[data-glow]");
        const words = qa("[data-word]");
        const paragraphs = qa("[data-para]");
        const cta = q("[data-cta]");
        const ctaArrow = q("[data-cta-arrow]");
        const visual = q("[data-visual]");
        const visualInner = q("[data-visual-inner]");
        const lineWrap = q("[data-line-wrap]");
        const line = q("[data-line]");
        const dot = q("[data-line-dot]");
        const cards = qa("[data-card]");

        if (
          !glow ||
          !cta ||
          !ctaArrow ||
          !visual ||
          !visualInner ||
          !lineWrap ||
          !line ||
          !dot
        ) {
          return;
        }

        /* Background glow: drifts and grows while the section scrolls by */
        gsap.fromTo(
          glow,
          { yPercent: 14, scale: 0.9 },
          {
            yPercent: -14,
            scale: 1.25,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        /* Title: words light up one by one as you scroll */
        gsap.fromTo(
          words,
          { autoAlpha: 0.12, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: "#about-title",
              start: "top 88%",
              end: "top 38%",
              scrub: 0.6,
            },
          },
        );

        /* Paragraphs */
        paragraphs.forEach((p) => {
          gsap.fromTo(
            p,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: p,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        /* CTA */
        gsap.fromTo(
          cta,
          { autoAlpha: 0, y: 24, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: cta,
              start: "top 94%",
              toggleActions: "play none none reverse",
            },
          },
        );
        gsap.to(ctaArrow, {
          y: 4,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        /* Visual: whole block drifts upward (parallax) */
        gsap.fromTo(
          visual,
          { y: 60 },
          {
            y: -60,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );

        /* Visual: scales / fades in as you scroll to it (reversible) */
        gsap.fromTo(
          visualInner,
          { scale: 0.6, autoAlpha: 0, rotate: -12 * dir },
          {
            scale: 1,
            autoAlpha: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: visual,
              start: "top 95%",
              end: "top 45%",
              scrub: 0.8,
            },
          },
        );

        /* Progress line + glowing dot travel together */
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: lineWrap,
              start: "top 85%",
              end: "bottom 60%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(line, { scaleX: 0 }, { scaleX: 1 }, 0)
          .fromTo(
            dot,
            { x: 0, autoAlpha: 1 },
            { x: () => dir * lineWrap.clientWidth, autoAlpha: 1 },
            0,
          );

        /* Principle cards: stagger across the row, icon pops, all reversible */
        const cols = window.innerWidth >= 768 ? 3 : 1;
        cards.forEach((card, i) => {
          const icon = card.querySelector("[data-icon]");
          const copy = card.querySelectorAll("[data-copy]");

          gsap
            .timeline({
              delay: (i % cols) * 0.12,
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            })
            .fromTo(
              card,
              { autoAlpha: 0, y: 56, scale: 0.95 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: "power3.out",
              },
            )
            .fromTo(
              icon,
              { scale: 0, rotate: -90 },
              { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" },
              "-=0.5",
            )
            .fromTo(
              copy,
              { autoAlpha: 0, x: dir * 16 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
              },
              "-=0.4",
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
      id="about"
      aria-labelledby="about-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate mx-auto max-w-7xl scroll-mt-navbar overflow-hidden border-b border-border-hairline py-4xl sm:py-5xl"
    >
      <div
        data-glow
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,var(--color-glow-emerald),transparent_55%)]"
      />

      <div className="container-shell">
        <div className="grid items-center gap-3xl lg:grid-cols-12 lg:gap-2xl">
          <div className="text-start lg:col-span-7">
            <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>

            <h2
              id="about-title"
              aria-label={t("title")}
              className={`mt-lg max-w-3xl text-headline-lg-mobile font-medium leading-tight text-text-pure sm:text-headline-lg ${
                isRtl ? "font-arabic" : "font-display"
              }`}
            >
              {titleWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  data-word
                  aria-hidden="true"
                  className="me-[0.25em] inline-block"
                >
                  {word}
                </span>
              ))}
            </h2>

            <p
              data-para
              className={`mt-lg max-w-2xl text-text-muted ${
                isRtl
                  ? "font-arabic text-body-md"
                  : "font-body text-body-md sm:text-body-lg"
              }`}
            >
              {t("description")}
            </p>

            <div data-cta className="mt-xl w-full sm:inline-block sm:w-auto">
              <ButtonLink
                href="/#how-we-work"
                variant="secondary"
                className={`w-full rounded-full sm:w-auto ${
                  isRtl ? "font-arabic" : "font-body"
                }`}
              >
                {t("link")}
                <span data-cta-arrow className="inline-flex">
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </span>
              </ButtonLink>
            </div>
          </div>

          {/* Interactive orbit */}
          <div
            data-visual
            className="relative mx-auto w-full max-w-sm will-change-transform lg:col-span-5 lg:max-w-none"
          >
            <div data-visual-inner>
              <AboutOrbit
                isRtl={isRtl}
                active={activePrinciple}
                onSelect={setActivePrinciple}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-3xl sm:mt-4xl">
          <div data-line-wrap className="absolute inset-x-0 top-0 h-px">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-outline-variant/40"
            />
            <span
              data-line
              aria-hidden="true"
              className="absolute inset-0 origin-left bg-gradient-to-r from-primary via-accent-leaf to-transparent rtl:origin-right rtl:bg-gradient-to-l"
            />
            <span
              data-line-dot
              aria-hidden="true"
              className="absolute start-0 top-0 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_var(--color-primary)]"
            />
          </div>

          <ul className="grid gap-md pt-xl md:grid-cols-3">
            {PRINCIPLES.map(({ key, icon: Icon }) => {
              const isActive = activePrinciple === key;

              return (
                <li
                  key={key}
                  data-card
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setActivePrinciple(key);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setActivePrinciple(null);
                  }}
                  className={cn(
                    "flex items-start gap-md rounded-2xl border p-md transition-all duration-300 sm:p-lg",
                    isActive
                      ? "border-primary/60 bg-primary/10 shadow-[0_0_40px_var(--color-glow-emerald)]"
                      : "border-outline-variant/30 bg-carbon-surface/55 hover:border-primary/30",
                  )}
                >
                  <span
                    data-icon
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors duration-300",
                      isActive
                        ? "border-primary bg-primary text-on-primary"
                        : "border-primary/20 bg-primary/10 text-primary",
                    )}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="text-start">
                    <h3
                      data-copy
                      className={`text-headline-sm font-medium text-text-pure ${
                        isRtl ? "font-arabic" : "font-display"
                      }`}
                    >
                      {t(`principles.${key}.title`)}
                    </h3>
                    <p
                      data-copy
                      className={`mt-xs text-text-muted ${
                        isRtl
                          ? "font-arabic text-body-md"
                          : "font-body text-body-md"
                      }`}
                    >
                      {t(`principles.${key}.description`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
