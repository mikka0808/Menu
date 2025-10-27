import type { Recipe } from '@/types';

export const seedRecipes: Recipe[] = [
  {
    id: 'seed-overnight-oats',
    title: 'Sunrise Overnight Oats',
    description: 'Creamy oats with chia and citrus zest to prep ahead.',
    servings: 2,
    ingredients: [
      { id: 'oats', name: 'Rolled oats', quantity: 1, unit: 'cup' },
      { id: 'milk', name: 'Oat milk', quantity: 1, unit: 'cup' },
      { id: 'chia', name: 'Chia seeds', quantity: 2, unit: 'tbsp' },
      { id: 'zest', name: 'Orange zest', quantity: 1, unit: 'tsp' }
    ],
    steps: [
      'Stir all ingredients in a jar.',
      'Refrigerate overnight and top with fruit before serving.'
    ],
    tags: ['breakfast', 'make-ahead'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-sheet-pan-frittata',
    title: 'Sheet Pan Frittata Squares',
    description: 'Egg bake loaded with vegetables for easy breakfasts.',
    servings: 6,
    ingredients: [
      { id: 'eggs', name: 'Eggs', quantity: 10, unit: 'piece' },
      { id: 'spinach', name: 'Baby spinach', quantity: 3, unit: 'cup' },
      { id: 'pepper', name: 'Red bell pepper', quantity: 1, unit: 'piece' },
      { id: 'cheese', name: 'Goat cheese', quantity: 0.5, unit: 'cup' }
    ],
    steps: [
      'Whisk eggs with salt and pepper.',
      'Fold in vegetables and cheese, bake until set.'
    ],
    tags: ['breakfast', 'meal-prep'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-herby-quinoa',
    title: 'Herby Citrus Quinoa',
    description: 'Bright quinoa tossed with herbs and toasted almonds.',
    servings: 4,
    ingredients: [
      { id: 'quinoa', name: 'Quinoa', quantity: 1, unit: 'cup' },
      { id: 'broth', name: 'Vegetable broth', quantity: 2, unit: 'cup' },
      { id: 'herbs', name: 'Fresh parsley', quantity: 0.5, unit: 'cup' },
      { id: 'almonds', name: 'Toasted almonds', quantity: 0.33, unit: 'cup' }
    ],
    steps: [
      'Cook quinoa in broth until fluffy.',
      'Fold in herbs, almonds, and citrus juice.'
    ],
    tags: ['side', 'vegetarian'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-miso-salmon',
    title: 'Broiled Miso Salmon',
    description: 'Savory-sweet miso glaze caramelized under the broiler.',
    servings: 4,
    ingredients: [
      { id: 'salmon', name: 'Salmon fillets', quantity: 4, unit: 'piece' },
      { id: 'miso', name: 'White miso paste', quantity: 3, unit: 'tbsp' },
      { id: 'maple', name: 'Maple syrup', quantity: 1, unit: 'tbsp' },
      { id: 'ginger', name: 'Grated ginger', quantity: 1, unit: 'tsp' }
    ],
    steps: [
      'Whisk glaze ingredients until smooth.',
      'Broil salmon brushed with glaze until flaky.'
    ],
    tags: ['dinner', 'seafood'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-crunchy-salad',
    title: 'Crunchy Market Salad',
    description: 'Shredded veggies with citrus vinaigrette and toasted seeds.',
    servings: 4,
    ingredients: [
      { id: 'kale', name: 'Tuscan kale', quantity: 1, unit: 'bunch' },
      { id: 'cabbage', name: 'Red cabbage', quantity: 2, unit: 'cup' },
      { id: 'carrot', name: 'Julienned carrot', quantity: 1, unit: 'cup' },
      { id: 'seeds', name: 'Toasted pumpkin seeds', quantity: 0.5, unit: 'cup' }
    ],
    steps: [
      'Massage kale with a pinch of salt until tender.',
      'Toss with remaining ingredients and vinaigrette.'
    ],
    tags: ['lunch', 'vegetarian'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-one-pot-pasta',
    title: 'One-Pot Tomato Basil Pasta',
    description: 'Weeknight pasta simmered with tomatoes and garlic.',
    servings: 4,
    ingredients: [
      { id: 'pasta', name: 'Spaghetti', quantity: 12, unit: 'oz' },
      { id: 'tomatoes', name: 'Crushed tomatoes', quantity: 2, unit: 'cup' },
      { id: 'garlic', name: 'Garlic cloves', quantity: 4, unit: 'piece' },
      { id: 'basil', name: 'Fresh basil', quantity: 0.5, unit: 'cup' }
    ],
    steps: [
      'Simmer pasta with tomatoes, garlic, and broth until al dente.',
      'Finish with basil and olive oil.'
    ],
    tags: ['dinner', 'one-pot'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-chickpea-wraps',
    title: 'Roasted Chickpea Wraps',
    description: 'Spiced chickpeas tucked into warm flatbread with greens.',
    servings: 4,
    ingredients: [
      { id: 'chickpeas', name: 'Canned chickpeas', quantity: 2, unit: 'cup' },
      { id: 'spice', name: 'Smoked paprika', quantity: 1, unit: 'tsp' },
      { id: 'greens', name: 'Baby greens', quantity: 2, unit: 'cup' },
      { id: 'flatbread', name: 'Whole grain flatbreads', quantity: 4, unit: 'piece' }
    ],
    steps: [
      'Roast chickpeas with oil and spices until crisp.',
      'Fill flatbreads with chickpeas, greens, and sauce.'
    ],
    tags: ['lunch', 'plant-based'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-coconut-curry',
    title: 'Golden Coconut Curry',
    description: 'Silky coconut curry with sweet potato and spinach.',
    servings: 4,
    ingredients: [
      { id: 'sweet-potato', name: 'Diced sweet potato', quantity: 2, unit: 'cup' },
      { id: 'coconut', name: 'Coconut milk', quantity: 1, unit: 'can' },
      { id: 'curry-paste', name: 'Yellow curry paste', quantity: 2, unit: 'tbsp' },
      { id: 'spinach', name: 'Baby spinach', quantity: 3, unit: 'cup' }
    ],
    steps: [
      'Simmer curry paste with coconut milk and sweet potato until tender.',
      'Fold in spinach until wilted and serve with rice.'
    ],
    tags: ['dinner', 'comfort'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-citrus-sipper',
    title: 'Citrus Ginger Sipper',
    description: 'Sparkling mocktail with ginger syrup and grapefruit.',
    servings: 2,
    ingredients: [
      { id: 'grapefruit', name: 'Grapefruit juice', quantity: 1.5, unit: 'cup' },
      { id: 'ginger-syrup', name: 'Ginger syrup', quantity: 2, unit: 'tbsp' },
      { id: 'sparkling', name: 'Sparkling water', quantity: 1, unit: 'cup' }
    ],
    steps: [
      'Combine grapefruit juice and ginger syrup in a pitcher.',
      'Top with sparkling water and serve over ice.'
    ],
    tags: ['beverage', 'refreshing'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-cocoa-bites',
    title: 'Cocoa Almond Energy Bites',
    description: 'No-bake snack bites with dates, almonds, and cocoa.',
    servings: 12,
    ingredients: [
      { id: 'dates', name: 'Pitted dates', quantity: 1.5, unit: 'cup' },
      { id: 'almonds', name: 'Raw almonds', quantity: 1, unit: 'cup' },
      { id: 'cocoa', name: 'Cocoa powder', quantity: 0.25, unit: 'cup' },
      { id: 'salt', name: 'Sea salt', quantity: 1, unit: 'pinch' }
    ],
    steps: [
      'Pulse ingredients in a food processor until clumpy.',
      'Roll into bites and chill until firm.'
    ],
    tags: ['snack', 'no-bake'],
    createdAt: new Date().toISOString()
  }
];
