import React from 'react';

export default function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-gray-200 border-t-orange-500 rounded-full animate-spin ${className}`}
    />
  );
}