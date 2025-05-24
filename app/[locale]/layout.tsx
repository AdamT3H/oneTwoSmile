import EasyWeekIntegration from "@/components/EasyWeekIntegration";
import "./globals.css";
import { Header } from "@/components/index";
import { Footer } from "@/components/index";
import Script from "next/script";
import TranslationsProvider from "@/components/TranslationsProvider.js";
import initTranslations from "../i18n";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { resources } = await initTranslations(params.locale, ["header", "footer"]);

  return (
    <html lang="en">
      <head>
        <Script
          src="https://widget.easyweek.io/widget.js"
          strategy="beforeInteractive"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <TranslationsProvider
          resources={resources}
          locale={params.locale}
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
