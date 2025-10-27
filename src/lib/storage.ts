import type { AppDB, PlannedMeal } from '@/types';

const STORAGE_KEY = 'menumagique-db';
const CURRENT_VERSION = 1;

const createEmptyState = (): AppDB => ({
  version: CURRENT_VERSION,
  recipes: [],
  planner: {},
  shoppingList: [],
  preferences: {
    onboardingCompleted: false,
    measurementSystem: 'metric',
    defaultServings: 4
  }
});

const normalizePlanner = (planner: AppDB['planner'] | PlannedMeal[]): AppDB['planner'] => {
  if (Array.isArray(planner)) {
    return planner.reduce<Record<string, PlannedMeal>>((acc, meal) => {
      acc[meal.id] = meal;
      return acc;
    }, {});
  }
  return planner ?? {};
};

const migrate = (data: AppDB): AppDB => {
  const planner = normalizePlanner(data.planner as AppDB['planner'] | PlannedMeal[]);

  switch (data.version) {
    case 1:
      return { ...data, planner };
    default:
      return {
        ...createEmptyState(),
        ...data,
        planner,
        version: CURRENT_VERSION
      };
  }
};

export const loadState = (): AppDB => {
  if (typeof window === 'undefined') {
    return createEmptyState();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createEmptyState();
    }
    const parsed = JSON.parse(stored) as AppDB;
    return migrate(parsed);
  } catch (error) {
    console.warn('Failed to read storage, returning defaults', error);
    return createEmptyState();
  }
};

export const saveState = (data: AppDB) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload = JSON.stringify({ ...data, version: CURRENT_VERSION });
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch (error) {
    console.warn('Failed to persist storage', error);
  }
};

export const exportState = (data: AppDB): string => {
  return JSON.stringify({ ...data, version: CURRENT_VERSION }, null, 2);
};

export const importState = (raw: string): AppDB => {
  try {
    const parsed = JSON.parse(raw) as AppDB;
    return migrate(parsed);
  } catch (error) {
    console.warn('Failed to import data, returning defaults', error);
    return createEmptyState();
  }
};

export const resetState = (): AppDB => {
  const empty = createEmptyState();
  saveState(empty);
  return empty;
};
