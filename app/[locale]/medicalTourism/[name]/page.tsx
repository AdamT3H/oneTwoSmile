import initTranslations from "@/app/i18n";
import MedicalTourismLinkUser from "./pageUser";
import TranslationsProvider from "@/components/TranslationsProvider";

interface PageProps {
  params: Promise<{
    locale: string;
    name: string;
  }>;
}

export default async function MedicalTourism({ params }: PageProps) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["medicalTourismOptions"]);

  return (
    <div className="w-full">
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["medicalTourismOptions"]}
      >
        <MedicalTourismLinkUser />
      </TranslationsProvider>
    </div>
  );
}
