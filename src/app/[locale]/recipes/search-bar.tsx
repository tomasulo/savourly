"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export function SearchBar() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const isFirstRender = useRef(true);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }, 400); // Debounce search to reduce server round-trips

    return () => clearTimeout(timeoutId);
  }, [query, pathname, router]);

  return (
    <div className="relative mb-4">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 h-12 text-lg"
      />
    </div>
  );
}
