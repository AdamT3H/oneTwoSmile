import Video from "@/features/medicalTourism/components/Video/Video";
import Banner from "@/features/medicalTourism/components/Banner/Banner";
import Links from "@/features/medicalTourism/components/Links/Links";
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
      <Video />
      <Banner locale={locale}/>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["medicalTourismOptions"]}
      >
        <Links />
      </TranslationsProvider>
    </div>
  );
}


