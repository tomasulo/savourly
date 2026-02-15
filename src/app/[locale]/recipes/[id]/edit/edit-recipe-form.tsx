"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateRecipe, deleteRecipe } from "./actions";
import type { RecipeWithDetails } from "@/lib/types";
import { X } from "lucide-react";

interface IngredientRow {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

interface InstructionRow {
  id: number;
  content: string;
}

interface EditRecipeFormProps {
  recipe: RecipeWithDetails;
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const t = useTranslations("recipe");
  const tDiff = useTranslations("difficulty");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const updateRecipeWithId = updateRecipe.bind(null, recipe.id);
  const [state, formAction, isPending] = useActionState(updateRecipeWithId, {});
  const [isDeleting, setIsDeleting] = useState(false);

  const nextIngredientId = useRef(
    Math.max(...recipe.ingredients.map((i) => i.id), 0) + 1
  );
  const nextInstructionId = useRef(
    Math.max(...recipe.instructions.map((i) => i.id), 0) + 1
  );

  const createIngredientRow = (): IngredientRow => {
    return { id: nextIngredientId.current++, name: "", amount: "", unit: "" };
  };

  const createInstructionRow = (): InstructionRow => {
    return { id: nextInstructionId.current++, content: "" };
  };

  // Initialize ingredients from recipe data
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    recipe.ingredients.length > 0
      ? recipe.ingredients.map((ing) => ({
          id: ing.id,
          name: ing.name,
          amount: ing.amount !== null ? String(ing.amount) : "",
          unit: ing.unit || "",
        }))
      : [createIngredientRow()]
  );

  // Initialize instructions from recipe data
  const [instructions, setInstructions] = useState<InstructionRow[]>(
    recipe.instructions.length > 0
      ? recipe.instructions.map((ins) => ({
          id: ins.id,
          content: ins.content,
        }))
      : [createInstructionRow()]
  );

  function addIngredient() {
    setIngredients((prev) => [...prev, createIngredientRow()]);
  }

  function removeIngredient(id: number) {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  }

  function addInstruction() {
    setInstructions((prev) => [...prev, createInstructionRow()]);
  }

  function removeInstruction(id: number) {
    if (instructions.length <= 1) return;
    setInstructions((prev) => prev.filter((ins) => ins.id !== id));
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      t("confirmDelete", { title: recipe.title })
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteRecipe(recipe.id);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <form action={formAction} className="space-y-8">
        {state.error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("recipeDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("title")} *</Label>
              <Input
                id="title"
                name="title"
                placeholder={t("title")}
                defaultValue={recipe.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("description")}
                defaultValue={recipe.description || ""}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">{t("imageUrl")}</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                placeholder="https://example.com/photo.jpg"
                defaultValue={recipe.image_url || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("recipeDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="cuisine">{t("cuisine")}</Label>
                <Input
                  id="cuisine"
                  name="cuisine"
                  placeholder={t("cuisine")}
                  defaultValue={recipe.cuisine || ""}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("difficulty")}</Label>
                <Select name="difficulty" defaultValue={recipe.difficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">{tDiff("easy")}</SelectItem>
                    <SelectItem value="medium">{tDiff("medium")}</SelectItem>
                    <SelectItem value="hard">{tDiff("hard")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prep_time_minutes">{t("prepTime")}</Label>
                <Input
                  id="prep_time_minutes"
                  name="prep_time_minutes"
                  type="number"
                  min={0}
                  placeholder="15"
                  defaultValue={
                    recipe.prep_time_minutes !== null
                      ? recipe.prep_time_minutes
                      : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cook_time_minutes">{t("cookTime")}</Label>
                <Input
                  id="cook_time_minutes"
                  name="cook_time_minutes"
                  type="number"
                  min={0}
                  placeholder="30"
                  defaultValue={
                    recipe.cook_time_minutes !== null
                      ? recipe.cook_time_minutes
                      : ""
                  }
                />
              </div>
            </div>

            <div className="mt-4 w-32 space-y-2">
              <Label htmlFor="servings">{t("servings")}</Label>
              <Input
                id="servings"
                name="servings"
                type="number"
                min={1}
                defaultValue={recipe.servings}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("ingredients")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ingredients.map((ing, index) => (
              <div
                key={ing.id}
                className="grid grid-cols-[80px_80px_1fr_40px] items-end gap-2 sm:grid-cols-[100px_100px_1fr_40px]"
              >
                <div className="space-y-1">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">
                      {t("amount")}
                    </Label>
                  )}
                  <Input
                    name="ingredient_amount"
                    type="number"
                    step="any"
                    min={0}
                    placeholder="2"
                    defaultValue={ing.amount}
                  />
                </div>
                <div className="space-y-1">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">
                      {t("unit")}
                    </Label>
                  )}
                  <Input
                    name="ingredient_unit"
                    placeholder={t("unit")}
                    defaultValue={ing.unit}
                  />
                </div>
                <div className="space-y-1">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">
                      {t("ingredient")} *
                    </Label>
                  )}
                  <Input
                    name="ingredient_name"
                    placeholder={t("ingredient")}
                    defaultValue={ing.name}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ing.id)}
                  disabled={ingredients.length <= 1}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={tCommon("delete")}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="mt-2"
            >
              + {t("addIngredient")}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("instructions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {instructions.map((ins, index) => (
              <div key={ins.id} className="flex items-start gap-3">
                <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </span>
                <Textarea
                  name="instruction"
                  placeholder={t("stepNumber", { number: index + 1 })}
                  rows={2}
                  defaultValue={ins.content}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInstruction(ins.id)}
                  disabled={instructions.length <= 1}
                  className="mt-1 text-muted-foreground hover:text-destructive"
                  aria-label={tCommon("delete")}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInstruction}
              className="mt-2"
            >
              + {t("addInstruction")}
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap justify-between gap-3">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || isDeleting}
          >
            {isDeleting ? tCommon("loading") : tCommon("delete")}
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending || isDeleting}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isPending || isDeleting}>
              {isPending ? tCommon("loading") : tCommon("save")}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
