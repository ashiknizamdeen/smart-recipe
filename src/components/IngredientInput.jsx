import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, AlertCircle } from 'lucide-react';
import { ingredientSuggestions, sanitizeIngredient, validateIngredient } from '../utils/ingredientUtils';
import LoadingSpinner from './LoadingSpinner';

export default function IngredientInput({ ingredients, onIngredientsChange, onGenerate, loading }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = ingredientSuggestions.filter(
        suggestion => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !ingredients.some(ing => ing.toLowerCase() === suggestion.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 6));
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1); // Reset selection when suggestions change
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, ingredients]);

  const handleAddIngredient = (ingredient) => {
    setError('');
    
    const validationResult = validateIngredient(ingredient);
    if (!validationResult.isValid) {
      setError(validationResult.error);
      return;
    }

    const sanitized = sanitizeIngredient(ingredient);
    if (sanitized && !ingredients.some(ing => ing.toLowerCase() === sanitized.toLowerCase())) {
      onIngredientsChange([...ingredients, sanitized]);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleAddIngredient(filteredSuggestions[selectedIndex]);
        } else if (inputValue.trim()) {
          handleAddIngredient(inputValue);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    onIngredientsChange(ingredients.filter(i => i !== ingredient));
    setError('');
  };

  const handleGenerateClick = () => {
    if (ingredients.length > 0) {
      onGenerate();
    }
  };

  return (
    <div className="space-y-4">
      {/* Ingredient Tags */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium cursor-pointer hover:bg-green-200 transition-colors flex items-center gap-1"
              onClick={() => handleRemoveIngredient(ingredient)}
            >
              {ingredient} <span className="text-lg leading-none">×</span>
            </span>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Input with Button */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. chicken, tomatoes, onion, salad..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            disabled={loading}
          />
          <button
            onClick={handleGenerateClick}
            disabled={loading || ingredients.length === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              loading || ingredients.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
            }`}
            title={ingredients.length === 0 ? "Add ingredients first" : "Generate recipes"}
          >
            {loading ? (
              <LoadingSpinner size="small" className="border-white" />
            ) : (
              <ArrowUp className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Suggestions Dropdown with keyboard navigation */}
        {showSuggestions && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleAddIngredient(suggestion)}
                className={`w-full text-left px-4 py-2 transition-colors text-gray-700 ${
                  index === selectedIndex 
                    ? 'bg-orange-100 text-orange-900' 
                    : 'hover:bg-orange-50'
                }`}
              >
                {suggestion}
              </button>
            ))}
            <div className="px-4 py-2 text-xs text-gray-500 border-t">
              Use ↑↓ arrows to navigate, Enter to select
            </div>
          </div>
        )}
      </div>
    </div>
  );
}