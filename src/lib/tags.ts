export const TAGS = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
  "appetizer",
  "side-dish",
  "drink",
  "soup",
  "salad",
  "baking",
] as const;

export type Tag = (typeof TAGS)[number];
