// Dietary Restriction Types and Configurations

export interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  rules: {
    maxCalories?: number;
    maxCarbs?: number;
    maxSugars?: number;
    maxFat?: number;
    maxSaturatedFat?: number;
    maxSalt?: number;
    maxSodium?: number;
    minProtein?: number;
    minFiber?: number;
  };
  avoidIngredients: string[];
  preferIngredients: string[];
  allowedLabels: string[];
  avoidedLabels: string[];
}

export interface DietaryAnalysis {
  isCompatible: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  compatibilityScore: number; // 0-100
  reasons: string[];
  warnings: string[];
  recommendations: string[];
  alternatives?: string[];
  nutrientConcerns?: Array<{
    nutrient: string;
    value: number;
    limit: number;
    severity: 'low' | 'warning' | 'critical';
  }>;
}

export interface ProductNutrition {
  productName: string;
  brand?: string;
  ingredients?: string;
  calories?: number;
  carbs?: number;
  sugars?: number;
  fat?: number;
  saturatedFat?: number;
  protein?: number;
  fiber?: number;
  salt?: number;
  sodium?: number;
  allergens?: string[];
  labels?: string[];
  nutriScore?: string;
  novaGroup?: number;
}

// Predefined Dietary Restriction Profiles
export const DIETARY_PROFILES: Record<string, DietaryRestriction> = {
  keto: {
    id: 'keto',
    name: 'Ketogenic Diet',
    description: 'High fat, very low carb diet for ketosis',
    color: '#8B4513',
    emoji: '🥑',
    rules: {
      maxCarbs: 20,
      maxSugars: 5 // percentage of calories
    },
    avoidIngredients: [
      'sugar', 'corn syrup', 'wheat', 'rice', 'potato', 'oats', 'barley',
      'quinoa', 'bread', 'pasta', 'honey', 'maple syrup', 'fruit juice'
    ],
    preferIngredients: [
      'avocado', 'coconut oil', 'olive oil', 'butter', 'cheese', 'eggs',
      'meat', 'fish', 'nuts', 'seeds', 'leafy greens'
    ],
    allowedLabels: ['low-carb', 'sugar-free', 'keto-friendly'],
    avoidedLabels: ['high-carb', 'sweetened']
  },
  vegan: {
    id: 'vegan',
    name: 'Vegan',
    description: 'Plant-based, no animal products',
    color: '#2E7D32',
    emoji: '🌱',
    rules: {},
    avoidIngredients: [
      'milk', 'cheese', 'butter', 'eggs', 'meat', 'chicken', 'beef', 'pork',
      'fish', 'seafood', 'honey', 'gelatin', 'casein', 'whey', 'lactose',
      'albumin', 'lard', 'tallow', 'carmine', 'shellac'
    ],
    preferIngredients: [
      'vegetables', 'fruits', 'grains', 'legumes', 'nuts', 'seeds',
      'tofu', 'tempeh', 'nutritional yeast', 'plant milk'
    ],
    allowedLabels: ['vegan', 'plant-based', 'dairy-free'],
    avoidedLabels: ['contains-milk', 'contains-eggs', 'non-vegan']
  },
  vegetarian: {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'No meat or fish, dairy and eggs okay',
    color: '#4CAF50',
    emoji: '🥬',
    rules: {},
    avoidIngredients: [
      'meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'gelatin',
      'lard', 'tallow', 'chicken broth', 'beef broth', 'anchovy'
    ],
    preferIngredients: [
      'vegetables', 'fruits', 'grains', 'legumes', 'dairy', 'eggs',
      'nuts', 'seeds', 'cheese', 'milk', 'yogurt'
    ],
    allowedLabels: ['vegetarian', 'lacto-vegetarian', 'ovo-vegetarian'],
    avoidedLabels: ['contains-meat', 'contains-fish']
  },
  glutenFree: {
    id: 'glutenFree',
    name: 'Gluten-Free',
    description: 'No gluten-containing grains',
    color: '#FF9800',
    emoji: '🌾',
    rules: {},
    avoidIngredients: [
      'wheat', 'barley', 'rye', 'spelt', 'kamut', 'triticale', 'gluten',
      'wheat flour', 'barley malt', 'brewer\'s yeast', 'seitan'
    ],
    preferIngredients: [
      'rice', 'corn', 'quinoa', 'amaranth', 'buckwheat', 'millet',
      'oats', 'potatoes', 'tapioca', 'coconut flour', 'almond flour'
    ],
    allowedLabels: ['gluten-free', 'certified gluten-free'],
    avoidedLabels: ['contains-gluten', 'may contain wheat']
  },
  lowSodium: {
    id: 'lowSodium',
    name: 'Low Sodium',
    description: 'Restricted sodium for heart health',
    color: '#2196F3',
    emoji: '💙',
    rules: {
      maxSodium: 140, // mg per serving
      maxSalt: 0.35 // grams per 100g
    },
    avoidIngredients: [
      'salt', 'sodium chloride', 'monosodium glutamate', 'sodium bicarbonate',
      'sodium nitrate', 'sodium benzoate', 'soy sauce', 'fish sauce'
    ],
    preferIngredients: [
      'herbs', 'spices', 'lemon', 'garlic', 'onion', 'fresh vegetables',
      'unsalted nuts', 'low-sodium alternatives'
    ],
    allowedLabels: ['low-sodium', 'no salt added', 'reduced sodium'],
    avoidedLabels: ['high-sodium', 'salted']
  },
  diabetic: {
    id: 'diabetic',
    name: 'Diabetic-Friendly',
    description: 'Low sugar, controlled carbs for blood sugar management',
    color: '#9C27B0',
    emoji: '🩺',
    rules: {
      maxSugars: 10,
      maxCarbs: 45, // per serving
    },
    avoidIngredients: [
      'sugar', 'high fructose corn syrup', 'corn syrup', 'dextrose',
      'sucrose', 'maltose', 'honey', 'maple syrup', 'agave'
    ],
    preferIngredients: [
      'whole grains', 'vegetables', 'lean protein', 'nuts', 'seeds',
      'stevia', 'monk fruit', 'erythritol', 'fiber-rich foods'
    ],
    allowedLabels: ['sugar-free', 'no added sugar', 'diabetic-friendly'],
    avoidedLabels: ['high-sugar', 'sweetened']
  },
  paleo: {
    id: 'paleo',
    name: 'Paleo Diet',
    description: 'Whole foods, no processed foods or grains',
    color: '#795548',
    emoji: '🏃',
    rules: {},
    avoidIngredients: [
      'grains', 'wheat', 'rice', 'corn', 'oats', 'legumes', 'beans',
      'peanuts', 'soy', 'dairy', 'sugar', 'artificial sweeteners',
      'processed oils', 'preservatives'
    ],
    preferIngredients: [
      'meat', 'fish', 'eggs', 'vegetables', 'fruits', 'nuts', 'seeds',
      'olive oil', 'coconut oil', 'avocado', 'herbs', 'spices'
    ],
    allowedLabels: ['paleo', 'whole30', 'grain-free'],
    avoidedLabels: ['processed', 'contains-grains']
  }
};

export const getDietaryProfile = (id: string): DietaryRestriction | null => {
  return DIETARY_PROFILES[id] || null;
};

export const getAllDietaryProfiles = (): DietaryRestriction[] => {
  return Object.values(DIETARY_PROFILES);
};
