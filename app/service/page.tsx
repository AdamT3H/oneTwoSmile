export const metadata = {
  title: "Всі послуги — One Two Smile",
  description:
    "Дізнайтесь про всі послуги, які ми надаємо: від косметологічних процедур до сучасних методів догляду за шкірою. Обирайте якість та професіоналізм з One Two Smile.",
};

import AllService from "@/app/components/allServices/AllServices";

export default function Service() {
  return (
    <div className="w-full">
      <AllService/>
    </div>
  );
}
