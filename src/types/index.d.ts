export type Unit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'tsp'
  | 'tbsp'
  | 'cup'
  | 'piece'
  | 'slice'
  | 'pinch'
  | 'bunch'
  | 'oz'
  | 'can';

export interface IngredientItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  sourceUrl?: string;
  servings: number;
  ingredients: IngredientItem[];
  steps: string[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type MealSlot = 'lunch' | 'dinner';

export interface PlannedMeal {
  id: string;
  dayId: DayId;
  slot: MealSlot;
  recipeId: string;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  ingredientId?: string;
  name: string;
  quantity: number;
  unit: Unit;
  checked: boolean;
  category?: string;
}

export interface AppPreferences {
  onboardingCompleted: boolean;
  measurementSystem: 'metric' | 'imperial';
  defaultServings: number;
}

export interface AppDB {
  version: number;
  recipes: Recipe[];
  planner: Record<string, PlannedMeal>;
  shoppingList: ShoppingItem[];
  preferences: AppPreferences;
}
