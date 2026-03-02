"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RecipeWithDetails, CookingLog } from "@/lib/types";
import { Clock, Flame, Timer, Users, BarChart3, Tag, Star, UtensilsCrossed, Bookmark } from "lucide-react";
import { addFavoriteAction, removeFavoriteAction } from "./actions";

interface RecipeDetailProps {
  recipe: RecipeWithDetails;
  cookingLogs: CookingLog[];
  currentUserId: string | null;
  isFavorited: boolean;
}

export function RecipeDetail({ recipe, cookingLogs, currentUserId, isFavorited }: RecipeDetailProps) {
  const t = useTranslations("recipe");
  const tDiff = useTranslations("difficulty");
  const tTime = useTranslations("time");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [servings, setServings] = useState(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [favorited, setFavorited] = useState(isFavorited);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  const isOwner = currentUserId !== null && currentUserId === recipe.user_id;
  const canBookmark =
    currentUserId !== null &&
    !isOwner &&
    recipe.is_public === 1;

  const servingMultiplier = recipe.servings > 0 ? servings / recipe.servings : 1;

  const toggleIngredient = (id: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
  };

  const adjustServings = (delta: number) => {
    const newServings = Math.max(1, servings + delta);
    setServings(newServings);
  };

  const formatAmount = (amount: number | null): string => {
    if (amount === null) return "";
    const adjusted = amount * servingMultiplier;
    return adjusted % 1 === 0
      ? adjusted.toString()
      : adjusted.toFixed(2).replace(/\.?0+$/, "");
  };

  const handleBookmarkToggle = async () => {
    if (bookmarkPending) return;
    setBookmarkPending(true);
    const prev = favorited;
    setFavorited(!prev);
    try {
      if (prev) {
        await removeFavoriteAction(recipe.id);
      } else {
        await addFavoriteAction(recipe.id);
      }
    } catch {
      setFavorited(prev);
    } finally {
      setBookmarkPending(false);
    }
  };

  const totalTime =
    (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Section */}
      <div className="relative h-[300px] w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <UtensilsCrossed size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{t("notFound")}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-white mb-2">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-lg text-white/90">{recipe.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Action Buttons */}
        <div className="mb-6 flex justify-end gap-2">
          {canBookmark && (
            <Button
              variant="outline"
              onClick={handleBookmarkToggle}
              disabled={bookmarkPending}
              className="flex items-center gap-2"
            >
              <Bookmark
                size={16}
                className={favorited ? "fill-primary text-primary" : ""}
              />
              {favorited ? tCommon("unsave") : tCommon("save")}
            </Button>
          )}
          {isOwner && (
            <Button asChild>
              <Link href={`/recipes/${recipe.id}/edit`}>
                {tCommon("edit")}
              </Link>
            </Button>
          )}
        </div>

        {/* Quick Facts Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-6">
              {recipe.prep_time_minutes !== null && (
                <div className="flex items-center gap-2">
                  <Clock size={24} className="text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("prepTime")}
                    </div>
                    <div className="font-semibold">
                      {recipe.prep_time_minutes} {tTime("minutes")}
                    </div>
                  </div>
                </div>
              )}
              {recipe.cook_time_minutes !== null && (
                <div className="flex items-center gap-2">
                  <Flame size={24} className="text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("cookTime")}
                    </div>
                    <div className="font-semibold">
                      {recipe.cook_time_minutes} {tTime("minutes")}
                    </div>
                  </div>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center gap-2">
                  <Timer size={24} className="text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("totalTime")}
                    </div>
                    <div className="font-semibold">{totalTime} {tTime("minutes")}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={24} className="text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("servings")}</div>
                  <div className="font-semibold">{recipe.servings}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 size={24} className="text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("difficulty")}
                  </div>
                  <Badge
                    className={difficultyColors[recipe.difficulty]}
                    variant="secondary"
                  >
                    {tDiff(recipe.difficulty)}
                  </Badge>
                </div>
              </div>
              {recipe.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={24} className="text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">{t("tags")}</div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{t("ingredients")}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustServings(-1)}
                  disabled={servings <= 1}
                >
                  −
                </Button>
                <span className="min-w-[60px] text-center font-semibold">
                  {servings} {servings !== 1 ? t("servings") : t("serving")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustServings(1)}
                >
                  +
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checkedIngredients.has(ingredient.id)}
                    onChange={() => toggleIngredient(ingredient.id)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <span
                    className={`flex-1 text-lg ${
                      checkedIngredients.has(ingredient.id)
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {ingredient.amount !== null && (
                      <span className="font-semibold">
                        {formatAmount(ingredient.amount)}
                        {ingredient.unit ? ` ${ingredient.unit}` : ""}{" "}
                      </span>
                    )}
                    {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t("instructions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-6">
              {recipe.instructions.map((instruction) => (
                <li
                  key={instruction.id}
                  className="flex gap-4 items-start group"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {instruction.step_number}
                  </div>
                  <p className="flex-1 text-lg pt-1.5 leading-relaxed">
                    {instruction.content}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Cooking Logs Section */}
        {cookingLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("cookingLog")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cookingLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border-l-2 border-primary pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.cooked_at).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      {log.rating !== null && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < (log.rating ?? 0)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }
                              fill={i < (log.rating ?? 0) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {log.notes && (
                      <p className="text-foreground">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
