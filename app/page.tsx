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
