export interface HistoryItem {
  id: string;
  productId: string;
  name: string;
  scannedAt: Date;
  verdict: 'Good' | 'Caution' | 'Avoid';
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  ingredients: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sugar?: number;
    sodium?: number;
  };
  image?: string;
}

export interface UserSettings {
  noDairy: boolean;
  noGluten: boolean;
  noMeat: boolean;
  noNuts: boolean;
  noSoy: boolean;
}

export interface IngredientFlag {
  ingredient: string;
  flag: 'good' | 'caution' | 'avoid';
  reason: string;
}

export interface Verdict {
  productVerdict: 'good' | 'caution' | 'avoid';
  ingredientFlags: IngredientFlag[];
  summary: string;
}
