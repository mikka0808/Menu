import { create } from 'zustand';
import type {
  AppDB,
  PlannedMeal,
  Recipe,
  ShoppingItem,
  AppPreferences,
  DayId,
  MealSlot
} from '@/types';
import { loadState, saveState, resetState } from './storage';

const plannerDayOrder: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const plannerSlotOrder: MealSlot[] = ['lunch', 'dinner'];

const createMealId = () =>
  globalThis.crypto?.randomUUID?.() ?? `meal-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const findMealIdByCell = (planner: AppDB['planner'], dayId: DayId, slot: MealSlot) => {
  return Object.values(planner).find((meal) => meal.dayId === dayId && meal.slot === slot)?.id;
};

export interface PlannerMatrixSlot {
  slot: MealSlot;
  meal: PlannedMeal | null;
  cellId: string;
}

export interface PlannerMatrixDay {
  day: DayId;
  slots: PlannerMatrixSlot[];
}

export type PlannerMatrix = PlannerMatrixDay[];

const plannerCellId = (day: DayId, slot: MealSlot) => `${day}:${slot}`;

export const parsePlannerCellId = (id: string): { day: DayId; slot: MealSlot } | null => {
  const [day, slot] = id.split(':') as [DayId | undefined, MealSlot | undefined];
  if (!day || !slot) {
    return null;
  }
  if (!plannerDayOrder.includes(day) || !plannerSlotOrder.includes(slot)) {
    return null;
  }
  return { day, slot };
};

interface AppActions {
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  setMeal: (day: DayId, slot: MealSlot, recipeId: string) => void;
  moveMeal: (id: string, newDay: DayId, newSlot: MealSlot) => void;
  removeMeal: (id: string) => void;
  clearWeek: () => void;
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
    setMeal: (day, slot, recipeId) =>
      set((state) => {
        const planner = { ...state.planner };
        const existingId = findMealIdByCell(planner, day, slot);
        if (existingId) {
          delete planner[existingId];
        }
        const id = createMealId();
        planner[id] = {
          id,
          dayId: day,
          slot,
          recipeId
        };
        return { planner };
      }),
    moveMeal: (id, newDay, newSlot) =>
      set((state) => {
        const planner = { ...state.planner };
        const meal = planner[id];
        if (!meal) {
          return { planner };
        }
        const conflictingId = findMealIdByCell(planner, newDay, newSlot);
        if (conflictingId && conflictingId !== id) {
          delete planner[conflictingId];
        }
        planner[id] = {
          ...meal,
          dayId: newDay,
          slot: newSlot
        };
        return { planner };
      }),
    removeMeal: (id) =>
      set((state) => {
        if (!(id in state.planner)) {
          return {};
        }
        const { [id]: _removed, ...rest } = state.planner;
        return { planner: rest };
      }),
    clearWeek: () =>
      set(() => ({
        planner: {}
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

export const selectPlannerMatrix = (state: AppStore): PlannerMatrix => {
  const lookup = Object.values(state.planner).reduce<Record<string, PlannedMeal>>((acc, meal) => {
    acc[plannerCellId(meal.dayId, meal.slot)] = meal;
    return acc;
  }, {});

  return plannerDayOrder.map((day) => ({
    day,
    slots: plannerSlotOrder.map((slot) => ({
      slot,
      meal: lookup[plannerCellId(day, slot)] ?? null,
      cellId: plannerCellId(day, slot)
    }))
  }));
};

export const getPlannerDayOrder = () => [...plannerDayOrder];
export const getPlannerSlotOrder = () => [...plannerSlotOrder];
