"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const toggleLocale = () => {
    const newLocale = currentLocale === "en" ? "de" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Switch language"
    >
      {currentLocale === "en" ? "EN" : "DE"} |{" "}
      {currentLocale === "en" ? "DE" : "EN"}
    </button>
  );
}
