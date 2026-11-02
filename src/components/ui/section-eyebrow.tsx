"use client";

import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SectionEyebrowProps = Readonly<{
  children: ReactNode;
  as?: "span" | "h2";
  id?: string;
  className?: string;
}>;

export function SectionEyebrow({
  children,
  as = "span",
  id,
  className,
}: SectionEyebrowProps) {
  const isRtl = useLocale() === "ar";
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const label = root?.querySelector<HTMLElement>("[data-eyebrow-label]");
      const rule = root?.querySelector<HTMLElement>("[data-eyebrow-rule]");
      if (!label || !rule) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          label,
          { autoAlpha: 0, y: 24, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
        gsap.fromTo(
          rule,
          {
            scaleX: 0,
            transformOrigin: isRtl ? "right center" : "left center",
          },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: root,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [isRtl], revertOnUpdate: true },
  );

  const labelClassName = cn(
    "text-headline-md font-medium leading-tight text-primary sm:text-headline-lg",
    isRtl ? "font-arabic" : "font-display",
  );

  return (
    <div
      ref={rootRef}
      className={cn("flex w-full items-center gap-md text-start", className)}
    >
      {as === "h2" ? (
        <h2 id={id} data-eyebrow-label className={labelClassName}>
          {children}
        </h2>
      ) : (
        <span data-eyebrow-label className={labelClassName}>
          {children}
        </span>
      )}
      <span
        data-eyebrow-rule
        aria-hidden="true"
        className="h-px min-w-5 flex-1 bg-primary shadow-[0_0_12px_var(--color-primary)]"
      />
    </div>
  );
}
