import initTranslations from "@/app/i18n";
import ProductPageContent from "./productPageContent";
import TranslationsProvider from "@/components/TranslationsProvider";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, id } = await params;

  const { resources } = await initTranslations(locale, ["product"]);

  return (
    <div style={{ width: "100%" }}>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["product"]}
      >
        <ProductPageContent params={Promise.resolve({ id })} />
      </TranslationsProvider>
    </div>
  );
}


