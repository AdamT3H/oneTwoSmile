import { MainPicture } from "@/components";
import Philosophy from "@/components/philosophyOnMain/Philosophy";
import PeopleSmilesSlider from "@/components/peopleSmilesSliderOnMain/peopleSmilesSlider";
import initTranslations from "../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export const metadata = {
  title: "One Two Smile",
  description:
    "Дізнайтесь більше про One Two Smile — клініку краси, яка поєднує сучасні методики лікування з натуральною косметикою.",
};

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
