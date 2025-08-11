import React from 'react';
import { X, Clock, Users, ChefHat, Heart } from 'lucide-react';

export default function RecipeModal({ recipe, onClose, onSave, isSaved }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {recipe.title}
                {recipe.isVegetarian && <span title="Vegetarian">🥬</span>}
              </h2>
              <p className="text-gray-600 mt-1">{recipe.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave(recipe)}
                className={`p-2 rounded-full transition-colors ${
                  isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cookingTime}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings} servings
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Ingredients You'll Use:</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.usedIngredients.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {ing}
                </span>
              ))}
            </div>
            
            {recipe.additionalIngredients && recipe.additionalIngredients.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">You'll also need:</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.additionalIngredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Cooking Instructions:</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Substitutions */}
          {recipe.substitutions && recipe.substitutions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Substitutions:</h3>
              <ul className="space-y-2">
                {recipe.substitutions.map((sub, i) => (
                  <li key={i} className="text-gray-700 flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nutrition */}
          {recipe.nutritionEstimate && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Nutrition (per serving):</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Calories:</span>
                  <span className="ml-2 font-medium">{recipe.nutritionEstimate.calories}</span>
                </div>
                <div>
                  <span className="text-gray-600">Protein:</span>
                  <span className="ml-2 font-medium">{recipe.nutritionEstimate.protein}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}