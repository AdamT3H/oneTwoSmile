import MedicalTurismVideo from "@/components/pageMedicalTurismVideo/medicalTurismVideo.tsx";
import MedicalTurismBanner from "@/components/pageMedicalTurismBanner/medicalTurismBanner.tsx";
import MedicalTurismLinks from "@/components/pageMedicalTurismLinks/medicalTurismLinks.tsx";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function medicalTourism({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["medicalTourism"]);

  return (
    <div className="w-full">
      <MedicalTurismVideo />
      <MedicalTurismBanner locale={locale}/>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["medicalTourism"]}
      >
        <MedicalTurismLinks />
      </TranslationsProvider>
    </div>
  );
}
