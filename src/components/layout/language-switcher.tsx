"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type LanguageSwitcherProps = Readonly<{
  activeSection: string;
  onNavigate?: () => void;
}>;

export function LanguageSwitcher({
  activeSection,
  onNavigate,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("navigation");
  const nextLocale = locale === "ar" ? "en" : "ar";
  const flag = locale === "ar" ? "flag-usa.svg" : "flag-saudi.svg";

  return (
    <Link
      href={`/#${activeSection}`}
      locale={nextLocale}
      className="inline-flex min-h-touch w-touch items-center justify-center rounded-md border border-border-hairline bg-carbon-surface text-text-muted no-underline transition-colors hover:border-accent-emerald hover:bg-carbon-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[3px]"
      aria-label={t(
        nextLocale === "ar"
          ? "switchLanguageToArabic"
          : "switchLanguageToEnglish",
      )}
      hrefLang={nextLocale}
      onClick={onNavigate}
    >
      <Image
        src={`/brand/${flag}`}
        width={32}
        height={22}
        alt=""
        aria-hidden="true"
        className="block h-[1.375rem] w-8 rounded-sm object-cover"
      />
    </Link>
  );
}
