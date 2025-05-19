export const metadata = {
  title: "One Two Smile",
  description: "Дізнайтесь більше про One Two Smile — клініку краси, яка поєднує сучасні методики лікування з натуральною косметикою.",
};

import {MainPicture} from "@/app/components/index"
import Slider from "./components/sliderOnHeader/Slider";

export default function Home() {
  return (
    <div className="w-full">
      <MainPicture/>
      <Slider/>
    </div>
  );
}
