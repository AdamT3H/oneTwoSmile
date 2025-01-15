import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Header} from "@/app/components/index"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<head>
<script src="https://widget.easyweek.io/widget.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              new EasyWeekWidget({
                url: 'https://widget.easyweek.io/onetwosmile',
                trigger: '.OnlineBookingBtn'
              });
            `,
          }}
        />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />
</head>

      <body>
      <Header/>
        {children}
      </body>
    </html>
  );
}
