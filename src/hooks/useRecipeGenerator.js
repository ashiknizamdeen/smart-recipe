import { useState, useCallback } from 'react';
import openaiService from '../services/openai';

export default function useRecipeGenerator() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecipes = useCallback(async (ingredients, preferences = {}) => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const generatedRecipes = await openaiService.generateRecipes(ingredients, preferences);
      
      if (!generatedRecipes || generatedRecipes.length === 0) {
        throw new Error('No recipes could be generated. Please try different ingredients.');
      }
      
      setRecipes(generatedRecipes);
      return generatedRecipes;
    } catch (err) {
      console.error('Recipe generation error:', err);
      setError(err.message || 'Failed to generate recipes. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRecipes = useCallback(() => {
    setRecipes([]);
    setError(null);
  }, []);

  const retryGeneration = useCallback(async (ingredients, preferences) => {
    clearRecipes();
    return generateRecipes(ingredients, preferences);
  }, [clearRecipes, generateRecipes]);

  return {
    recipes,
    loading,
    error,
    generateRecipes,
    clearRecipes,
    retryGeneration
  };
}