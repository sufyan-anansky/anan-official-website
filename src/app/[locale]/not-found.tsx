import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <main id="main-content" tabIndex={-1} className="error-state">
      <h1 className="text-headline-sm font-display">{t("notFound")}</h1>
    </main>
  );
}
