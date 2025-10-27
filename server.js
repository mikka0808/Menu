import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'data', 'store.json');
const publicDir = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const meals = ['midi', 'soir'];

async function readStore() {
  const data = await readFile(dataFile, 'utf-8');
  return JSON.parse(data);
}

async function writeStore(store) {
  await writeFile(dataFile, JSON.stringify(store, null, 2), 'utf-8');
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(text);
}

async function serveStatic(req, res, pathname) {
  let filePath = path.join(publicDir, pathname);
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (error) {
    filePath = path.join(publicDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  if (req.method === 'HEAD') {
    res.end();
  } else {
    createReadStream(filePath).pipe(res);
  }
}

async function handleApi(req, res, pathname, method) {
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const bodyString = Buffer.concat(chunks).toString() || '{}';
  let body;
  try {
    body = JSON.parse(bodyString);
  } catch (error) {
    return sendJson(res, 400, { error: 'JSON invalide' });
  }

  try {
    if (pathname === '/api/recipes' && method === 'GET') {
      const store = await readStore();
      return sendJson(res, 200, store.recipes);
    }

    if (pathname === '/api/recipes' && method === 'POST') {
      const store = await readStore();
      const { title, description, ingredients, instructions, calories, tags = [], source = 'maison' } = body;
      if (!title || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return sendJson(res, 400, { error: 'Titre et ingrédients requis.' });
      }
      const newRecipe = {
        id: `r${Date.now()}`,
        title,
        description: description || '',
        ingredients,
        instructions: instructions || '',
        calories: typeof calories === 'number' ? calories : null,
        tags,
        source
      };
      store.recipes.push(newRecipe);
      await writeStore(store);
      return sendJson(res, 201, newRecipe);
    }

    if (pathname.startsWith('/api/recipes/') && method === 'PUT') {
      const id = pathname.split('/').pop();
      const store = await readStore();
      const index = store.recipes.findIndex((recipe) => recipe.id === id);
      if (index === -1) {
        return sendJson(res, 404, { error: 'Recette introuvable.' });
      }
      store.recipes[index] = { ...store.recipes[index], ...body, id };
      await writeStore(store);
      return sendJson(res, 200, store.recipes[index]);
    }

    if (pathname.startsWith('/api/recipes/') && method === 'DELETE') {
      const id = pathname.split('/').pop();
      const store = await readStore();
      const index = store.recipes.findIndex((recipe) => recipe.id === id);
      if (index === -1) {
        return sendJson(res, 404, { error: 'Recette introuvable.' });
      }
      const [removed] = store.recipes.splice(index, 1);
      for (const day of days) {
        for (const meal of meals) {
          if (store.menu?.[day]?.[meal] === id) {
            store.menu[day][meal] = null;
          }
        }
      }
      await writeStore(store);
      return sendJson(res, 200, removed);
    }

    if (pathname === '/api/menu' && method === 'GET') {
      const store = await readStore();
      return sendJson(res, 200, store.menu);
    }

    if (pathname === '/api/menu' && method === 'PUT') {
      const { day, meal, recipeId } = body;
      if (!days.includes(day) || !meals.includes(meal)) {
        return sendJson(res, 400, { error: 'Jour ou repas invalide.' });
      }
      const store = await readStore();
      if (recipeId && !store.recipes.find((recipe) => recipe.id === recipeId)) {
        return sendJson(res, 400, { error: 'Recette inexistante.' });
      }
      store.menu[day][meal] = recipeId || null;
      await writeStore(store);
      return sendJson(res, 200, store.menu[day]);
    }

    if (pathname === '/api/shopping-list' && method === 'GET') {
      const store = await readStore();
      const counter = new Map();
      for (const day of days) {
        for (const meal of meals) {
          const recipeId = store.menu?.[day]?.[meal];
          if (!recipeId) continue;
          const recipe = store.recipes.find((item) => item.id === recipeId);
          if (!recipe) continue;
          for (const ingredient of recipe.ingredients) {
            const key = ingredient.trim();
            counter.set(key, (counter.get(key) || 0) + 1);
          }
        }
      }
      const items = Array.from(counter.entries()).map(([ingredient, occurrences]) => ({ ingredient, occurrences }));
      return sendJson(res, 200, { items });
    }

    if (pathname.startsWith('/api/recipes/discover') && method === 'GET') {
      const urlObject = new URL(req.url, `http://${req.headers.host}`);
      const query = urlObject.searchParams.get('query') || '';
      if (!query) {
        return sendJson(res, 400, { error: 'Paramètre query requis.' });
      }
      try {
        const externalResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        if (!externalResponse.ok) {
          throw new Error(`Erreur API externe: ${externalResponse.status}`);
        }
        const payload = await externalResponse.json();
        const mealsData = payload.meals || [];
        const simplified = mealsData.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          description: meal.strCategory || '',
          ingredients: collectIngredients(meal),
          instructions: meal.strInstructions || '',
          image: meal.strMealThumb || '',
          source: meal.strSource || 'TheMealDB'
        }));
        return sendJson(res, 200, simplified);
      } catch (error) {
        return sendJson(res, 502, { error: 'Impossible de contacter la base de recettes externe.', details: error.message });
      }
    }

    return sendJson(res, 404, { error: 'Route inconnue.' });
  } catch (error) {
    console.error('Server error:', error);
    return sendJson(res, 500, { error: 'Erreur interne du serveur.' });
  }
}

function collectIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const entry = measure && measure.trim() ? `${measure.trim()} ${ingredient.trim()}` : ingredient.trim();
      list.push(entry.trim());
    }
  }
  return list;
}

const server = createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (pathname.startsWith('/api/')) {
    await handleApi(req, res, pathname, method);
    return;
  }

  if (method === 'GET' || method === 'HEAD') {
    await serveStatic(req, res, pathname === '/' ? '/index.html' : pathname);
  } else {
    sendText(res, 405, 'Méthode non autorisée');
  }
});

server.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
