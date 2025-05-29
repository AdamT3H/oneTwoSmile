import { Suspense } from "react";
import SearchPage from "./SearchContent";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export default async function Search({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, [
    "search",
  ]);

  return (
    <Suspense fallback={<p>Завантаження…</p>}>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["search"]}
      >
        <SearchPage locale={locale}/>
      </TranslationsProvider>
    </Suspense>
  );
}
