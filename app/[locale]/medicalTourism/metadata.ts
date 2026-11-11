import { Metadata } from "next";

const title = "Медичний туризм — One Two Smile";
const description =
  "Стоматологічне лікування у Львові для пацієнтів з України та інших країн.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `https://onetwosmile.org/${locale}/medicalTourism`;

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