import EasyWeekIntegration from "@/components/EasyWeekIntegration";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Script from "next/script";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "../i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;

  const { resources } = await initTranslations(locale, ["header", "footer"]);

  return (
    <html lang={locale}>
      <head>
        <Script
          src="https://widget.easyweek.io/widget.js"
          strategy="beforeInteractive"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>

      <body>
        <TranslationsProvider
          resources={resources}
          locale={locale}
          namespaces={["header", "footer"]}
        >
          <Header />
          <EasyWeekIntegration />
          {children}
          <Footer />
        </TranslationsProvider>
      </body>
    </html>
  );
}
