import axios from 'axios';

class OpenAIService {
    constructor() {
        this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        this.model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
        this.baseURL = 'https://api.openai.com/v1';

        if (!this.apiKey || this.apiKey === 'your_openai_api_key_here' || !this.apiKey.startsWith('sk-')) {
            console.warn('OpenAI API key not configured properly. Using mock data.');
            this.useMockData = true;
        } else {
            console.log('OpenAI API configured successfully with model:', this.model);
            this.useMockData = false;
        }
    }

    async generateRecipes(ingredients, preferences = {}) {
        if (this.useMockData) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return this.getMockRecipes(ingredients);
        }

        const useBackend = import.meta.env.VITE_USE_BACKEND === 'true';
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

        if (useBackend) {
            try {
                const response = await axios.post(
                    `${backendUrl}/api/generate-recipes`,
                    { ingredients, preferences }
                );
                return this.validateAndFormatRecipes(response.data.recipes);
            } catch (error) {
                console.error('Backend error, falling back to direct API:', error);
                // Falls through to use direct API below
            }
        }

        try {
            const prompt = this.buildPrompt(ingredients, preferences);

            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: `You are SmartMix, an expert culinary AI that creates delicious recipes from leftover ingredients to minimize food waste. 
                         Always return valid JSON with exactly the structure requested. Be creative but practical.
                         Focus on recipes that home cooks can actually make.`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,  // Good balance of creativity
                    max_tokens: 2500,  // Enough for 5 recipes
                    response_format: { type: "json_object" }  // Forces JSON response
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const result = JSON.parse(response.data.choices[0].message.content);
            console.log('Generated recipes:', result.recipes?.length || 0);
            return this.validateAndFormatRecipes(result.recipes);

        } catch (error) {
            console.error('OpenAI API Error:', error.response?.data || error.message);

            // Better error handling
            if (error.response?.status === 401) {
                throw new Error('Invalid API key. Please check your OpenAI API key in .env file');
            } else if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again');
            } else if (error.response?.status === 400) {
                throw new Error('Invalid request. Please try with different ingredients');
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. Please try again');
            }

            // Fallback to mock data if API fails
            console.log('Falling back to mock data due to API error');
            return this.getMockRecipes(ingredients);
        }
    }

    buildPrompt(ingredients, preferences) {
        const { dietary, servings = 2, difficulty = 'any' } = preferences;
        const maxRecipes = 5;

        // Check for vegetarian
        const meatIngredients = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon', 'ham', 'turkey', 'lamb'];
        const hasMeat = ingredients.some(ing =>
            meatIngredients.some(meat => ing.toLowerCase().includes(meat))
        );

        return `Create exactly ${maxRecipes} recipes using these ingredients: ${ingredients.join(', ')}
  
  IMPORTANT REQUIREMENTS:
  1. Use as many provided ingredients as possible in each recipe
  2. Minimize food waste - be creative with leftovers
  3. ${!hasMeat ? 'Prioritize VEGETARIAN recipes (no meat/fish/poultry)' : 'Include mix of vegetarian and non-vegetarian'}
  4. Keep recipes practical and achievable for home cooks
  5. Cooking time should be under 45 minutes
  ${dietary ? `6. Ensure recipes are ${dietary} friendly` : ''}
  
  VEGETARIAN RULES:
  - Vegetarian = NO meat, poultry, fish, seafood
  - Vegetarian CAN have eggs, dairy, honey
  - Mark recipes correctly with isVegetarian: true/false
  
  Return EXACTLY this JSON structure with ${maxRecipes} recipes:
  {
    "recipes": [
      {
        "title": "Creative Recipe Name (max 40 chars)",
        "description": "Appetizing description (max 100 chars)",
        "usedIngredients": ["list of ingredients from user's list used"],
        "additionalIngredients": ["common pantry items needed, max 5 items"],
        "cookingTime": "X mins",
        "difficulty": "Easy|Medium|Hard",
        "servings": ${servings},
        "isVegetarian": true/false,
        "isVegan": true/false,
        "isGlutenFree": true/false,
        "instructions": [
          "Step 1: Clear, specific instruction",
          "Step 2: Next step with measurements",
          "Step 3: Include cooking times/temperatures",
          "(5-8 steps total)"
        ],
        "substitutions": [
          "Ingredient X can be replaced with Y",
          "For dietary variation, use Z"
        ],
        "nutritionEstimate": {
          "calories": "200-250 per serving",
          "protein": "15g"
        }
      }
    ]
  }
  
  Ensure variety in cooking methods and cuisines. Be creative but realistic!`;
    }

    validateAndFormatRecipes(recipes) {
        if (!recipes || !Array.isArray(recipes)) {
            return [];
        }

        // Ensure all recipes have required fields
        return recipes.map(recipe => ({
            title: recipe.title || 'Unnamed Recipe',
            description: recipe.description || 'A delicious recipe using your ingredients',
            usedIngredients: recipe.usedIngredients || [],
            additionalIngredients: recipe.additionalIngredients || [],
            cookingTime: recipe.cookingTime || '30 mins',
            difficulty: recipe.difficulty || 'Medium',
            servings: recipe.servings || 2,
            isVegetarian: recipe.isVegetarian || false,
            isVegan: recipe.isVegan || false,
            isGlutenFree: recipe.isGlutenFree || false,
            instructions: recipe.instructions || ['Prepare and cook ingredients as needed'],
            substitutions: recipe.substitutions || [],
            nutritionEstimate: recipe.nutritionEstimate || {
                calories: 'Not calculated',
                protein: 'Not calculated'
            }
        }));
    }

    getMockRecipes(ingredients) {
        const mockRecipes = [
            {
                title: "Quick Stir-Fry",
                description: "A versatile stir-fry using your available ingredients",
                usedIngredients: ingredients.slice(0, Math.min(4, ingredients.length)),
                additionalIngredients: ["soy sauce", "sesame oil", "garlic"],
                cookingTime: "15 mins",
                difficulty: "Easy",
                servings: 2,
                isVegetarian: !ingredients.some(i => ['chicken', 'beef', 'pork', 'fish'].some(meat => i.toLowerCase().includes(meat))),
                isVegan: false,
                isGlutenFree: false,
                instructions: [
                    "Heat oil in a wok over high heat",
                    "Add protein if using and cook until done",
                    "Add vegetables and stir-fry for 3-5 minutes",
                    "Season with soy sauce and serve"
                ],
                substitutions: ["Any vegetables work", "Tofu can replace meat"],
                nutritionEstimate: { calories: "250-300", protein: "15g" }
            },
            {
                title: "Simple Pasta",
                description: "Quick pasta dish with fresh ingredients",
                usedIngredients: ingredients.slice(0, Math.min(3, ingredients.length)),
                additionalIngredients: ["pasta", "olive oil", "herbs"],
                cookingTime: "20 mins",
                difficulty: "Easy",
                servings: 3,
                isVegetarian: true,
                isVegan: false,
                isGlutenFree: false,
                instructions: [
                    "Cook pasta according to package directions",
                    "Sauté vegetables in olive oil",
                    "Toss pasta with vegetables",
                    "Season and serve"
                ],
                substitutions: ["Any pasta shape works", "Add cheese if desired"],
                nutritionEstimate: { calories: "280", protein: "10g" }
            },
            {
                title: "Fresh Salad Bowl",
                description: "Healthy and refreshing salad",
                usedIngredients: ingredients.slice(0, Math.min(4, ingredients.length)),
                additionalIngredients: ["dressing", "lemon"],
                cookingTime: "10 mins",
                difficulty: "Easy",
                servings: 2,
                isVegetarian: true,
                isVegan: true,
                isGlutenFree: true,
                instructions: [
                    "Wash and chop all vegetables",
                    "Combine in a large bowl",
                    "Add dressing and toss",
                    "Serve immediately"
                ],
                substitutions: ["Any fresh vegetables work"],
                nutritionEstimate: { calories: "150", protein: "5g" }
            }
        ];

        return mockRecipes.slice(0, 3);
    }
}

export default new OpenAIService();