import MedicalTurismVideo from "@/components/pageMedicalTurismVideo/medicalTurismVideo.tsx";
import MedicalTurismBanner from "@/components/pageMedicalTurismBanner/medicalTurismBanner.tsx";
import MedicalTurismLinks from "@/components/pageMedicalTurismLinks/medicalTurismLinks.tsx";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function MedicalTourism({ params }: PageProps) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["medicalTourismOptions"]);

  return (
    <div className="w-full">
      <MedicalTurismVideo />
      <MedicalTurismBanner locale={locale}/>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["medicalTourismOptions"]}
      >
        <MedicalTurismLinks />
      </TranslationsProvider>
    </div>
  );
}


