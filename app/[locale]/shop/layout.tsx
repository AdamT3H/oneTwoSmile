import ShopNav from "@/components/shopNav/ShopNav.tsx";
import { ReactNode } from "react";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function ShopLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["searchText"]);

  const { resources: cartResources } = await initTranslations(locale, ["cart"]);

  const { resources: likeResources } = await initTranslations(locale, ["like"]);

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={["searchText"]}
    >
      <ShopNav
        locale={locale}
        cartResources={cartResources}
        likeResources={likeResources}
      />
      <div className="w-full">{children}</div>
    </TranslationsProvider>
  );
}
