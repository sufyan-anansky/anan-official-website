"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type RouteErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function RouteError({ reset }: RouteErrorProps) {
  const t = useTranslations("errors");

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="error-state"
      role="alert"
    >
      <p className="error-state__message">{t("generic")}</p>
      <Button onClick={reset} variant="secondary">
        {t("retry")}
      </Button>
    </main>
  );
}
