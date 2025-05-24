import { MainPicture } from "@/components";
import Slider from "@/components/sliderOnHeader/Slider";

export const metadata = {
  title: "One Two Smile",
  description:
    "Дізнайтесь більше про One Two Smile — клініку краси, яка поєднує сучасні методики лікування з натуральною косметикою.",
};

export default function Home({ params }: { params: { locale: string } }) {

  return (
    <div className="w-full">
      <MainPicture locale={params.locale} />
      <Slider locale={params.locale}/>
    </div>
  );
}
