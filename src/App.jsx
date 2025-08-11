import React, { useState, useEffect } from 'react';
import { ChefHat, AlertCircle, ArrowUp } from 'lucide-react';
import IngredientInput from './components/IngredientInput';
import RecipeGrid from './components/RecipeGrid';
import LoadingSpinner from './components/LoadingSpinner';
import useRecipeGenerator from './hooks/useRecipeGenerator';
import { removeDuplicates } from './utils/ingredientUtils';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState(() => {
    const saved = localStorage.getItem('savedRecipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showRecipes, setShowRecipes] = useState(false);

  const { recipes, loading, error, generateRecipes, clearRecipes } = useRecipeGenerator();

  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient!');
      return;
    }

    const cleanIngredients = removeDuplicates(ingredients);
    await generateRecipes(cleanIngredients);
    setShowRecipes(true);
  };

  const handleBackToIngredients = () => {
    setShowRecipes(false);
    setIngredients([]); // Clear ingredients when going back
    clearRecipes(); // Clear recipes
  };

  const handleLogoClick = () => {
    window.location.reload(); // Refreshes the page
  };

  const toggleSaveRecipe = (recipe) => {
    const isAlreadySaved = savedRecipes.some(r => r.title === recipe.title);
    if (isAlreadySaved) {
      setSavedRecipes(savedRecipes.filter(r => r.title !== recipe.title));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  const hasApiKey = import.meta.env.VITE_OPENAI_API_KEY &&
    import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Navbar */}
      <nav className="w-full px-8 py-4 bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-orange-600 transition-colors"
            onClick={handleLogoClick}
          >
            SmartMix
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-700">Welcome, Ashik</span>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">👨‍🍳</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 min-h-screen flex flex-col">
        {!showRecipes ? (
          // Landing Page
          <div className="flex-1 flex flex-col">
            {/* API Warning - positioned at top */}
            {!hasApiKey && (
              <div className="max-w-md mx-auto mt-4 mb-4">
                <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-700 font-medium">Using mock data</span>
                    <p className="text-amber-600 text-xs mt-1">
                      Add your OpenAI API key to .env file to generate real AI recipes.
                      Get your key at platform.openai.com/api-keys
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Center Content - Properly centered */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-8">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDIwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxODAiIHJ4PSIxMCIgZmlsbD0iI0UwRTBFMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgcng9IjUiIGZpbGw9IiNGRkY3RUQiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iODAiIHI9IjE1IiBmaWxsPSIjRkZBNTAwIi8+CjxyZWN0IHg9IjcwIiB5PSIxMTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgcng9IjIiIGZpbGw9IiM0Q0FGNTAiLz4KPHJlY3QgeD0iNzAiIHk9IjEzMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiByeD0iMiIgZmlsbD0iI0ZGNTcyMiIvPgo8cmVjdCB4PSI3MCIgeT0iMTUwIiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjRkZDMTA3Ii8+CjxyZWN0IHg9IjI1IiB5PSIyMCIgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxMCIgcng9IjIiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+"
                  alt="Fridge"
                  className="w-48 h-60 opacity-90"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Ready to cook?</h2>
              <p className="text-gray-600 text-center max-w-md">
                Discover recipes that will transform your leftovers into delicious meals.
              </p>
            </div>

            {/* Bottom Input Section */}
            <div className="w-full max-w-3xl mx-auto pb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">What's in your fridge?</h3>
                <p className="text-sm text-gray-600 mb-2">Add your leftover ingredients and let's create something delicious!</p>
                <p className="text-xs text-gray-500 mb-4 italic">
                  Type an ingredient and press Enter to add it to your list
                </p>

                <IngredientInput
                  ingredients={ingredients}
                  onIngredientsChange={setIngredients}
                  onGenerate={handleGenerateRecipes}
                  loading={loading}
                />
              </div>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500 mt-6">
                AI can make mistakes. Check for important information.
              </p>
            </div>
          </div>
        ) : (
          // Recipe Results Page
          <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full py-8">
            <RecipeGrid
              recipes={recipes}
              savedRecipes={savedRecipes}
              onToggleSave={toggleSaveRecipe}
              onBack={handleBackToIngredients}
              ingredients={ingredients}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;