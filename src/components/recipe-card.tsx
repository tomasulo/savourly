"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { RecipeListItem } from "@/lib/types";
import { UtensilsCrossed, Globe, Clock, Lock, Bookmark } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeListItem;
  currentUserId?: string | null;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const tDiff = useTranslations("difficulty");
  const tTime = useTranslations("time");
  const tRecipe = useTranslations("recipe");

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
      <Card className="group overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Image Section - Enhanced with overlay */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {recipe.image_url ? (
            <>
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={false}
              />
              {/* Gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Private lock badge (top-left) */}
              {recipe.is_public === 0 && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 shadow-lg flex items-center gap-1">
                    <Lock size={12} /> {tRecipe("private")}
                  </Badge>
                </div>
              )}

              {/* Cuisine badge floating on image */}
              {recipe.cuisine && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-0 shadow-lg flex items-center gap-1">
                    <Globe size={14} /> {recipe.cuisine}
                  </Badge>
                </div>
              )}

              {/* Bookmark icon (bottom-right) when favorited */}
              {recipe.is_favorited && (
                <div className="absolute bottom-3 right-3">
                  <Bookmark size={20} className="text-primary fill-primary drop-shadow" />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed
                size={48}
                className="text-muted-foreground group-hover:scale-110 transition-transform duration-300"
              />
              {/* Private lock badge for no-image cards */}
              {recipe.is_public === 0 && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 shadow-lg flex items-center gap-1">
                    <Lock size={12} /> {tRecipe("private")}
                  </Badge>
                </div>
              )}
              {/* Bookmark icon for no-image cards */}
              {recipe.is_favorited && (
                <div className="absolute bottom-3 right-3">
                  <Bookmark size={20} className="text-primary fill-primary drop-shadow" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-5 space-y-3">
          <h3 className="text-2xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            {totalTime > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock size={14} /> {totalTime} {tTime("minutes")}
              </span>
            )}

            {totalTime > 0 && (
              <span className="text-muted-foreground">•</span>
            )}

            <Badge
              className={difficultyColors[recipe.difficulty]}
              variant="secondary"
            >
              {tDiff(recipe.difficulty)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
