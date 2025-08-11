import React from 'react';
import RecipeCard from './RecipeCard';
import { ArrowLeft } from 'lucide-react';

export default function RecipeGrid({ recipes, savedRecipes, onToggleSave, onBack, ingredients }) {
  // Sort recipes to prioritize vegetarian ones
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (a.isVegetarian && !b.isVegetarian) return -1;
    if (!a.isVegetarian && b.isVegetarian) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to mainpage</span>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your recipes are ready! Vegetarian recipes are labelled with 🥬
        </h2>
      </div>
      
      {/* Recipe Cards Grid - grows to fill space */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRecipes.map((recipe, index) => (
            <RecipeCard
              key={`${recipe.title}-${index}`}
              recipe={recipe}
              onSave={onToggleSave}
              isSaved={savedRecipes.some(r => r.title === recipe.title)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Input Display */}
      <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <input
          type="text"
          value={ingredients.join(', ') + '...'}
          readOnly
          className="w-full px-4 py-3 bg-gray-50 rounded-full text-gray-600 cursor-not-allowed"
        />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-4">
        AI can make mistakes. Check for important information.
      </p>
    </div>
  );
}