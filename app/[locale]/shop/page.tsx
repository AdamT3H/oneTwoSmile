import Banner from "@/features/shop/components/Banner/Banner";
import ShopContent from "@/features/shop/components/ShopContent/ShopContent";
import TranslationsProvider from "@/components/TranslationsProvider.js";
import initTranslations from "../../i18n";

export default async function Shop({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["searchText", "categorySection"]);

  return (
    <div className="w-full">
      <Banner params={params} />

      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["categorySection"]}
      >
        <ShopContent locale={locale} />
      </TranslationsProvider>
    </div>
  );
}
