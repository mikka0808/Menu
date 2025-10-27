import type { PlannerMatrix } from '@/lib/db';
import { DraggableMeal, DroppableCell } from './DragDrop';
import type { DayId, MealSlot, Recipe } from '@/types';

const dayLabels: Record<DayId, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday'
};

const slotLabels: Record<MealSlot, string> = {
  lunch: 'Lunch',
  dinner: 'Dinner'
};

export interface PlannerGridProps {
  matrix: PlannerMatrix;
  recipesById: Record<string, Recipe>;
  onPickRecipe: (day: DayId, slot: MealSlot) => void;
  onClearMeal: (id: string) => void;
}

const PlannerGrid = ({ matrix, recipesById, onPickRecipe, onClearMeal }: PlannerGridProps) => {
  return (
    <div role="grid" className="grid gap-5 sm:grid-cols-2">
      {matrix.map(({ day, slots }) => (
        <section key={day} aria-label={`${dayLabels[day]} planner`} className="flex flex-col gap-3">
          <header>
            <h2 className="text-lg font-semibold text-slate-900">{dayLabels[day]}</h2>
            <p className="text-xs uppercase tracking-wide text-slate-500">Plan two meals</p>
          </header>
          <div className="grid gap-3">
            {slots.map(({ slot, meal, cellId }) => {
              const label = `${dayLabels[day]} ${slotLabels[slot]}`;
              const recipeTitle = meal ? recipesById[meal.recipeId]?.title ?? 'Recipe not found' : null;
              return (
                <DroppableCell key={cellId} id={cellId} label={`${label} drop zone`} className="min-h-[140px]">
                  {meal ? (
                    <DraggableMeal id={meal.id} label={`Drag ${recipeTitle} from ${label}`}>
                      <div className="flex h-full flex-col justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                            {slotLabels[slot]}
                          </span>
                          <span className="text-base font-semibold text-slate-900">{recipeTitle}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>{dayLabels[day]}</span>
                          <button
                            type="button"
                            onClick={() => onClearMeal(meal.id)}
                            className="rounded-full border border-indigo-200 px-3 py-1 font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </DraggableMeal>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onPickRecipe(day, slot)}
                      className="flex h-full w-full flex-col items-start justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-left text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
                    >
                      <span>{label}</span>
                      <span className="text-xs font-normal text-slate-500">Pick a recipe</span>
                    </button>
                  )}
                </DroppableCell>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default PlannerGrid;
