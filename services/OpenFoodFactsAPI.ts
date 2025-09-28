/**
 * OpenFoodFacts API Service
 * Provides search functionality using the OpenFoodFacts database
 */

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  brands?: string;
  image_url?: string;
  image_small_url?: string;
  ingredients_text?: string;
  nutriments?: {
    energy_kcal?: number;
    carbohydrates?: number;
    sugars?: number;
    fat?: number;
    saturated_fat?: number;
    proteins?: number;
    fiber?: number;
    salt?: number;
    sodium?: number;
  };
  allergens_tags?: string[];
  labels_tags?: string[];
  nutrition_grades?: string;
  nova_groups?: number;
  categories_tags?: string[];
  countries_tags?: string[];
  stores_tags?: string[];
}

export interface OpenFoodFactsSearchResponse {
  page: number;
  page_size: number;
  count: number;
  skip: number;
  products: OpenFoodFactsProduct[];
}

export interface SearchResult {
  id: string;
  name: string;
  brand?: string;
  barcode: string;
  image?: string;
  ingredients?: string | string[];
  nutrition?: {
    calories?: number;
    carbs?: number;
    sugars?: number;
    fat?: number;
    saturatedFat?: number;
    protein?: number;
    fiber?: number;
    salt?: number;
    sodium?: number;
  };
  allergens?: string[];
  labels?: string[];
  nutriScore?: string;
  novaGroup?: number;
  categories?: string[];
  countries?: string[];
  stores?: string[];
}

/**
 * Search products using OpenFoodFacts API
 */
export const searchOpenFoodFacts = async (
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<SearchResult[]> => {
  try {
    console.log(`🔍 Searching OpenFoodFacts for: "${query}"`);
    
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=${pageSize}`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'NutriLens/1.0 (https://nutrilens.app)',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data: OpenFoodFactsSearchResponse = await response.json();
    
    console.log(`📊 Found ${data.count} products, returning ${data.products.length} results`);
    
    return data.products.map(convertToSearchResult);
    
  } catch (error) {
    console.error('OpenFoodFacts search error:', error);
    throw new Error(`Failed to search OpenFoodFacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get product details by barcode from OpenFoodFacts
 */
export const getProductByBarcode = async (barcode: string): Promise<SearchResult | null> => {
  try {
    console.log(`🔍 Getting product by barcode: ${barcode}`);
    
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'NutriLens/1.0 (https://nutrilens.app)',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Product not found
      }
      throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 0) {
      return null; // Product not found
    }

    console.log(`✅ Found product: ${data.product.product_name}`);
    return convertToSearchResult(data.product);
    
  } catch (error) {
    console.error('OpenFoodFacts barcode lookup error:', error);
    throw new Error(`Failed to get product by barcode: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get popular products from OpenFoodFacts
 */
export const getPopularProducts = async (limit: number = 20): Promise<SearchResult[]> => {
  try {
    console.log(`🔍 Getting popular products from OpenFoodFacts`);
    
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?sort_by=popularity&json=1&page_size=${limit}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'NutriLens/1.0 (https://nutrilens.app)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data: OpenFoodFactsSearchResponse = await response.json();
    
    console.log(`📊 Found ${data.products.length} popular products`);
    
    return data.products.map(convertToSearchResult);
    
  } catch (error) {
    console.error('OpenFoodFacts popular products error:', error);
    throw new Error(`Failed to get popular products: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get products by category from OpenFoodFacts
 */
export const getProductsByCategory = async (
  category: string,
  limit: number = 20
): Promise<SearchResult[]> => {
  try {
    console.log(`🔍 Getting products by category: ${category}`);
    
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&json=1&page_size=${limit}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'NutriLens/1.0 (https://nutrilens.app)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data: OpenFoodFactsSearchResponse = await response.json();
    
    console.log(`📊 Found ${data.products.length} products in category: ${category}`);
    
    return data.products.map(convertToSearchResult);
    
  } catch (error) {
    console.error('OpenFoodFacts category search error:', error);
    throw new Error(`Failed to get products by category: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Convert OpenFoodFacts product to our SearchResult format
 */
const convertToSearchResult = (product: OpenFoodFactsProduct): SearchResult => {
  return {
    id: product.code,
    name: product.product_name || 'Unknown Product',
    brand: product.brands,
    barcode: product.code,
    image: product.image_url || product.image_small_url,
    ingredients: product.ingredients_text,
    nutrition: product.nutriments ? {
      calories: product.nutriments.energy_kcal,
      carbs: product.nutriments.carbohydrates,
      sugars: product.nutriments.sugars,
      fat: product.nutriments.fat,
      saturatedFat: product.nutriments.saturated_fat,
      protein: product.nutriments.proteins,
      fiber: product.nutriments.fiber,
      salt: product.nutriments.salt,
      sodium: product.nutriments.sodium,
    } : undefined,
    allergens: product.allergens_tags,
    labels: product.labels_tags,
    nutriScore: product.nutrition_grades,
    novaGroup: product.nova_groups,
    categories: product.categories_tags,
    countries: product.countries_tags,
    stores: product.stores_tags,
  };
};

/**
 * Get search suggestions based on partial query
 */
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  try {
    if (query.length < 2) {
      return [];
    }

    console.log(`🔍 Getting search suggestions for: "${query}"`);
    
    // Use a smaller page size for suggestions
    const results = await searchOpenFoodFacts(query, 1, 10);
    
    // Extract unique product names and brands as suggestions
    const suggestions = new Set<string>();
    
    results.forEach(product => {
      if (product.name) {
        suggestions.add(product.name);
      }
      if (product.brand) {
        suggestions.add(product.brand);
      }
    });

    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
    
  } catch (error) {
    console.error('Search suggestions error:', error);
    return [];
  }
};

/**
 * Get trending search terms (mock implementation)
 * In a real app, this could be based on actual usage data
 */
export const getTrendingSearches = (): string[] => {
  return [
    'Coca Cola',
    'Nutella',
    'Oreo',
    'Greek Yogurt',
    'Protein Bar',
    'Granola',
    'Instant Noodles',
    'Chocolate',
    'Bread',
    'Milk'
  ];
};
