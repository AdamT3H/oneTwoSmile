import AllService from "@/features/service/components/AllServices/AllServices";
import initTranslations from "../../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export { metadata } from "./metadata";

export default async function Service({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const { resources } = await initTranslations(locale, ["service"]);

  return (
    <div className="w-full">
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["service"]}
      >
        <AllService />
      </TranslationsProvider>
    </div>
  );
}
