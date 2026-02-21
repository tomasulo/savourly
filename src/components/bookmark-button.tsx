"use client";

import { useTransition } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { addFavoriteAction, removeFavoriteAction } from "@/app/[locale]/recipes/[id]/actions";

interface BookmarkButtonProps {
  recipeId: number;
  isFavorited: boolean;
}

export function BookmarkButton({ recipeId, isFavorited }: BookmarkButtonProps) {
  const t = useTranslations("discover");
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (isFavorited) {
        await removeFavoriteAction(recipeId);
      } else {
        await addFavoriteAction(recipeId);
      }
    });
  };

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="sm"
      className="w-full flex items-center gap-2"
      onClick={handleClick}
      disabled={isPending}
    >
      <Bookmark size={16} className={isFavorited ? "fill-current" : ""} />
      {isFavorited ? t("savedToCollection") : t("saveToCollection")}
    </Button>
  );
}
