import { Metadata } from "next";

const title = "One Two Smile — Стоматологія у Львові";
const description =
  "One Two Smile — сучасна стоматологія у Львові. Лікування зубів, ортодонтія, імплантація та турбота про вашу усмішку.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `https://onetwosmile.org/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "One Two Smile",
      type: "website",
      locale: locale === "ua" ? "uk_UA" : locale,
    },
  };
}