"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

interface FilterChipsProps {
  tags: string[];
}

export function FilterChips({ tags }: FilterChipsProps) {
  const t = useTranslations("recipe");
  const tDiff = useTranslations("difficulty");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTag = searchParams.get("tag");
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

  const hasFilters = currentTag || currentDifficulty;

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    params.delete("difficulty");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">{t("tags")}:</span>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={currentTag === tag ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => toggleFilter("tag", tag)}
            >
              {tag}
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
