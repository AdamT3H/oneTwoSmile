export const metadata = {
  title: "Всі послуги — One Two Smile",
  description:
    "Дізнайтесь про всі послуги, які ми надаємо: від косметологічних процедур до сучасних методів догляду за шкірою. Обирайте якість та професіоналізм з One Two Smile.",
};

import AllService from "@/components/allServices/AllServices";
import initTranslations from "../../i18n";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export default async function Service({ params }: { params: { locale: string } }) {
  const { resources } = await initTranslations(params.locale, [""]);

  return (
    <div className="w-full">
      <TranslationsProvider
        resources={resources}
        locale={params.locale}
        namespaces={[""]}
      >
        <AllService />
      </TranslationsProvider>
    </div>
  );
}
