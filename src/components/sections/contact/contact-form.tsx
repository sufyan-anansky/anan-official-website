"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, ChevronDown, LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import {
  contactInterests,
  createContactSchema,
  type ContactFormValues,
  type ContactInterest,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";

type SubmissionStatus =
  | "idle"
  | "success"
  | "error"
  | "unavailable"
  | "rateLimited";

const fieldClassName =
  "min-h-touch w-full rounded-xl border border-outline-variant/70 bg-carbon-elevated px-md py-sm text-body-md text-text-pure outline-none transition placeholder:text-text-dim focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

function Field({
  id,
  label,
  error,
  isRtl,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  isRtl: boolean;
  children: ReactNode;
}) {
  const textClass = isRtl ? "font-arabic" : "font-body";

  return (
    <div className="flex flex-col gap-xs">
      <label
        htmlFor={id}
        className={`text-body-sm font-medium text-text-pure ${textClass}`}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={`text-body-sm text-error ${textClass}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const locale = useLocale();
  const t = useTranslations("contact.form");
  const isRtl = locale === "ar";
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const schema = createContactSchema({
    nameRequired: t("validation.nameRequired"),
    nameTooLong: t("validation.nameTooLong"),
    emailInvalid: t("validation.emailInvalid"),
    phoneInvalid: t("validation.phoneInvalid"),
    interestRequired: t("validation.interestRequired"),
    messageTooShort: t("validation.messageTooShort"),
    messageTooLong: t("validation.messageTooLong"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "" as ContactInterest,
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale: locale === "ar" ? "ar" : "en",
        }),
      });

      if (response.status === 503) {
        setStatus("unavailable");
        return;
      }

      if (response.status === 429) {
        setStatus("rateLimited");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        return;
      }

      reset();
      setStatus("success");
    } catch (error) {
      console.error("Contact form submission failed.", error);
      setStatus("error");
    }
  };

  const describedBy = (id: string, hasError: boolean) =>
    hasError ? `${id}-error` : undefined;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-lg"
    >
      <div className="grid gap-lg sm:grid-cols-2">
        <Field
          id="contact-name"
          label={t("name")}
          error={errors.name?.message}
          isRtl={isRtl}
        >
          <input
            {...register("name")}
            id="contact-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("contact-name", Boolean(errors.name))}
            className={fieldClassName}
            placeholder={t("namePlaceholder")}
          />
        </Field>

        <Field
          id="contact-email"
          label={t("email")}
          error={errors.email?.message}
          isRtl={isRtl}
        >
          <input
            {...register("email")}
            id="contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy(
              "contact-email",
              Boolean(errors.email),
            )}
            className={fieldClassName}
            placeholder={t("emailPlaceholder")}
          />
        </Field>

        <Field
          id="contact-phone"
          label={t("phone")}
          error={errors.phone?.message}
          isRtl={isRtl}
        >
          <input
            {...register("phone")}
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy(
              "contact-phone",
              Boolean(errors.phone),
            )}
            className={fieldClassName}
            placeholder={t("phonePlaceholder")}
          />
        </Field>

        <Field
          id="contact-interest"
          label={t("interest")}
          error={errors.interest?.message}
          isRtl={isRtl}
        >
          <div className="relative">
            <select
              {...register("interest")}
              id="contact-interest"
              aria-invalid={Boolean(errors.interest)}
              aria-describedby={describedBy(
                "contact-interest",
                Boolean(errors.interest),
              )}
              className={`${fieldClassName} cursor-pointer appearance-none pe-xl [color-scheme:dark]`}
            >
              <option value="">
                {t("interestPlaceholder")}
              </option>
              {contactInterests.map((interest) => (
                <option key={interest} value={interest}>
                  {t(`interests.${interest}`)}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute end-md top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            />
          </div>
        </Field>
      </div>

      <Field
        id="contact-message"
        label={t("message")}
        error={errors.message?.message}
        isRtl={isRtl}
      >
        <textarea
          {...register("message")}
          id="contact-message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy(
            "contact-message",
            Boolean(errors.message),
          )}
          className={`${fieldClassName} min-h-36 resize-y`}
          placeholder={t("messagePlaceholder")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-md">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`min-w-36 gap-sm rounded-full px-xl ${
            isRtl ? "font-arabic" : "font-body"
          }`}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" />
              {t("sending")}
            </>
          ) : (
            <>
              {t("submit")}
              <ArrowUpRight
                aria-hidden="true"
                className={`h-4 w-4 ${isRtl ? "-scale-x-100" : ""}`}
              />
            </>
          )}
        </Button>
        <p
          role="status"
          aria-live="polite"
          className={`text-body-sm text-text-muted ${
            isRtl ? "font-arabic" : "font-body"
          }`}
        >
          {status === "success" && t("success")}
          {status === "error" && t("error")}
          {status === "unavailable" && t("unavailable")}
          {status === "rateLimited" && t("rateLimited")}
        </p>
      </div>
    </form>
  );
}
