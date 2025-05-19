import EasyWeekIntegration from "@/app/components/EasyWeekIntegration";
import "./globals.css";
import { Header } from "@/app/components/index";
import { Footer } from "@/app/components/index";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Header />
        <EasyWeekIntegration />
        {children}
        <Footer />
      </body>
    </html>
  );
}
