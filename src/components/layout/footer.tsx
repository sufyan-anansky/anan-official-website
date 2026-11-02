"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Leaf } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { BrandIdentity } from "@/components/layout/brand-identity";
import { Link } from "@/i18n/navigation";

const LINKEDIN_URL = "https://www.linkedin.com/company/anansky";

const footerColumns = [
  {
    key: "company",
    links: [
      { label: "home", href: "/#hero" },
      { label: "services", href: "/#services" },
      { label: "howWeWork", href: "/#how-we-work" },
    ],
  },
  {
    key: "connect",
    links: [
      { label: "contact", href: "/#contact" },
      { label: "faq", href: "/#faq" },
    ],
  },
  {
    key: "explore",
    links: [
      { label: "features", href: "/#features" },
      { label: "sustainability", href: "/#services" },
      { label: "ourApproach", href: "/#how-we-work" },
    ],
  },
] as const;

// Fireflies that replace the trees' old spot in the landscape
const FIREFLIES = [
  { cx: 258, cy: 427, r: 2 },
  { cx: 307, cy: 453, r: 2.5 },
  { cx: 520, cy: 468, r: 1.8 },
  { cx: 940, cy: 462, r: 2 },
  { cx: 1136, cy: 454, r: 2.5 },
  { cx: 1182, cy: 420, r: 2 },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// Wave geometry: every layer is 2 viewBox-widths long and slides by exactly
// one viewBox width (LOOP), which is a whole number of periods, so the loop is seamless.
const PATH_WIDTH = 2880;
const LOOP = 1440;

function wavePath(period: number, amp: number, y: number) {
  const seg = period / 2;
  const count = Math.ceil(PATH_WIDTH / seg);
  let d = `M0 ${y} q ${period / 4} ${-amp} ${seg} 0`;
  for (let i = 1; i < count; i++) d += ` t ${seg} 0`;
  return `${d} V500 H0 Z`;
}

const WAVES = [
  {
    id: "back",
    d: wavePath(720, 46, 255),
    fill: "url(#footer-wave-back)",
    opacity: 0.72,
    duration: 46,
    dir: 1,
    bob: 6,
  },
  {
    id: "mid",
    d: wavePath(480, 36, 325),
    fill: "url(#footer-wave-mid)",
    opacity: 0.76,
    duration: 32,
    dir: -1,
    bob: 8,
  },
  {
    id: "front",
    d: wavePath(360, 26, 395),
    fill: "url(#footer-wave-front)",
    opacity: 0.72,
    duration: 22,
    dir: 1,
    bob: 5,
  },
] as const;

function FooterLandscape({
  reduceMotion,
  isRtl,
  backY,
  midY,
  frontY,
}: {
  reduceMotion: boolean;
  isRtl: boolean;
  backY: MotionValue<number>;
  midY: MotionValue<number>;
  frontY: MotionValue<number>;
}) {
  const parallax = { back: backY, mid: midY, front: frontY };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 500"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[24rem] w-full sm:h-[30rem]"
    >
      <defs>
        {/* Vertical gradients so the sliding wave never shows a seam or shift */}
        <linearGradient id="footer-wave-back" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-surface-container-high)" />
          <stop offset="1" stopColor="var(--color-carbon-elevated)" />
        </linearGradient>
        <linearGradient id="footer-wave-mid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-accent-emerald)" />
          <stop offset="1" stopColor="var(--color-carbon-surface)" />
        </linearGradient>
        <linearGradient id="footer-wave-front" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-accent-leaf)" />
          <stop offset="1" stopColor="var(--color-carbon-elevated)" />
        </linearGradient>
        <radialGradient id="footer-horizon">
          <stop offset="0" stopColor="var(--color-primary)" stopOpacity=".24" />
          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Horizon glow, slowly breathing */}
      <motion.ellipse
        cx="720"
        cy="420"
        rx="580"
        ry="260"
        fill="url(#footer-horizon)"
        animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Moving waves */}
      {WAVES.map((wave) => {
        const direction = isRtl ? -wave.dir : wave.dir;

        return (
          <motion.g key={wave.id} style={{ y: parallax[wave.id] }}>
            <motion.g
              animate={
                reduceMotion ? undefined : { y: [0, wave.bob, 0, -wave.bob, 0] }
              }
              transition={{
                duration: wave.duration / 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.path
                d={wave.d}
                fill={wave.fill}
                opacity={wave.opacity}
                initial={{ x: direction === 1 ? 0 : -LOOP }}
                animate={
                  reduceMotion
                    ? undefined
                    : { x: direction === 1 ? [0, -LOOP] : [-LOOP, 0] }
                }
                transition={{
                  duration: wave.duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.g>
          </motion.g>
        );
      })}

      {/* Fireflies */}
      <g fill="var(--color-primary)">
        {FIREFLIES.map((f, i) => (
          <motion.circle
            key={`${f.cx}-${f.cy}`}
            cx={f.cx}
            cy={f.cy}
            r={f.r}
            initial={{ opacity: 0.65 }}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: [0.15, 0.9, 0.15],
                    cy: [f.cy, f.cy - 14 - (i % 3) * 5, f.cy],
                    cx: [f.cx, f.cx + (i % 2 === 0 ? 8 : -8), f.cx],
                  }
            }
            transition={{
              duration: 4 + (i % 3),
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>
    </svg>
  );
}

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const brand = useTranslations("brand");
  const isRtl = locale === "ar";
  const reduceMotion = Boolean(useReducedMotion());

  const footerRef = useRef<HTMLElement>(null);

  // Scroll parallax for the hills
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const backY = useTransform(
    scrollYProgress,
    [0, 1],
    [reduceMotion ? 0 : 36, 0],
  );
  const midY = useTransform(
    scrollYProgress,
    [0, 1],
    [reduceMotion ? 0 : 22, 0],
  );
  const frontY = useTransform(
    scrollYProgress,
    [0, 1],
    [reduceMotion ? 0 : 10, 0],
  );

  // Cursor spotlight inside the card
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, color-mix(in srgb, var(--color-primary) 13%, transparent), transparent 70%)`;

  return (
    <footer
      ref={footerRef}
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden border-t border-outline-variant/40 bg-[linear-gradient(180deg,var(--color-carbon-base),color-mix(in_srgb,var(--color-carbon-surface)_88%,var(--color-accent-emerald)))] px-margin-mobile pb-lg pt-2xl sm:px-margin-tablet sm:pb-xl sm:pt-3xl lg:px-margin"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: EASE }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || reduceMotion) return;
          const rect = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - rect.left);
          my.set(e.clientY - rect.top);
        }}
        onPointerLeave={() => {
          mx.set(-999);
          my.set(-999);
        }}
        className="relative isolate mx-auto min-h-[35rem] max-w-7xl overflow-hidden rounded-[2rem] border border-outline-variant/40 bg-carbon-surface/70 shadow-2xl sm:min-h-[38rem] sm:rounded-[2.5rem]"
      >
        <FooterLandscape
          reduceMotion={reduceMotion}
          isRtl={isRtl}
          backY={backY}
          midY={midY}
          frontY={frontY}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-carbon-surface)_0%,color-mix(in_srgb,var(--color-carbon-surface)_96%,transparent)_42%,transparent_78%)]"
        />
        <motion.div
          aria-hidden="true"
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 -z-10"
        />

        <div className="relative z-10 grid gap-2xl px-lg pb-40 pt-xl sm:grid-cols-2 sm:px-xl sm:pb-48 sm:pt-2xl lg:grid-cols-12 lg:gap-xl lg:px-3xl lg:pt-3xl">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="sm:col-span-2 lg:col-span-5"
          >
            <Link
              href="/#hero"
              aria-label={t("brandHome")}
              className="inline-flex min-h-touch items-center gap-md rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-carbon-surface"
            >
              <BrandIdentity
                name={brand("name")}
                descriptor={brand("descriptor")}
                locale={locale}
              />
            </Link>
            <p
              className={`mt-md max-w-sm text-text-muted ${
                isRtl ? "font-arabic text-body-md" : "font-body text-body-md"
              }`}
            >
              {t("description")}
            </p>

            <div className="mt-lg flex flex-wrap items-center gap-sm">
              <span className="inline-flex items-center gap-sm rounded-full border border-primary/20 bg-primary/5 px-md py-xs text-primary">
                <motion.span
                  aria-hidden="true"
                  animate={
                    reduceMotion ? undefined : { rotate: [0, 14, -14, 0] }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex"
                >
                  <Leaf className="h-4 w-4" />
                </motion.span>
                <span
                  className={
                    isRtl
                      ? "font-arabic text-body-sm"
                      : "font-body text-body-sm"
                  }
                >
                  {t("tagline")}
                </span>
              </span>

              {/* LinkedIn */}
              <motion.a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("social.linkedin")}
                title={t("social.linkedin")}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.06 }}
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="grid h-11 w-11 place-items-center rounded-full border border-outline-variant/60 bg-carbon-base/60 text-text-muted shadow-lg backdrop-blur-md transition-colors hover:border-primary/50 hover:bg-primary hover:text-on-primary hover:shadow-[0_0_24px_var(--color-glow-emerald)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <LinkedInIcon className="h-[1.1rem] w-[1.1rem]" />
              </motion.a>
            </div>
          </motion.div>

          {footerColumns.map(({ key, links }, columnIndex) => (
            <motion.nav
              key={key}
              custom={columnIndex + 1}
              variants={fadeUp}
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              aria-label={t(`columns.${key}`)}
              className="lg:col-span-2"
            >
              <h2
                className={`mb-md text-text-pure ${
                  isRtl
                    ? "font-arabic text-body-md font-semibold"
                    : "font-display text-headline-sm"
                }`}
              >
                {t(`columns.${key}`)}
              </h2>
              <ul className="flex flex-col items-start gap-xs">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`group inline-flex min-h-touch items-center gap-xs rounded-md text-text-muted transition-all duration-300 hover:translate-x-1 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rtl:hover:-translate-x-1 ${
                        isRtl
                          ? "font-arabic text-body-md"
                          : "font-body text-body-md"
                      }`}
                    >
                      {t(`links.${label}`)}
                      <ArrowUpRight
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100 ${
                          isRtl ? "-scale-x-100" : ""
                        }`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="absolute inset-x-lg bottom-lg z-10 flex flex-col items-center justify-between gap-md rounded-2xl border border-outline-variant/40 bg-carbon-surface/90 px-md py-md shadow-xl backdrop-blur-xl sm:inset-x-xl sm:bottom-xl sm:flex-row sm:px-lg"
        >
          <p
            className={`text-center text-text-muted sm:text-start ${
              isRtl ? "font-arabic text-body-sm" : "font-body text-body-sm"
            }`}
          >
            {t("copyright")}
          </p>
          <a
            href="#hero"
            className={`group inline-flex min-h-touch items-center gap-sm rounded-full px-md text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isRtl ? "font-arabic text-body-sm" : "font-body text-body-sm"
            }`}
          >
            {t("backToTop")}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:-translate-y-1"
            />
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
