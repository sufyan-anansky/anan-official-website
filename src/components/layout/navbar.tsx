"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigationSections } from "@/content/navigation";
import { Link } from "@/i18n/navigation";
import { BrandIdentity } from "@/components/layout/brand-identity";
import {
  mobileMenuItemVariants,
  mobileMenuListVariants,
  mobileMenuVariants,
} from "@/lib/animation-variants";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useActiveSection } from "@/hooks/use-active-section";

const SAAS_PRODUCT_URL =
  "https://gymtech-web-prod.graysky-52897fef.uaenorth.azurecontainerapps.io/";

  const WHATSAPP_AI_AGENT_PRODUCT_URL =
  "https://whatsapp-agent.uaenorth.cloudapp.azure.com/whatsapp-agent/login";

const productLinks = [
  { translationKey: "saas", href: SAAS_PRODUCT_URL },
  { translationKey: "whatsappAiAgent", href: WHATSAPP_AI_AGENT_PRODUCT_URL },
] as const;

function ProductMenuLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/**
 * SVG displacement filter used by `backdrop-filter: url(#liquid-glass-refraction)`.
 * It bends whatever sits behind the glass slightly, which is what separates
 * liquid glass from plain frosted blur. Only Chromium honours url() filters in
 * backdrop-filter; other browsers get the blur + specular version (see CSS).
 */
function LiquidGlassFilters() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        <filter
          id="liquid-glass-refraction"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.02"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function Navbar() {
  const locale = useLocale();
  const t = useTranslations("navigation");
  const brand = useTranslations("brand");
  const shouldReduceMotion = useReducedMotion();
  const { activeSection, setActiveSection } = useActiveSection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [supportsRefraction] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pendingSectionRef = useRef<string | null>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Make the glass denser once content scrolls underneath it.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusableElements = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSectionNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  // A light source that follows the cursor across the pill. Writes CSS
  // variables directly so pointer movement never triggers a React render.
  const handlePillPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
  };

  const handlePillPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--glass-x");
    event.currentTarget.style.removeProperty("--glass-y");
  };

  const menuVariants =
    shouldReduceMotion !== false
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0 } },
          exit: { opacity: 0, transition: { duration: 0 } },
        }
      : mobileMenuVariants;

  const menuListVariants =
    shouldReduceMotion !== false
      ? {
          hidden: {},
          visible: { transition: { staggerChildren: 0 } },
          exit: { transition: { staggerChildren: 0 } },
        }
      : mobileMenuListVariants;

  const menuItemVariants =
    shouldReduceMotion !== false
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0 } },
          exit: { opacity: 0, transition: { duration: 0 } },
        }
      : mobileMenuItemVariants;

  // The glass lens slides between links like a drop of liquid.
  const lensTransition =
    shouldReduceMotion !== false
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };

  return (
    <header
      className="navbar-glass-bar sticky top-0 z-[var(--navbar-layer)]"
      data-refraction={supportsRefraction ? "true" : "false"}
      data-scrolled={isScrolled ? "true" : "false"}
    >
      <LiquidGlassFilters />

      <div
        className="navbar-glass-pill container-shell relative flex min-h-navbar items-center justify-between gap-md lg:mx-auto lg:mt-sm lg:grid lg:min-h-[calc(var(--navbar-height)-var(--space-md))] lg:max-w-7xl lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:rounded-full lg:px-lg lg:shadow-[var(--shadow-navigation-glass)]"
        onPointerMove={handlePillPointerMove}
        onPointerLeave={handlePillPointerLeave}
      >
        <Link
          href="/#hero"
          className="inline-flex min-h-touch w-fit items-center gap-md rounded-lg px-md py-sm no-underline lg:px-xl lg:py-md"
          aria-label={t("companyName")}
          onClick={() => handleSectionNavigate("hero")}
        >
          <BrandIdentity
            name={brand("name")}
            descriptor={brand("descriptor")}
            locale={locale}
            priority
          />
        </Link>

        <nav
          className="hidden items-center justify-center lg:flex"
          aria-label={t("mainNavigation")}
        >
          <ul className="flex list-none items-center gap-sm p-0">
            {navigationSections.map(({ id, translationKey }) => {
              const isActive = activeSection === id;

              return (
                <li
                  key={id}
                  className={id === "products" ? "group relative" : undefined}
                >
                  <Link
                    href={`#${id}`}
                    className="relative isolate inline-flex min-h-touch items-center rounded-full px-lg font-body text-body-md text-text-muted transition-colors hover:bg-white/5 hover:text-text-pure focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[3px] aria-[current=location]:text-text-pure"
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => handleSectionNavigate(id)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-glass-lens"
                        className="glass-lens absolute inset-0 -z-10"
                        style={{ borderRadius: 9999 }}
                        transition={lensTransition}
                        aria-hidden="true"
                      />
                    )}
                    {t(translationKey)}
                    {id === "products" && (
                      <ChevronDown
                        aria-hidden="true"
                        className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180 rtl:ml-0 rtl:mr-1"
                      />
                    )}
                  </Link>
                  {id === "products" && (
                    <div className="invisible absolute left-1/2 top-full z-50 w-max -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul
                        aria-label={t("products")}
                        className="glass-panel m-0 min-w-60 list-none rounded-2xl p-sm shadow-[var(--shadow-navigation-glass)]"
                      >
                        {productLinks.map(({ translationKey: productKey, href }) => (
                          <li key={productKey}>
                            <ProductMenuLink
                              href={href}
                              className="flex min-h-touch items-center rounded-xl px-md font-body text-body-sm text-text-muted no-underline transition-colors hover:bg-white/5 hover:text-text-pure focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]"
                            >
                              {t(productKey)}
                            </ProductMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center justify-end lg:flex">
          <LanguageSwitcher activeSection={activeSection} />
        </div>

        <div className="flex items-center justify-end gap-sm lg:hidden">
          <LanguageSwitcher activeSection={activeSection} />
          <button
            ref={menuButtonRef}
            type="button"
            className="glass-control relative inline-flex min-h-touch min-w-touch items-center justify-center gap-sm rounded-full px-md font-body text-body-sm text-text-pure transition-colors hover:text-accent-emerald hover:[--glass-spec:0.3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[3px]"
            aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={isMenuOpen}
            aria-controls={isMenuOpen ? "mobile-navigation-dialog" : undefined}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">
              {isMenuOpen ? t("close") : t("menu")}
            </span>
            <span className="relative inline-block h-4 w-4" aria-hidden="true">
              <span
                className={`absolute left-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-current transition-all ${isMenuOpen ? "top-1/2 rotate-45" : "top-[35%]"}`}
              />
              <span
                className={`absolute left-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-current transition-all ${isMenuOpen ? "top-1/2 -rotate-45" : "top-[65%]"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[var(--navigation-overlay-layer)] bg-[var(--color-navigation-backdrop)] backdrop-blur-[16px]"
            ref={menuRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            dir={locale === "ar" ? "rtl" : "ltr"}
            onAnimationComplete={(definition) => {
              if (definition !== "exit") return;

              const sectionId = pendingSectionRef.current;
              pendingSectionRef.current = null;
              if (sectionId) {
                requestAnimationFrame(() => {
                  document
                    .getElementById(sectionId)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }

              menuButtonRef.current?.focus();
            }}
          >
            <div
              id="mobile-navigation-dialog"
              className="flex min-h-dvh flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_85%_20%,var(--color-glow-emerald),transparent_42%)]"
              role="dialog"
              aria-modal="true"
              aria-label={t("mainNavigation")}
              onClick={(event) => {
                if (event.target === event.currentTarget) closeMenu();
              }}
            >
              <div className="container-shell flex min-h-navbar items-center justify-between border-b border-border-hairline">
                <div
                  className="inline-flex min-h-touch w-fit items-center gap-md rounded-lg px-md py-sm no-underline"
                  role="img"
                  aria-label={t("companyName")}
                >
                  <BrandIdentity
                    name={brand("name")}
                    descriptor={brand("descriptor")}
                    locale={locale}
                  />
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="glass-control relative inline-flex min-h-touch min-w-touch items-center justify-center gap-sm rounded-full px-md font-body text-body-sm text-text-pure transition-colors hover:text-accent-emerald hover:[--glass-spec:0.3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[3px]"
                  aria-label={t("closeMenu")}
                  onClick={closeMenu}
                >
                  <span className="sr-only">{t("close")}</span>
                  <span
                    className="relative inline-block h-4 w-4"
                    aria-hidden="true"
                  >
                    <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
                  </span>
                </button>
              </div>

              <motion.nav
                className="container-shell flex flex-1 flex-col justify-center py-2xl"
                aria-label={t("mainNavigation")}
                variants={menuListVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ul className="glass-panel relative m-0 list-none rounded-3xl px-lg py-0">
                  {navigationSections.map(({ id, translationKey }, index) => (
                    <motion.li
                      key={id}
                      variants={menuItemVariants}
                      className="border-b border-border-hairline last:border-b-0"
                    >
                      <Link
                        href={`#${id}`}
                        className="flex min-h-navbar items-center gap-md text-text-muted no-underline transition-colors hover:text-text-pure focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[3px] aria-[current=location]:text-text-pure"
                        aria-current={
                          activeSection === id ? "location" : undefined
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          pendingSectionRef.current = id;
                          setActiveSection(id);
                          window.history.pushState(null, "", `#${id}`);
                          setIsMenuOpen(false);
                        }}
                      >
                        <span
                          className="font-mono text-label-mono-md text-accent-emerald"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`flex-1 text-headline-sm font-medium ${
                            locale === "ar" ? "font-arabic" : "font-display"
                          }`}
                        >
                          {t(translationKey)}
                        </span>
                        {id === "products" && (
                          <ChevronDown
                            aria-hidden="true"
                            className="h-5 w-5 rotate-180 text-accent-emerald"
                          />
                        )}
                        <span
                          className="text-headline-sm text-accent-emerald rtl:scale-x-[-1]"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </Link>
                      {id === "products" && (
                        <ul
                          aria-label={t("products")}
                          className="m-0 list-none pb-md pl-2xl rtl:pl-0 rtl:pr-2xl"
                        >
                          {productLinks.map(
                            ({ translationKey: productKey, href }) => (
                              <li key={productKey}>
                                <ProductMenuLink
                                  href={href}
                                  className="flex min-h-touch items-center px-md font-body text-body-md text-text-muted no-underline transition-colors hover:text-text-pure focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {t(productKey)}
                                </ProductMenuLink>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </motion.li>
                  ))}
                </ul>
                <div className="pt-xl">
                  <LanguageSwitcher
                    activeSection={activeSection}
                    onNavigate={() => setIsMenuOpen(false)}
                  />
                </div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
