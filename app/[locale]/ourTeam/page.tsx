import initTranslations from "../../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";
import AboutTeam from "@/features/ourTeam/components/AboutTeam/AboutTeam";
import AboutTeamGrid from "@/features/ourTeam/components/AboutTeamGrid/AboutTeamGrid";

export { metadata } from "./metadata";

export default async function OurTeam({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, [""]);

  return (
    <div className="w-full">
      <AboutTeam locale={locale}/>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={[""]}
      >
        <AboutTeamGrid />
      </TranslationsProvider>
    </div>
  );
}
