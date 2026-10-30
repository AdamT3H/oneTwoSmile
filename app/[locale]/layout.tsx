import EasyWeekIntegration from "@/components/EasyWeekIntegration";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Script from "next/script";
import TranslationsProvider from "@/components/TranslationsProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import { Montserrat } from "next/font/google";
import initTranslations from "../i18n";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

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
    <html lang={locale} className={montserrat.variable}>
      {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}

      <body>
        <Script
          src="https://widget.easyweek.io/widget.js"
          strategy="beforeInteractive"
        />
  
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
