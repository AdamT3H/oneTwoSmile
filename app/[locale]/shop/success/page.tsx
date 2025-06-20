import initTranslations from "@/app/i18n.js";
import ClientSuccess from "./ClientSuccess.tsx";
import React from "react";
import TranslationsProvider from "@/components/TranslationsProvider.js";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["success"]);
  return (
    <div className="w-full">
      <React.Suspense fallback={<p>Завантаження…</p>}>
        <TranslationsProvider
          resources={resources}
          locale={locale}
          namespaces={["success"]}
        >
          <ClientSuccess />
        </TranslationsProvider>
      </React.Suspense>
    </div>
  );
}
