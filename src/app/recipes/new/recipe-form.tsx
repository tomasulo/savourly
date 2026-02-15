"use client";

import { useActionState, useState } from "react";
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

let nextIngredientId = 1;
let nextInstructionId = 1;

function createIngredientRow(): IngredientRow {
  return { id: nextIngredientId++, name: "", amount: "", unit: "" };
}

function createInstructionRow(): InstructionRow {
  return { id: nextInstructionId++, content: "" };
}

export default function RecipeForm() {
  const [state, formAction, isPending] = useActionState(createRecipe, {});
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
          {state.error}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="What are you cooking?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A brief description of the dish..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
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
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                id="cuisine"
                name="cuisine"
                placeholder="e.g., Italian"
              />
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select name="difficulty" defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prep_time_minutes">Prep Time (min)</Label>
              <Input
                id="prep_time_minutes"
                name="prep_time_minutes"
                type="number"
                min={0}
                placeholder="15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cook_time_minutes">Cook Time (min)</Label>
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
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              name="servings"
              type="number"
              min={1}
              defaultValue={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ingredients</CardTitle>
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
                    Amount
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
                  <Label className="text-xs text-muted-foreground">Unit</Label>
                )}
                <Input name="ingredient_unit" placeholder="cups" />
              </div>
              <div className="space-y-1">
                {index === 0 && (
                  <Label className="text-xs text-muted-foreground">
                    Ingredient *
                  </Label>
                )}
                <Input
                  name="ingredient_name"
                  placeholder="Flour, sugar, etc."
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
                aria-label="Remove ingredient"
              >
                &times;
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
            + Add Ingredient
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {instructions.map((ins, index) => (
            <div key={ins.id} className="flex items-start gap-3">
              <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {index + 1}
              </span>
              <Textarea
                name="instruction"
                placeholder={`Step ${index + 1}...`}
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
                aria-label="Remove step"
              >
                &times;
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
            + Add Step
          </Button>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Saving..." : "Save Recipe"}
        </Button>
      </div>
    </form>
  );
}
