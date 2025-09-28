/**
 * Type definitions for NutriLens app
 */

// Core product data structure
export interface Product {
  id: string;
  name: string;
  brand: string;
  image?: string;
  barcode: string;
  ingredients: string[];
}

// Ingredient analysis result
export interface IngredientFlag {
  ingredient: string;
  flag: 'safe' | 'caution' | 'avoid';
  reason?: string;
}

// Product verdict result
export interface Verdict {
  productVerdict: 'good' | 'caution' | 'avoid';
  summaryLine: string;
  perIngredientFlags: IngredientFlag[];
}

// User dietary settings
export interface UserSettings {
  noDairy: boolean;
  noGluten: boolean;
  noMeat: boolean;
  noNuts: boolean;
  noSoy: boolean;
}

// History item for tracking scanned products
export interface HistoryItem {
  id: string;
  productId: string;
  name: string;
  verdict: 'good' | 'caution' | 'avoid';
  scannedAt: Date;
}

// Owl mascot moods
export type OwlMood = 'happy' | 'concerned' | 'warning';

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { product: Product };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Scan: undefined;
  History: undefined;
  Settings: undefined;
};

// Component prop types
export interface VerdictBadgeProps {
  verdict: 'good' | 'caution' | 'avoid';
  size?: 'small' | 'medium' | 'large';
}

export interface IngredientChipProps {
  text: string;
  flag: 'safe' | 'caution' | 'avoid';
}

export interface OwlMascotProps {
  mood: OwlMood;
  message: string;
}

export interface ToggleRowProps {
  iconName: string;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}