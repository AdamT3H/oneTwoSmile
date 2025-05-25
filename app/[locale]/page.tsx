import { MainPicture } from "@/components";
import Slider from "@/components/sliderOnHeader/Slider";

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

  return (
    <div className="w-full">
      <MainPicture locale={locale} />
      <Slider locale={locale} />
    </div>
  );
}
