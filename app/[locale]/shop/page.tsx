import BannerShopPage from "@/components/bannerShopPage/BannerShopPage";
import ShopContent from "./ShopContent";
import initTranslations from "../../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export default async function Shop({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["searchText", "categorySection"]);

  return (
    <div className="w-full">
      <BannerShopPage params={params} />

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
