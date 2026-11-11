import { Metadata } from "next";

const title = "Магазин — One Two Smile";
const description =
  "Косметичні товари та засоби для догляду від One Two Smile з доставкою по Україні.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `https://onetwosmile.org/${locale}/shop`;

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