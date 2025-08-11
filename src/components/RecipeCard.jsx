import React, { useState } from 'react';
import RecipeModal from './RecipeModal';

export default function RecipeCard({ recipe, onSave, isSaved }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        className="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col"
        onClick={() => setShowModal(true)}
      >
        {/* Title - Fixed height */}
        <div className="h-14 mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex items-start gap-2">
            <span className="flex-1">{recipe.title}</span>
            {recipe.isVegetarian && <span title="Vegetarian" className="flex-shrink-0">🥬</span>}
          </h3>
        </div>
        
        {/* Description - Fixed height */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
          {recipe.description}
        </p>
        
        {/* Used Ingredients - Flexible but controlled */}
        <div className="flex-1 mb-4">
          <div className="flex flex-wrap gap-2">
            {recipe.usedIngredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="px-3 py-1 bg-gray-600 text-white rounded-full text-xs">
                {ing}
              </span>
            ))}
            {recipe.usedIngredients.length > 3 && (
              <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-xs">
                +{recipe.usedIngredients.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Button - Always at bottom */}
        <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors mt-auto">
          See cooking instructions
        </button>
      </div>

      {/* Recipe Modal */}
      {showModal && (
        <RecipeModal 
          recipe={recipe} 
          onClose={() => setShowModal(false)}
          onSave={onSave}
          isSaved={isSaved}
        />
      )}
    </>
  );
}