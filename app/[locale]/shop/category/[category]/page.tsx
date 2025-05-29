import initTranslations from "@/app/i18n";
import CategoryPageContent from "./categoryContent";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, [
    "category",
  ]);

  return (
    <div style={{ width: "100%" }}>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["category"]}
      >
        <CategoryPageContent params={params} locale={locale} />
      </TranslationsProvider>
    </div>
  );
}
