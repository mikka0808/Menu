import { useMemo } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import PlannerGrid from '@/components/PlannerGrid';
import { PlannerDragDrop } from '@/components/DragDrop';
import {
  selectPlannerMatrix,
  useAppStore,
  parsePlannerCellId,
  getPlannerDayOrder,
  getPlannerSlotOrder
} from '@/lib/db';
import type { DayId, MealSlot } from '@/types';

const Planner = () => {
  const navigate = useNavigate();
  const recipes = useAppStore((state) => state.recipes);
  const matrix = useAppStore(selectPlannerMatrix);
  const setMeal = useAppStore((state) => state.actions.setMeal);
  const moveMeal = useAppStore((state) => state.actions.moveMeal);
  const removeMeal = useAppStore((state) => state.actions.removeMeal);
  const clearWeek = useAppStore((state) => state.actions.clearWeek);

  const recipesById = useMemo(() => {
    return recipes.reduce<Record<string, (typeof recipes)[number]>>((acc, recipe) => {
      acc[recipe.id] = recipe;
      return acc;
    }, {});
  }, [recipes]);

  const handlePickRecipe = (day: DayId, slot: MealSlot) => {
    if (!recipes.length) {
      window.alert('Add recipes before scheduling meals.');
      return;
    }

    const promptMessage = [
      'Choose a recipe number to schedule:',
      ...recipes.map((recipe, index) => `${index + 1}. ${recipe.title}`)
    ].join('\n');

    const input = window.prompt(promptMessage);
    if (!input) {
      return;
    }
    const index = Number.parseInt(input, 10) - 1;
    if (Number.isNaN(index) || index < 0 || index >= recipes.length) {
      window.alert('Enter a valid recipe number.');
      return;
    }
    setMeal(day, slot, recipes[index].id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) {
      return;
    }
    const target = parsePlannerCellId(String(event.over.id));
    if (!target) {
      return;
    }
    moveMeal(String(event.active.id), target.day, target.slot);
  };

  const handleRandomize = () => {
    if (!recipes.length) {
      window.alert('Add recipes to randomize your week.');
      return;
    }
    const days = getPlannerDayOrder();
    const slots = getPlannerSlotOrder();
    days.forEach((day) => {
      slots.forEach((slot) => {
        const choice = recipes[Math.floor(Math.random() * recipes.length)];
        setMeal(day, slot, choice.id);
      });
    });
  };

  const handleExport = () => {
    window.alert('Export to PDF will be available soon.');
  };

  const handleShoppingList = () => {
    navigate('/shopping');
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-slate-900">Weekly Planner</h1>
        <p className="text-sm text-slate-600">
          Drag meals into your schedule, randomize a new plan, and export or shop when you are ready.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRandomize}
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
          >
            Randomize
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
          >
            Export Week PDF
          </button>
          <button
            type="button"
            onClick={handleShoppingList}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
          >
            Shopping List
          </button>
          <button
            type="button"
            onClick={clearWeek}
            className="rounded-full border border-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 focus-visible:outline-offset-2"
          >
            Clear Week
          </button>
        </div>
      </header>
      <PlannerDragDrop onDragEnd={handleDragEnd}>
        <PlannerGrid matrix={matrix} recipesById={recipesById} onPickRecipe={handlePickRecipe} onClearMeal={removeMeal} />
      </PlannerDragDrop>
    </section>
  );
};

export default Planner;
