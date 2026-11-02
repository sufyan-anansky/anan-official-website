"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createContactSchema,
  type ContactFormValues,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";

type SubmissionStatus = "idle" | "success" | "error" | "unavailable";

export function ContactForm() {
  const locale = useLocale();
  const t = useTranslations("contact.form");
  const isRtl = locale === "ar";
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const schema = createContactSchema({
    nameRequired: t("validation.nameRequired"),
    nameTooLong: t("validation.nameTooLong"),
    emailInvalid: t("validation.emailInvalid"),
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
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 503) {
        setStatus("unavailable");
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

  const fieldClassName =
    "min-h-touch w-full rounded-xl border border-outline-variant/70 bg-carbon-elevated px-md py-sm text-body-md text-text-pure outline-none transition placeholder:text-text-dim focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-lg"
    >
      <div className="grid gap-lg sm:grid-cols-2">
        <div className="flex flex-col gap-xs">
          <label
            htmlFor="contact-name"
            className={`text-body-sm font-medium text-text-pure ${
              isRtl ? "font-arabic" : "font-body"
            }`}
          >
            {t("name")}
          </label>
          <input
            {...register("name")}
            id="contact-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClassName}
            placeholder={t("namePlaceholder")}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              className={`text-body-sm text-error ${
                isRtl ? "font-arabic" : "font-body"
              }`}
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <label
            htmlFor="contact-email"
            className={`text-body-sm font-medium text-text-pure ${
              isRtl ? "font-arabic" : "font-body"
            }`}
          >
            {t("email")}
          </label>
          <input
            {...register("email")}
            id="contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={fieldClassName}
            placeholder={t("emailPlaceholder")}
          />
          {errors.email && (
            <p
              id="contact-email-error"
              className={`text-body-sm text-error ${
                isRtl ? "font-arabic" : "font-body"
              }`}
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <label
          htmlFor="contact-message"
          className={`text-body-sm font-medium text-text-pure ${
            isRtl ? "font-arabic" : "font-body"
          }`}
        >
          {t("message")}
        </label>
        <textarea
          {...register("message")}
          id="contact-message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className={`${fieldClassName} min-h-36 resize-y`}
          placeholder={t("messagePlaceholder")}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            className={`text-body-sm text-error ${
              isRtl ? "font-arabic" : "font-body"
            }`}
          >
            {errors.message.message}
          </p>
        )}
      </div>

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
        </p>
      </div>
    </form>
  );
}
