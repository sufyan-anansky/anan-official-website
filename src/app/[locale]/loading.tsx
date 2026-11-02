import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("common");

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="loading-state"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">{t("loading")}</span>
    </main>
  );
}
