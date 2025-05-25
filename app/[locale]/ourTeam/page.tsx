export const metadata = {
  title: "Наша команда — One Two Smile",
  description:
    "Познайомтеся з нашою командою фахівців, які щодня працюють над тим, щоб ви отримували найкращий сервіс і результати. Довіра починається з людей.",
};
import initTranslations from "../../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";
import AboutTeam from "@/components/pageOurTeamAboutTeam/aboutTeam";
import AboutTeamGrid from "@/components/pageOurTeamAboutTeamGrid/aboutTeamGrid";

export default async function OurTeam({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, [""]);

  return (
    <div className="w-full">
      <AboutTeam locale={locale} />
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
