/**
 * Hook for managing product search and filtering
 */
import { useMemo, useState } from 'react';
import { mockProducts } from '../lib/mockData';
import { Product } from '../types';

interface UseProductsReturn {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  filteredProducts: Product[];
}

export const useProducts = (): UseProductsReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false); // Mock loading state

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockProducts;
    }

    const query = searchQuery.toLowerCase();
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);

  return {
    products: mockProducts,
    searchQuery,
    setSearchQuery,
    isLoading,
    filteredProducts,
  };
};
