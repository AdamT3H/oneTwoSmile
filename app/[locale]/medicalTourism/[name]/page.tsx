import initTranslations from "@/app/i18n";
import MedicalTourismLinkUser from "./pageUser";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function MedicalTourism({
  params,
}: {
  params: { locale: string };
}) {
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
