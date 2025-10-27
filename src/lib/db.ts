import { create } from 'zustand';
import type { AppDB, PlannedMeal, Recipe, ShoppingItem, AppPreferences } from '@/types';
import { loadState, saveState, resetState } from './storage';

interface AppActions {
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  scheduleMeal: (meal: PlannedMeal) => void;
  updatePlannedMeal: (meal: PlannedMeal) => void;
  unscheduleMeal: (id: string) => void;
  upsertShoppingItem: (item: ShoppingItem) => void;
  toggleShoppingItem: (id: string, checked: boolean) => void;
  removeShoppingItem: (id: string) => void;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  reset: () => void;
}

export type AppStore = AppDB & {
  actions: AppActions;
};

const stripActions = ({ actions, ...state }: AppStore): AppDB => ({ ...state });

export const useAppStore = create<AppStore>((set) => ({
  ...loadState(),
  actions: {
    addRecipe: (recipe) =>
      set((state) => ({
        recipes: [...state.recipes, recipe]
      })),
    updateRecipe: (recipe) =>
      set((state) => ({
        recipes: state.recipes.map((item) => (item.id === recipe.id ? recipe : item))
      })),
    removeRecipe: (id) =>
      set((state) => ({
        recipes: state.recipes.filter((recipe) => recipe.id !== id)
      })),
    scheduleMeal: (meal) =>
      set((state) => ({
        planner: [...state.planner, meal]
      })),
    updatePlannedMeal: (meal) =>
      set((state) => ({
        planner: state.planner.map((item) => (item.id === meal.id ? meal : item))
      })),
    unscheduleMeal: (id) =>
      set((state) => ({
        planner: state.planner.filter((meal) => meal.id !== id)
      })),
    upsertShoppingItem: (item) =>
      set((state) => {
        const exists = state.shoppingList.some((entry) => entry.id === item.id);
        return {
          shoppingList: exists
            ? state.shoppingList.map((entry) => (entry.id === item.id ? item : entry))
            : [...state.shoppingList, item]
        };
      }),
    toggleShoppingItem: (id, checked) =>
      set((state) => ({
        shoppingList: state.shoppingList.map((item) =>
          item.id === id
            ? {
                ...item,
                checked
              }
            : item
        )
      })),
    removeShoppingItem: (id) =>
      set((state) => ({
        shoppingList: state.shoppingList.filter((item) => item.id !== id)
      })),
    updatePreferences: (prefs) =>
      set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),
    reset: () =>
      set(() => ({
        ...resetState()
      }))
  }
}));

useAppStore.subscribe((state) => {
  const data = stripActions(state);
  saveState(data);
});
