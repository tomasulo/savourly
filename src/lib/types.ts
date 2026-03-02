export interface Recipe {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number;
  image_url: string | null;
  is_public: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface RecipeListItem extends Recipe {
  is_own: boolean;
  is_favorited: boolean;
  last_cooked_at: string | null;
}

export interface Favorite {
  id: number;
  user_id: string;
  recipe_id: number;
  created_at: string;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  amount: number | null;
  unit: string | null;
  order_index: number;
}

export interface Instruction {
  id: number;
  recipe_id: number;
  step_number: number;
  content: string;
}

export interface CookingLog {
  id: number;
  recipe_id: number;
  user_id: string;
  cooked_at: string;
  rating: number | null;
  notes: string | null;
}

export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[];
  instructions: Instruction[];
}
