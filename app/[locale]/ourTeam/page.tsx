import initTranslations from "../../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";
import AboutTeam from "@/features/ourTeam/components/AboutTeam/AboutTeam";
import AboutTeamForm from "@/features/ourTeam/components/AboutTeamForm/AboutTeamForm";
import AboutTeamGrid from "@/features/ourTeam/components/AboutTeamGrid/AboutTeamGrid";

export { metadata } from "./metadata";

export default async function OurTeam({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["aboutTeamGrid"]);

  return (
    <div className="w-full">
      <AboutTeam locale={locale}/>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={["aboutTeamGrid"]}
      >
        <AboutTeamGrid />
      </TranslationsProvider>
      <AboutTeamForm/>
    </div>
  );
}
