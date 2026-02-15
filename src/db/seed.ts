import type { Client } from "@libsql/client";

interface SeedRecipe {
  title: string;
  description: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  image_url: string;
  ingredients: { name: string; amount: number; unit: string }[];
  instructions: string[];
}

const recipes: SeedRecipe[] = [
  {
    title: "Spaghetti Carbonara",
    description:
      "Classic Roman pasta with eggs, cheese, pancetta, and black pepper.",
    cuisine: "Italian",
    difficulty: "medium",
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Spaghetti", amount: 400, unit: "g" },
      { name: "Pancetta", amount: 200, unit: "g" },
      { name: "Eggs", amount: 4, unit: "whole" },
      { name: "Pecorino Romano", amount: 100, unit: "g" },
      { name: "Black pepper", amount: 2, unit: "tsp" },
      { name: "Salt", amount: 1, unit: "tbsp" },
    ],
    instructions: [
      "Bring a large pot of salted water to a boil and cook spaghetti until al dente.",
      "While pasta cooks, cut pancetta into small cubes and cook in a large skillet over medium heat until crispy.",
      "In a bowl, whisk together eggs, grated Pecorino Romano, and generous black pepper.",
      "When pasta is ready, reserve 1 cup of pasta water, then drain.",
      "Working quickly, add hot pasta to the skillet with pancetta (off heat). Toss to combine.",
      "Pour egg mixture over pasta and toss vigorously, adding pasta water as needed to create a creamy sauce.",
      "Serve immediately with extra Pecorino and black pepper on top.",
    ],
  },
  {
    title: "Chicken Teriyaki",
    description:
      "Japanese-style glazed chicken thighs with homemade teriyaki sauce.",
    cuisine: "Japanese",
    difficulty: "easy",
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1606787619248-5d56d7b87f24?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Chicken thighs", amount: 600, unit: "g" },
      { name: "Soy sauce", amount: 4, unit: "tbsp" },
      { name: "Mirin", amount: 3, unit: "tbsp" },
      { name: "Sake", amount: 2, unit: "tbsp" },
      { name: "Sugar", amount: 2, unit: "tbsp" },
      { name: "Ginger", amount: 1, unit: "tbsp" },
      { name: "Steamed rice", amount: 400, unit: "g" },
    ],
    instructions: [
      "Mix soy sauce, mirin, sake, and sugar in a bowl to make the teriyaki sauce.",
      "Grate the ginger finely.",
      "Score the chicken thighs lightly and season with salt.",
      "Heat oil in a skillet over medium-high heat. Cook chicken skin-side down for 5 minutes until golden.",
      "Flip and cook another 3 minutes, then add ginger and teriyaki sauce.",
      "Reduce heat and simmer for 10 minutes, basting the chicken regularly until glazed.",
      "Slice chicken and serve over steamed rice, spooning extra sauce on top.",
    ],
  },
  {
    title: "Tacos al Pastor",
    description:
      "Mexican street tacos with marinated pork, pineapple, and fresh cilantro.",
    cuisine: "Mexican",
    difficulty: "hard",
    prep_time_minutes: 30,
    cook_time_minutes: 45,
    servings: 6,
    image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Pork shoulder", amount: 800, unit: "g" },
      { name: "Dried guajillo chiles", amount: 4, unit: "whole" },
      { name: "Pineapple", amount: 200, unit: "g" },
      { name: "Achiote paste", amount: 2, unit: "tbsp" },
      { name: "White onion", amount: 1, unit: "whole" },
      { name: "Cilantro", amount: 1, unit: "bunch" },
      { name: "Corn tortillas", amount: 12, unit: "whole" },
      { name: "Limes", amount: 3, unit: "whole" },
    ],
    instructions: [
      "Toast guajillo chiles in a dry pan until fragrant. Rehydrate in hot water for 15 minutes.",
      "Blend rehydrated chiles with achiote paste, half the pineapple, and a splash of vinegar to make the marinade.",
      "Slice pork shoulder thinly and coat thoroughly with the marinade. Rest for at least 20 minutes.",
      "Grill or pan-fry the marinated pork over high heat until charred on the edges.",
      "Dice remaining pineapple and grill until caramelized.",
      "Warm corn tortillas on a dry skillet.",
      "Assemble tacos: pork, grilled pineapple, diced onion, cilantro, and a squeeze of lime.",
    ],
  },
  {
    title: "Palak Paneer",
    description:
      "Creamy North Indian spinach curry with paneer cheese cubes.",
    cuisine: "Indian",
    difficulty: "medium",
    prep_time_minutes: 20,
    cook_time_minutes: 30,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Spinach", amount: 500, unit: "g" },
      { name: "Paneer", amount: 250, unit: "g" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Tomatoes", amount: 2, unit: "whole" },
      { name: "Garlic cloves", amount: 4, unit: "whole" },
      { name: "Ginger", amount: 1, unit: "tbsp" },
      { name: "Garam masala", amount: 1, unit: "tsp" },
      { name: "Cumin seeds", amount: 1, unit: "tsp" },
      { name: "Heavy cream", amount: 3, unit: "tbsp" },
    ],
    instructions: [
      "Blanch spinach in boiling water for 2 minutes, then transfer to ice water. Blend into a smooth puree.",
      "Cube paneer and lightly fry until golden on all sides. Set aside.",
      "In the same pan, add cumin seeds and let them splutter. Add diced onion and cook until translucent.",
      "Add minced garlic, grated ginger, and diced tomatoes. Cook for 5 minutes.",
      "Add garam masala and the spinach puree. Simmer for 10 minutes.",
      "Gently fold in the paneer cubes and cream. Cook for 5 more minutes.",
      "Serve hot with naan or basmati rice.",
    ],
  },
  {
    title: "Greek Salad",
    description:
      "Fresh Mediterranean salad with tomatoes, cucumbers, olives, and feta cheese.",
    cuisine: "Greek",
    difficulty: "easy",
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Tomatoes", amount: 4, unit: "whole" },
      { name: "Cucumber", amount: 1, unit: "whole" },
      { name: "Red onion", amount: 0.5, unit: "whole" },
      { name: "Kalamata olives", amount: 100, unit: "g" },
      { name: "Feta cheese", amount: 200, unit: "g" },
      { name: "Extra virgin olive oil", amount: 4, unit: "tbsp" },
      { name: "Dried oregano", amount: 1, unit: "tsp" },
    ],
    instructions: [
      "Cut tomatoes into wedges and cucumber into thick half-moons.",
      "Slice red onion into thin rings.",
      "Combine tomatoes, cucumber, onion, and olives in a large bowl.",
      "Place a block of feta cheese on top (don't crumble it — that's the traditional way).",
      "Drizzle generously with extra virgin olive oil and sprinkle with dried oregano.",
      "Season with salt and pepper. Serve immediately with crusty bread.",
    ],
  },
  {
    title: "Pad Thai",
    description:
      "Classic Thai stir-fried rice noodles with shrimp, tofu, peanuts, and tamarind sauce.",
    cuisine: "Thai",
    difficulty: "medium",
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Rice noodles", amount: 250, unit: "g" },
      { name: "Shrimp", amount: 200, unit: "g" },
      { name: "Firm tofu", amount: 150, unit: "g" },
      { name: "Eggs", amount: 2, unit: "whole" },
      { name: "Tamarind paste", amount: 3, unit: "tbsp" },
      { name: "Fish sauce", amount: 2, unit: "tbsp" },
      { name: "Bean sprouts", amount: 100, unit: "g" },
      { name: "Roasted peanuts", amount: 50, unit: "g" },
      { name: "Limes", amount: 2, unit: "whole" },
      { name: "Green onions", amount: 3, unit: "whole" },
    ],
    instructions: [
      "Soak rice noodles in warm water for 20 minutes until pliable. Drain well.",
      "Mix tamarind paste, fish sauce, and sugar to make the pad thai sauce.",
      "Cube tofu and fry in a hot wok until golden. Remove and set aside.",
      "In the same wok, stir-fry shrimp until pink. Push to the side and scramble eggs.",
      "Add drained noodles and pad thai sauce. Toss everything together over high heat.",
      "Add tofu, bean sprouts, and most of the green onions. Toss for 1 minute.",
      "Serve topped with crushed peanuts, remaining green onions, and lime wedges.",
    ],
  },
];

export async function seedDatabase(db: Client): Promise<void> {
  const result = await db.execute("SELECT COUNT(*) as count FROM recipes");
  const recipeCount = result.rows[0][0] as number;

  if (recipeCount > 0) {
    return;
  }

  // Insert recipes one by one since we need lastInsertRowid for each
  for (const recipe of recipes) {
    const result = await db.execute({
      sql: `INSERT INTO recipes (title, description, cuisine, difficulty, prep_time_minutes, cook_time_minutes, servings, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        recipe.title,
        recipe.description,
        recipe.cuisine,
        recipe.difficulty,
        recipe.prep_time_minutes,
        recipe.cook_time_minutes,
        recipe.servings,
        recipe.image_url,
      ],
    });
    const recipeId = result.lastInsertRowid;

    // Batch insert ingredients
    const ingredientStatements = recipe.ingredients.map((ing, index) => ({
      sql: `INSERT INTO ingredients (recipe_id, name, amount, unit, order_index)
            VALUES (?, ?, ?, ?, ?)`,
      args: [recipeId as number | bigint, ing.name, ing.amount, ing.unit, index] as (string | number | bigint)[],
    }));

    if (ingredientStatements.length > 0) {
      await db.batch(ingredientStatements, "write");
    }

    // Batch insert instructions
    const instructionStatements = recipe.instructions.map((content, index) => ({
      sql: `INSERT INTO instructions (recipe_id, step_number, content)
            VALUES (?, ?, ?)`,
      args: [recipeId as number | bigint, index + 1, content] as (string | number | bigint)[],
    }));

    if (instructionStatements.length > 0) {
      await db.batch(instructionStatements, "write");
    }
  }
}
