export const metadata = {
  title: "Наша команда — One Two Smile",
  description:
    "Познайомтеся з нашою командою фахівців, які щодня працюють над тим, щоб ви отримували найкращий сервіс і результати. Довіра починається з людей.",
};

import AboutTeam from "@/app/components/pageOurTeamAboutTeam/aboutTeam";
import AboutTeamGrid from "@/app/components/pageOurTeamAboutTeamGrid/aboutTeamGrid";

export default function OurTeam() {
  return (
    <div className="w-full">
      <AboutTeam />
      <AboutTeamGrid />
    </div>
  );
}
