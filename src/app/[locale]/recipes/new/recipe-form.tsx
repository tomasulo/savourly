"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
import { createRecipe } from "./actions";
import { TAGS } from "@/lib/tags";
import { Badge } from "@/components/ui/badge";
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

export default function RecipeForm() {
  const t = useTranslations("recipe");
  const tDiff = useTranslations("difficulty");
  const tCommon = useTranslations("common");
  const [state, formAction, isPending] = useActionState(createRecipe, {});

  const nextIngredientId = useRef(1);
  const nextInstructionId = useRef(1);

  const createIngredientRow = (): IngredientRow => {
    return { id: nextIngredientId.current++, name: "", amount: "", unit: "" };
  };

  const createInstructionRow = (): InstructionRow => {
    return { id: nextInstructionId.current++, content: "" };
  };

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    createIngredientRow(),
  ]);
  const [instructions, setInstructions] = useState<InstructionRow[]>([
    createInstructionRow(),
  ]);

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

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {t(state.error as Parameters<typeof t>[0])}
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t("description")}
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
          <div className="mb-4 space-y-2">
            <Label>{t("tags")}</Label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedTags.map((tag) => (
              <input key={tag} type="hidden" name="tags" value={tag} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t("difficulty")}</Label>
              <Select name="difficulty" defaultValue="medium">
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
              defaultValue={4}
            />
          </div>

          <div className="mt-4 w-48 space-y-2">
            <Label>{t("visibility")}</Label>
            <Select name="is_public" defaultValue="0">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t("private")}</SelectItem>
                <SelectItem value="1">{t("public")}</SelectItem>
              </SelectContent>
            </Select>
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
                />
              </div>
              <div className="space-y-1">
                {index === 0 && (
                  <Label className="text-xs text-muted-foreground">{t("unit")}</Label>
                )}
                <Input name="ingredient_unit" placeholder={t("unit")} />
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

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? tCommon("loading") : tCommon("save")}
        </Button>
      </div>
    </form>
  );
}
