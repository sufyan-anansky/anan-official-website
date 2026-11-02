import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const contactInfo = [
  { key: "phone", icon: Phone },
  { key: "mail", icon: Mail },
  { key: "location", icon: MapPin },
] as const;

export function Contact() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const isRtl = locale === "ar";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative max-w-7xl mx-auto isolate scroll-mt-navbar overflow-hidden py-4xl sm:py-5xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,var(--color-glow-emerald),transparent_70%)]"
      />

      <div className="container-shell">
        <div className="grid overflow-hidden rounded-[2rem] border border-outline-variant/50 bg-carbon-surface/90 shadow-2xl shadow-black/30 lg:grid-cols-12 lg:overflow-visible lg:border-0 lg:bg-transparent lg:shadow-none">
          <aside className="relative isolate flex flex-col overflow-hidden bg-[linear-gradient(145deg,var(--color-primary-container),var(--color-carbon-elevated)_80%)] p-lg text-start shadow-[0_24px_70px_rgb(0_0_0_/_0.28)] sm:p-xl lg:z-10 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:my-xl lg:rounded-[2rem] lg:border lg:border-primary/25 lg:p-3xl lg:shadow-2xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_0%,color-mix(in_srgb,var(--color-primary)_22%,transparent),transparent_65%)]"
            />

            <h2
              id="contact-title"
              className={`text-headline-lg-mobile font-medium leading-tight text-text-pure sm:text-headline-lg ${
                isRtl ? "font-arabic" : "font-display"
              }`}
            >
              {t("title")}
            </h2>
            <p
              className={`mt-md max-w-md text-text-muted ${
                isRtl
                  ? "font-arabic text-body-md"
                  : "font-body text-body-md sm:text-body-lg"
              }`}
            >
              {t("description")}
            </p>

            <ul className="mt-xl flex flex-col gap-md">
              {contactInfo.map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-center gap-md">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span
                    dir={"ltr"}
                    className={`pt-xs text-body-md text-text-pure ${
                      isRtl ? "font-arabic" : "font-body"
                    }`}
                  >
                    {t(`contactInfo.${key}`)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-xl flex items-center justify-between gap-md border-t border-outline-variant/60 pt-md">
              <p
                className={`text-body-sm text-text-muted ${
                  isRtl ? "font-arabic" : "font-body"
                }`}
              >
                {t("sideNote")}
              </p>
              <ArrowUpRight
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-primary ${
                  isRtl ? "-scale-x-100" : ""
                }`}
              />
            </div>
          </aside>

          <div className="flex flex-col justify-start p-lg sm:p-xl lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:rounded-[2rem] lg:border lg:border-outline-variant/50 lg:bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-surface-container)_88%,transparent),color-mix(in_srgb,var(--color-carbon-surface)_98%,transparent))] lg:py-3xl lg:pe-3xl lg:ps-[8rem] lg:shadow-2xl">
            <div className="mb-xl text-start">
              <SectionEyebrow className="mb-sm">
                {t("form.eyebrow")}
              </SectionEyebrow>
              <h3
                className={`mt-sm text-headline-sm font-medium text-text-pure sm:text-headline-md ${
                  isRtl ? "font-arabic" : "font-display"
                }`}
              >
                {t("form.title")}
              </h3>
              <p
                className={`mt-xs text-text-muted ${
                  isRtl ? "font-arabic text-body-md" : "font-body text-body-md"
                }`}
              >
                {t("form.description")}
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
