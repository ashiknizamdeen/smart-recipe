import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartMix API is running' });
});

// Recipe generation endpoint
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'No ingredients provided' });
    }

    const prompt = buildPrompt(ingredients, preferences);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are SmartMix, an expert culinary AI. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    res.json(result);
    
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid API key' });
    } else if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded' });
    } else {
      res.status(500).json({ error: 'Failed to generate recipes' });
    }
  }
});

function buildPrompt(ingredients, preferences = {}) {
  const { servings = 2 } = preferences;
  
  return `Create exactly 5 recipes using: ${ingredients.join(', ')}

Return JSON:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "description": "Brief description",
      "usedIngredients": ["from user list"],
      "additionalIngredients": ["max 3 common items"],
      "cookingTime": "X mins",
      "difficulty": "Easy|Medium|Hard",
      "servings": ${servings},
      "isVegetarian": boolean,
      "isVegan": boolean,
      "isGlutenFree": boolean,
      "instructions": ["Step 1", "Step 2", "..."],
      "substitutions": ["2 substitution options"],
      "nutritionEstimate": {
        "calories": "200-250",
        "protein": "15g"
      }
    }
  ]
}`;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});