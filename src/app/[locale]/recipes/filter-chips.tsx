"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

interface FilterChipsProps {
  cuisines: string[];
}

export function FilterChips({ cuisines }: FilterChipsProps) {
  const t = useTranslations("recipe");
  const tDiff = useTranslations("difficulty");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCuisine = searchParams.get("cuisine");
  const currentDifficulty = searchParams.get("difficulty");

  const difficulties = ["easy", "medium", "hard"];

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const hasFilters = currentCuisine || currentDifficulty;

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cuisine");
    params.delete("difficulty");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Cuisine Filters */}
      {cuisines.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">{t("cuisine")}:</span>
          {cuisines.map((cuisine) => (
            <Badge
              key={cuisine}
              variant={currentCuisine === cuisine ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => toggleFilter("cuisine", cuisine)}
            >
              {cuisine}
            </Badge>
          ))}
        </div>
      )}

      {/* Difficulty Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">
          {t("difficulty")}:
        </span>
        {difficulties.map((difficulty) => (
          <Badge
            key={difficulty}
            variant={currentDifficulty === difficulty ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => toggleFilter("difficulty", difficulty)}
          >
            {tDiff(difficulty)}
          </Badge>
        ))}
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-destructive/10 hover:text-destructive flex items-center gap-1"
          onClick={clearFilters}
        >
          <X size={14} /> {tCommon("clearFilters")}
        </Badge>
      )}
    </div>
  );
}
