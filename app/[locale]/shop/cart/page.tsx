import initTranslations from "@/app/i18n";
import CartContent from "./cartContent";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function Cart({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["cartPage", "WayForPay"]);

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={["cartPage", "WayForPay"]}
    >
      <CartContent locale={locale}/>
    </TranslationsProvider>
  );
}
