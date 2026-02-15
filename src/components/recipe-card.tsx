"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const tDiff = useTranslations("difficulty");
  const tTime = useTranslations("time");

  const totalTime =
    (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Image Section - 60% of card height */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-6xl">🍳</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-2">
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {totalTime > 0 && (
              <Badge variant="secondary" className="gap-1">
                <span>⏱️</span>
                {totalTime} {tTime("minutes")}
              </Badge>
            )}

            <Badge
              className={difficultyColors[recipe.difficulty]}
              variant="secondary"
            >
              {tDiff(recipe.difficulty)}
            </Badge>

            {recipe.cuisine && (
              <Badge variant="outline" className="gap-1">
                <span>🌍</span>
                {recipe.cuisine}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
