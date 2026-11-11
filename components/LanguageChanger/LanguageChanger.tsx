"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import i18nConfig from "@/i18nConfig";

export default function LanguageChanger() {
  const router = useRouter();
  const currentPathname = usePathname();
  const pathSegments = currentPathname.split("/");
  const pathLocale = pathSegments[1];
  const currentLocale = i18nConfig.locales.includes(pathLocale)
  ? pathLocale
  : i18nConfig.defaultLocale;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    document.cookie = `NEXT_LOCALE=${newLocale};max-age=${60 * 60 * 24 * 30};path=/`;

    if (i18nConfig.locales.includes(pathLocale)) {
      pathSegments[1] = newLocale;
      router.push(pathSegments.join("/"));
    } else {
      router.push(`/${newLocale}${currentPathname}`);
    }

    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <select
        onChange={handleChange}
        value={currentLocale}
        className="px-1.5 py-0.5 text-[15px] font-medium text-gray-400 border border-gray-300 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
      >
        <option value="en">EN</option>
        <option value="ua">UA</option>
        <option value="pl">PL</option>
      </select>
    </div>
  );
}
