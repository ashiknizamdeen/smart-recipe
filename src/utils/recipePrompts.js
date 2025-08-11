export const dietaryPreferences = {
    vegetarian: 'vegetarian (no meat or fish)',
    vegan: 'vegan (no animal products)',
    glutenFree: 'gluten-free',
    dairyFree: 'dairy-free',
    lowCarb: 'low-carb/keto friendly',
    paleo: 'paleo diet friendly',
    mediterranian: 'Mediterranean diet style'
  };
  
  export const difficultyLevels = {
    easy: {
      name: 'Easy',
      description: 'Simple techniques, common ingredients, under 30 minutes',
      maxSteps: 6
    },
    medium: {
      name: 'Medium', 
      description: 'Some cooking skills needed, 30-45 minutes',
      maxSteps: 10
    },
    hard: {
      name: 'Hard',
      description: 'Advanced techniques, longer preparation',
      maxSteps: 15
    }
  };
  
  export const mealTypes = {
    breakfast: 'breakfast or brunch',
    lunch: 'lunch or light meal',
    dinner: 'dinner or main course',
    snack: 'snack or appetizer',
    dessert: 'dessert or sweet treat',
    any: 'any meal type'
  };
  
  export const cuisineStyles = [
    'Italian',
    'Mexican',
    'Asian Fusion',
    'Mediterranean',
    'American Comfort',
    'Indian',
    'Thai',
    'Japanese',
    'French',
    'Middle Eastern'
  ];
  
  export const buildSystemPrompt = () => {
    return `You are SmartMix, an expert culinary AI assistant specializing in creating delicious recipes from leftover ingredients to minimize food waste. 
  
  Your expertise includes:
  - Creating balanced, flavorful meals from limited ingredients
  - Suggesting practical substitutions
  - Providing clear, easy-to-follow instructions
  - Considering dietary restrictions and preferences
  - Estimating nutritional information
  - Maximizing the use of available ingredients
  
  Always be creative but practical. Focus on recipes that home cooks can realistically make.`;
  };
  
  export const buildPrompt = (ingredients, preferences = {}) => {
    const { dietary, servings = 2, difficulty = 'any' } = preferences;
    const maxRecipes = import.meta.env.VITE_MAX_RECIPES || 5;
    
    // Check if ingredients contain meat
    const meatIngredients = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon', 'ham', 'turkey', 'lamb'];
    const hasMeat = ingredients.some(ing => 
      meatIngredients.some(meat => ing.toLowerCase().includes(meat))
    );
    
    return `Given these ingredients: ${ingredients.join(', ')}
      
      Generate ${maxRecipes} creative recipe suggestions that:
      1. Use as many of the provided ingredients as possible
      2. Minimize food waste by utilizing leftovers efficiently
      3. Are practical and can be made in a home kitchen
      4. Include clear, numbered step-by-step instructions
      ${!hasMeat ? '5. Prioritize vegetarian recipes (no meat, fish, or poultry)' : '5. Include a mix of vegetarian and non-vegetarian options'}
      ${dietary ? `6. Are ${dietary} friendly` : ''}
      ${difficulty !== 'any' ? `7. Have ${difficulty} difficulty level` : ''}
      
      IMPORTANT RULES FOR VEGETARIAN RECIPES:
      - Vegetarian recipes must NOT contain: meat, poultry, fish, seafood, or any animal flesh
      - Vegetarian recipes CAN contain: eggs, dairy products (milk, cheese, yogurt), honey
      - For vegan recipes: exclude ALL animal products including eggs, dairy, and honey
      
      Sort recipes with vegetarian ones first if possible.
      
      Return JSON with this exact structure:
      {
        "recipes": [
          {
            "title": "Recipe Name",
            "description": "Brief appealing description (max 100 chars)",
            "usedIngredients": ["ingredient1", "ingredient2"],
            "additionalIngredients": ["common pantry items needed"],
            "cookingTime": "X mins",
            "difficulty": "Easy|Medium|Hard",
            "servings": ${servings},
            "isVegetarian": boolean (true if no meat/fish/poultry),
            "isVegan": boolean (true if no animal products at all),
            "isGlutenFree": boolean,
            "instructions": [
              "Step 1: Clear instruction",
              "Step 2: Next step",
              "..."
            ],
            "substitutions": [
              "Ingredient X can be replaced with Y",
              "For dairy-free, use Z instead"
            ],
            "nutritionEstimate": {
              "calories": "200-250",
              "protein": "15g"
            }
          }
        ]
      }`;
  };

  export const buildEnhancedPrompt = (ingredients, preferences = {}) => {
    const {
      dietary,
      servings = 2,
      difficulty = 'any',
      mealType = 'any',
      cuisine,
      maxCookTime,
      equipment
    } = preferences;
  
    let prompt = `Create recipes using these ingredients: ${ingredients.join(', ')}\n\n`;
    
    prompt += 'Requirements:\n';
    prompt += '- Prioritize using the provided ingredients\n';
    prompt += '- Minimize additional ingredients needed\n';
    prompt += '- Provide clear, step-by-step instructions\n';
    
    if (dietary) {
      prompt += `- Must be ${dietary} friendly\n`;
    }
    
    if (difficulty !== 'any') {
      prompt += `- Difficulty level: ${difficulty}\n`;
    }
    
    if (mealType !== 'any') {
      prompt += `- Suitable for ${mealType}\n`;
    }
    
    if (cuisine) {
      prompt += `- ${cuisine} cuisine style preferred\n`;
    }
    
    if (maxCookTime) {
      prompt += `- Maximum cooking time: ${maxCookTime} minutes\n`;
    }
    
    if (equipment) {
      prompt += `- Available equipment: ${equipment.join(', ')}\n`;
    }
    
    prompt += `\nFor ${servings} servings.`;
    
    return prompt;
  };
  
  export const parseRecipeResponse = (response) => {
    // Helper function to parse AI responses that might not be perfectly formatted
    try {
      if (typeof response === 'string') {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      return response;
    } catch (error) {
      console.error('Error parsing recipe response:', error);
      return null;
    }
  };
  
  export const validateRecipe = (recipe) => {
    const required = ['title', 'description', 'ingredients', 'instructions'];
    const missing = required.filter(field => !recipe[field]);
    
    if (missing.length > 0) {
      console.warn(`Recipe missing required fields: ${missing.join(', ')}`);
      return false;
    }
    
    return true;
  };
  
  export const formatCookingTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };
  
  export const estimateCalories = (ingredients) => {
    // Rough calorie estimation based on common ingredients
    const calorieMap = {
      chicken: 165,
      beef: 250,
      rice: 130,
      pasta: 160,
      vegetables: 30,
      cheese: 110,
      eggs: 70,
      bread: 80,
      oil: 120
    };
    
    let total = 0;
    ingredients.forEach(ing => {
      const ingLower = ing.toLowerCase();
      for (const [key, cal] of Object.entries(calorieMap)) {
        if (ingLower.includes(key)) {
          total += cal;
          break;
        }
      }
    });
    
    return total || '200-300';
  };