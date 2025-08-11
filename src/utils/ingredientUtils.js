// Ingredient validation and sanitization utilities

export const sanitizeIngredient = (ingredient) => {
    if (!ingredient) return '';
    
    return ingredient
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  export const removeDuplicates = (ingredients) => {
    const seen = new Set();
    return ingredients.filter(ingredient => {
      const normalized = ingredient.toLowerCase().trim();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  };
  
  export const categorizeIngredients = (ingredients) => {
    const categories = {
      proteins: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'tofu', 'eggs', 'beans', 'lentils', 'chickpeas'],
      carbs: ['rice', 'pasta', 'bread', 'potato', 'quinoa', 'couscous', 'noodles', 'tortilla'],
      vegetables: ['broccoli', 'carrot', 'spinach', 'tomato', 'onion', 'pepper', 'mushroom', 'zucchini', 'cucumber', 'lettuce', 'kale', 'cabbage'],
      dairy: ['cheese', 'milk', 'yogurt', 'butter', 'cream', 'sour cream'],
      condiments: ['soy sauce', 'olive oil', 'vinegar', 'salt', 'pepper', 'garlic', 'ginger', 'honey', 'mustard', 'mayo'],
      fruits: ['apple', 'banana', 'orange', 'lemon', 'lime', 'berry', 'mango', 'pineapple']
    };
  
    const categorized = {
      proteins: [],
      carbs: [],
      vegetables: [],
      dairy: [],
      condiments: [],
      fruits: [],
      other: []
    };
  
    ingredients.forEach(ingredient => {
      let found = false;
      const ingredientLower = ingredient.toLowerCase();
      
      for (const [category, items] of Object.entries(categories)) {
        if (items.some(item => ingredientLower.includes(item) || item.includes(ingredientLower))) {
          categorized[category].push(ingredient);
          found = true;
          break;
        }
      }
      
      if (!found) {
        categorized.other.push(ingredient);
      }
    });
  
    return categorized;
  };
  
  export const validateIngredients = (ingredients) => {
    const errors = [];
    
    if (ingredients.length === 0) {
      errors.push('Please add at least one ingredient');
    }
    
    if (ingredients.length > 20) {
      errors.push('Too many ingredients. Please limit to 20 items');
    }
    
    return errors;
  };
  
  export const ingredientSuggestions = [
    // Proteins
    'Chicken', 'Beef', 'Pork', 'Fish', 'Salmon', 'Tuna', 'Shrimp', 'Tofu', 'Eggs', 'Bacon',
    'Turkey', 'Ham', 'Sausage', 'Ground Beef', 'Chicken Breast', 'Lamb',
    
    // Carbs
    'Rice', 'Pasta', 'Bread', 'Tortillas', 'Quinoa', 'Couscous', 'Potatoes', 'Sweet Potatoes',
    'Noodles', 'Oats', 'Flour', 'Crackers', 'Bagels', 'Pita Bread',
    
    // Vegetables
    'Broccoli', 'Carrots', 'Spinach', 'Tomatoes', 'Onions', 'Garlic', 'Bell Peppers', 
    'Mushrooms', 'Zucchini', 'Cucumber', 'Lettuce', 'Corn', 'Peas', 'Green Beans',
    'Cauliflower', 'Asparagus', 'Kale', 'Cabbage', 'Celery', 'Brussels Sprouts',
    'Eggplant', 'Squash', 'Radishes', 'Beets', 'Artichokes',
    
    // Dairy
    'Cheese', 'Milk', 'Yogurt', 'Butter', 'Cream', 'Sour Cream', 'Cream Cheese',
    'Mozzarella', 'Cheddar', 'Parmesan', 'Feta', 'Ricotta', 'Cottage Cheese',
    
    // Pantry/Legumes
    'Beans', 'Black Beans', 'Chickpeas', 'Lentils', 'Kidney Beans', 'Pinto Beans',
    'Canned Tomatoes', 'Tomato Sauce', 'Coconut Milk', 'Peanut Butter',
    
    // Condiments & Seasonings
    'Olive Oil', 'Soy Sauce', 'Hot Sauce', 'Salsa', 'Vinegar', 'Honey', 'Mustard',
    'Mayonnaise', 'Ketchup', 'BBQ Sauce', 'Worcestershire', 'Teriyaki Sauce',
    'Salt', 'Pepper', 'Paprika', 'Cumin', 'Oregano', 'Basil', 'Thyme', 'Rosemary',
    
    // Fruits
    'Apples', 'Bananas', 'Oranges', 'Lemons', 'Limes', 'Berries', 'Strawberries',
    'Blueberries', 'Grapes', 'Mango', 'Pineapple', 'Avocado', 'Peaches', 'Pears',
    
    // Nuts & Seeds
    'Almonds', 'Walnuts', 'Cashews', 'Peanuts', 'Sunflower Seeds', 'Chia Seeds',
    'Sesame Seeds', 'Pine Nuts', 'Pecans'
  ];

  export const getRandomSuggestions = (count = 5, exclude = []) => {
    const available = ingredientSuggestions.filter(
      item => !exclude.some(ex => ex.toLowerCase() === item.toLowerCase())
    );
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  export const validateIngredient = (ingredient) => {
    if (!ingredient || ingredient.trim().length === 0) {
      return { isValid: false, error: 'Ingredient cannot be empty' };
    }
    
    const trimmed = ingredient.trim();
    
    // Check for single character inputs
    if (trimmed.length === 1) {
      return { isValid: false, error: 'Please enter a valid ingredient name' };
    }
    
    // Check for numbers only
    if (/^\d+$/.test(trimmed)) {
      return { isValid: false, error: 'Ingredient cannot be just numbers' };
    }
    
    // Check for too many special characters
    if (/^[^a-zA-Z]*$/.test(trimmed)) {
      return { isValid: false, error: 'Please enter a valid ingredient name' };
    }
    
    // Check minimum length
    if (trimmed.length < 2) {
      return { isValid: false, error: 'Ingredient name is too short' };
    }
    
    // Check maximum length
    if (trimmed.length > 30) {
      return { isValid: false, error: 'Ingredient name is too long' };
    }
    
    // Check spelling against known ingredients (fuzzy matching)
    const lowerTrimmed = trimmed.toLowerCase();
    const isKnownIngredient = ingredientSuggestions.some(known => 
      known.toLowerCase() === lowerTrimmed
    );
    
    // Check for close matches (for typos)
    if (!isKnownIngredient) {
      const closeMatch = findCloseMatch(trimmed);
      if (closeMatch) {
        return { 
          isValid: false, 
          error: `Did you mean "${closeMatch}"? Please check the spelling.` 
        };
      }
      
      // If no close match found, warn that it's not recognized
      return { 
        isValid: false, 
        error: `"${trimmed}" is not recognized. Please check the spelling or try a common ingredient.` 
      };
    }
    
    return { isValid: true };
  };
  
  // Helper function to find close matching for typos
  export const findCloseMatch = (input) => {
    const inputLower = input.toLowerCase();
    
    for (const suggestion of ingredientSuggestions) {
      const suggestionLower = suggestion.toLowerCase();
    
      if (suggestionLower.includes(inputLower) || inputLower.includes(suggestionLower)) {
        return suggestion;
      }
      
      if (Math.abs(suggestionLower.length - inputLower.length) <= 2) {
        let differences = 0;
        const minLength = Math.min(suggestionLower.length, inputLower.length);
        
        for (let i = 0; i < minLength; i++) {
          if (suggestionLower[i] !== inputLower[i]) {
            differences++;
          }
        }

        if (differences <= 2) {
          return suggestion;
        }
      }
    }
    
    return null;
  };