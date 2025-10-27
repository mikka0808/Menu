const days = [
  { key: 'lundi', label: 'Lundi' },
  { key: 'mardi', label: 'Mardi' },
  { key: 'mercredi', label: 'Mercredi' },
  { key: 'jeudi', label: 'Jeudi' },
  { key: 'vendredi', label: 'Vendredi' },
  { key: 'samedi', label: 'Samedi' },
  { key: 'dimanche', label: 'Dimanche' }
];

const meals = [
  { key: 'midi', label: 'Midi' },
  { key: 'soir', label: 'Soir' }
];

const state = {
  recipes: [],
  menu: {},
  filters: {
    search: '',
    ingredients: [],
    maxCalories: null
  },
  shoppingList: []
};

const recipeListElement = document.getElementById('recipe-list');
const menuGridElement = document.getElementById('menu-grid');
const shoppingListElement = document.getElementById('shopping-list');
const searchInput = document.getElementById('search-recipe');
const ingredientFilterInput = document.getElementById('ingredient-filter');
const calorieFilterInput = document.getElementById('calorie-filter');
const addRecipeForm = document.getElementById('add-recipe-form');
const discoverForm = document.getElementById('discover-form');
const discoverResults = document.getElementById('discover-results');
const discoverQuery = document.getElementById('discover-query');
const openAddRecipeButton = document.getElementById('open-add-recipe');
const generateShoppingListButton = document.getElementById('generate-shopping-list');

let recipeListSortable = null;
let slotSortables = [];

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = error.error || response.statusText;
    throw new Error(message);
  }
  return response.json();
}

function normalizeString(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function applyFilters(recipes) {
  const { search, ingredients, maxCalories } = state.filters;
  return recipes.filter((recipe) => {
    let matches = true;
    if (search) {
      const term = normalizeString(search);
      const haystack = `${recipe.title} ${recipe.description || ''} ${(recipe.tags || []).join(' ')}`;
      matches = matches && normalizeString(haystack).includes(term);
    }
    if (matches && ingredients.length) {
      const available = ingredients.map((item) => normalizeString(item));
      const recipeIngredients = (recipe.ingredients || []).map((item) => normalizeString(item));
      matches = available.every((item) => recipeIngredients.some((ingredient) => ingredient.includes(item)));
    }
    if (matches && typeof maxCalories === 'number') {
      if (recipe.calories !== null && recipe.calories !== undefined) {
        matches = recipe.calories <= maxCalories;
      }
    }
    return matches;
  });
}

function renderRecipes() {
  const filtered = applyFilters(state.recipes);
  recipeListElement.innerHTML = '';
  for (const recipe of filtered) {
    const li = document.createElement('li');
    li.className = 'recipe-card';
    li.dataset.recipeId = recipe.id;
    li.innerHTML = `
      <h3>${recipe.title}</h3>
      ${recipe.description ? `<p>${recipe.description}</p>` : ''}
      <div class="recipe-meta">
        ${recipe.calories ? `<span>${recipe.calories} kcal</span>` : ''}
        ${Array.isArray(recipe.tags) ? recipe.tags.map((tag) => `<span class="tag">${tag}</span>`).join('') : ''}
      </div>
      <details>
        <summary>Détails & ingrédients</summary>
        <strong>Ingrédients</strong>
        <ul>
          ${(recipe.ingredients || []).map((ingredient) => `<li>${ingredient}</li>`).join('')}
        </ul>
        ${recipe.instructions ? `<p><strong>Préparation&nbsp;:</strong> ${recipe.instructions}</p>` : ''}
      </details>
    `;
    recipeListElement.appendChild(li);
  }
  setupRecipeDrag();
}

function renderMenu() {
  menuGridElement.innerHTML = '';
  for (const day of days) {
    const column = document.createElement('div');
    column.className = 'day-column';
    column.innerHTML = `
      <div class="day-header">
        <h3>${day.label}</h3>
      </div>
    `;

    for (const meal of meals) {
      const slot = document.createElement('div');
      slot.className = 'meal-slot';
      slot.dataset.day = day.key;
      slot.dataset.meal = meal.key;

      const assignedId = state.menu?.[day.key]?.[meal.key];
      const assignedRecipe = state.recipes.find((recipe) => recipe.id === assignedId);
      const slotBody = document.createElement('div');
      slotBody.className = 'slot-body';

      if (assignedRecipe) {
        slotBody.innerHTML = `
          <div class="assigned-recipe">
            <strong>${assignedRecipe.title}</strong>
            <button class="remove-recipe" aria-label="Retirer" data-day="${day.key}" data-meal="${meal.key}">×</button>
          </div>
        `;
      } else {
        slotBody.innerHTML = '<p>Glissez une recette ici</p>';
      }

      const header = document.createElement('header');
      header.textContent = meal.label;
      slot.appendChild(header);
      slot.appendChild(slotBody);
      column.appendChild(slot);
    }

    menuGridElement.appendChild(column);
  }
  attachSlotEvents();
}

function renderShoppingList() {
  shoppingListElement.innerHTML = '';
  if (!state.shoppingList.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Aucun ingrédient pour le moment.';
    shoppingListElement.appendChild(empty);
    return;
  }

  for (const item of state.shoppingList) {
    const li = document.createElement('li');
    li.className = 'shopping-item';
    li.innerHTML = `<span>${item.ingredient}</span><span>${item.occurrences}×</span>`;
    shoppingListElement.appendChild(li);
  }
}

function setupRecipeDrag() {
  if (recipeListSortable) {
    recipeListSortable.destroy();
  }
  recipeListSortable = new Sortable(recipeListElement, {
    animation: 150,
    group: {
      name: 'recipes',
      pull: 'clone',
      put: false
    },
    sort: false,
    draggable: '.recipe-card',
    onClone(evt) {
      evt.clone.style.width = `${evt.item.offsetWidth}px`;
    }
  });
}

function attachSlotEvents() {
  slotSortables.forEach((sortable) => sortable.destroy());
  slotSortables = [];

  const removeButtons = document.querySelectorAll('.remove-recipe');
  removeButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const day = event.currentTarget.dataset.day;
      const meal = event.currentTarget.dataset.meal;
      await updateMenu(day, meal, null);
    });
  });

  document.querySelectorAll('.meal-slot').forEach((slot) => {
    slot.addEventListener('dragover', (event) => {
      event.preventDefault();
      slot.classList.add('drop-target');
    });
    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drop-target');
    });
    slot.addEventListener('drop', (event) => {
      event.preventDefault();
      slot.classList.remove('drop-target');
      const recipeId = event.dataTransfer?.getData('text/plain');
      if (recipeId) {
        updateMenu(slot.dataset.day, slot.dataset.meal, recipeId);
      }
    });
  });

  document.querySelectorAll('.recipe-card').forEach((card) => {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', (event) => {
      event.dataTransfer?.setData('text/plain', card.dataset.recipeId);
      event.dataTransfer?.setDragImage(card, 20, 20);
    });
  });

  document.querySelectorAll('.slot-body').forEach((body) => {
    const sortable = new Sortable(body, {
      group: {
        name: 'recipes',
        pull: false,
        put: true
      },
      sort: false,
      onAdd(evt) {
        const recipeId = evt.clone?.dataset.recipeId || evt.item.dataset.recipeId;
        evt.item.remove();
        updateMenu(body.parentElement.dataset.day, body.parentElement.dataset.meal, recipeId);
      }
    });
    slotSortables.push(sortable);
  });
}

async function updateMenu(day, meal, recipeId) {
  try {
    await fetchJson('/api/menu', {
      method: 'PUT',
      body: JSON.stringify({ day, meal, recipeId })
    });
    await loadMenu();
  } catch (error) {
    alert(`Impossible de mettre à jour le menu : ${error.message}`);
  }
}

async function loadRecipes() {
  try {
    const recipes = await fetchJson('/api/recipes');
    state.recipes = recipes;
    renderRecipes();
    renderMenu();
  } catch (error) {
    console.error(error);
  }
}

async function loadMenu() {
  try {
    const menu = await fetchJson('/api/menu');
    state.menu = menu;
    renderMenu();
  } catch (error) {
    console.error(error);
  }
}

async function loadShoppingList() {
  try {
    const data = await fetchJson('/api/shopping-list');
    state.shoppingList = data.items;
    renderShoppingList();
  } catch (error) {
    alert(`Impossible de générer la liste de courses : ${error.message}`);
  }
}

searchInput.addEventListener('input', (event) => {
  state.filters.search = event.target.value.trim();
  renderRecipes();
});

ingredientFilterInput.addEventListener('input', (event) => {
  const value = event.target.value.trim();
  state.filters.ingredients = value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
  renderRecipes();
});

calorieFilterInput.addEventListener('input', (event) => {
  const value = event.target.value;
  state.filters.maxCalories = value ? Number(value) : null;
  renderRecipes();
});

addRecipeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(addRecipeForm);
  const calorieValue = formData.get('recipe-calories');
  let calories = calorieValue ? Number(calorieValue) : null;
  if (Number.isNaN(calories)) {
    calories = null;
  }

  const payload = {
    title: (formData.get('recipe-title') || '').toString().trim(),
    description: (formData.get('recipe-description') || '').toString().trim(),
    ingredients: (formData.get('recipe-ingredients') || '')
      .toString()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    instructions: (formData.get('recipe-instructions') || '').toString().trim(),
    calories,
    tags: (formData.get('recipe-tags') || '')
      .toString()
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  };

  if (!payload.title || !payload.ingredients.length) {
    alert('Merci de renseigner au minimum un titre et des ingrédients.');
    return;
  }

  try {
    await fetchJson('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    addRecipeForm.reset();
    await loadRecipes();
  } catch (error) {
    alert(`Impossible d'enregistrer la recette : ${error.message}`);
  }
});

openAddRecipeButton.addEventListener('click', () => {
  document.getElementById('add-recipe-panel').scrollIntoView({ behavior: 'smooth' });
});

generateShoppingListButton.addEventListener('click', () => {
  loadShoppingList();
});

discoverForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  discoverResults.innerHTML = '<p>Recherche en cours…</p>';
  try {
    const data = await fetchJson(`/api/recipes/discover?query=${encodeURIComponent(discoverQuery.value.trim())}`);
    renderDiscover(data);
  } catch (error) {
    discoverResults.innerHTML = `<p class="error">${error.message}</p>`;
  }
});

function renderDiscover(results) {
  if (!results.length) {
    discoverResults.innerHTML = '<p>Aucun résultat trouvé. Essayez un autre mot-clé.</p>';
    return;
  }

  discoverResults.innerHTML = '';
  for (const item of results) {
    const card = document.createElement('article');
    card.className = 'discover-card';
    const payload = encodeURIComponent(JSON.stringify(item));
    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : ''}
      <h3>${item.title}</h3>
      ${item.description ? `<p>${item.description}</p>` : ''}
      <button class="action-button" data-recipe="${payload}">Importer</button>
    `;
    discoverResults.appendChild(card);
  }

  discoverResults.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const data = JSON.parse(decodeURIComponent(button.dataset.recipe));
        await fetchJson('/api/recipes', {
          method: 'POST',
          body: JSON.stringify({
            title: data.title,
            description: data.description || '',
            ingredients: data.ingredients || [],
            instructions: data.instructions || '',
            calories: null,
            tags: ['web'],
            source: data.source || 'internet'
          })
        });
        await loadRecipes();
        document.getElementById('recipes-panel').scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        alert(`Impossible d'importer cette recette : ${error.message}`);
      }
    });
  });
}

function enableTouchDragFallback() {
  let ghostCard = null;
  let originCard = null;

  function cleanup() {
    if (ghostCard?.parentElement) {
      ghostCard.parentElement.removeChild(ghostCard);
    }
    ghostCard = null;
    originCard = null;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('touchcancel', onTouchEnd);
    document.querySelectorAll('.meal-slot').forEach((slot) => slot.classList.remove('drop-target'));
  }

  function onTouchMove(event) {
    if (!ghostCard) return;
    const touch = event.touches[0];
    event.preventDefault();
    ghostCard.style.left = `${touch.clientX - ghostCard.offsetWidth / 2}px`;
    ghostCard.style.top = `${touch.clientY - ghostCard.offsetHeight / 2}px`;

    let currentTarget = null;
    document.querySelectorAll('.meal-slot').forEach((slot) => {
      const rect = slot.getBoundingClientRect();
      const within =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;
      slot.classList.toggle('drop-target', within);
      if (within) {
        currentTarget = slot;
      }
    });

    ghostCard.dataset.targetDay = currentTarget?.dataset.day || '';
    ghostCard.dataset.targetMeal = currentTarget?.dataset.meal || '';
  }

  function onTouchEnd(event) {
    if (!ghostCard || !originCard) {
      cleanup();
      return;
    }
    event.preventDefault();
    const { targetDay, targetMeal } = ghostCard.dataset;
    if (targetDay && targetMeal) {
      updateMenu(targetDay, targetMeal, originCard.dataset.recipeId);
    }
    cleanup();
  }

  recipeListElement.addEventListener(
    'touchstart',
    (event) => {
      const card = event.target.closest('.recipe-card');
      if (!card) return;
      event.preventDefault();
      originCard = card;
      ghostCard = card.cloneNode(true);
      ghostCard.classList.add('recipe-card');
      ghostCard.dataset.recipeId = card.dataset.recipeId;
      ghostCard.style.position = 'fixed';
      ghostCard.style.pointerEvents = 'none';
      ghostCard.style.zIndex = '9999';
      ghostCard.style.width = `${Math.min(card.offsetWidth, 260)}px`;
      document.body.appendChild(ghostCard);
      onTouchMove(event);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd, { passive: false });
      document.addEventListener('touchcancel', onTouchEnd, { passive: false });
    },
    { passive: false }
  );
}

async function init() {
  await loadRecipes();
  await loadMenu();
  await loadShoppingList();
  enableTouchDragFallback();
}

init();
