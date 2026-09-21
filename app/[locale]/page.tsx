import MainPicture from "@/features/home/components/MainPicture/MainPicture";
import Philosophy from "@/features/home/components/Philosophy/Philosophy";
import PeopleSmilesSlider from "@/features/home/components/PeopleSmilesSlider/PeopleSmilesSlider";
import initTranslations from "../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export { metadata } from "./metadata";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["slider"]);

  return (
    <div className="w-full">
      <MainPicture locale={locale} />
      <Philosophy locale={locale} />
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["slider"]}
      >
        <PeopleSmilesSlider />
      </TranslationsProvider>
    </div>
  );
}
