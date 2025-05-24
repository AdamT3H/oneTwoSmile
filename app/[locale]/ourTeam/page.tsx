export const metadata = {
  title: "Наша команда — One Two Smile",
  description:
    "Познайомтеся з нашою командою фахівців, які щодня працюють над тим, щоб ви отримували найкращий сервіс і результати. Довіра починається з людей.",
};
import initTranslations from "../../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";
import AboutTeam from "@/components/pageOurTeamAboutTeam/aboutTeam";
import AboutTeamGrid from "@/components/pageOurTeamAboutTeamGrid/aboutTeamGrid";

export default async function OurTeam({ params }: { params: { locale: string } }) {
  const { resources } = await initTranslations(params.locale, [""]);

  return (
    <div className="w-full">
      <AboutTeam locale={params.locale}/>
      <TranslationsProvider
          resources={resources}
          locale={params.locale}
          namespaces={[""]}
        >
        <AboutTeamGrid />
      </TranslationsProvider>
    </div>
  );
}
