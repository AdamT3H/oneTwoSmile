import initTranslations from "@/app/i18n";
import Detail from "@/features/medicalTourism/components/Detail/Detail";
import TranslationsProvider from "@/components/TranslationsProvider";

interface PageProps {
  params: Promise<{
    locale: string;
    name: string;
  }>;
}

export default async function MedicalTourismDetailPage({ params }: PageProps) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["medicalTourismOptions"]);

  return (
    <div className="w-full">
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["medicalTourismOptions"]}
      >
        <Detail />
      </TranslationsProvider>
    </div>
  );
}
