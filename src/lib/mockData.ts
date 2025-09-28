/**
 * Mock product data for testing and development
 * Includes realistic products with various dietary restrictions
 */
import { Product } from '../types';

// Sample products with realistic ingredients
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Whole Milk',
    brand: 'Happy Cow Dairy',
    barcode: '1234567890123',
    ingredients: ['Organic whole milk', 'Vitamin D3'],
  },
  {
    id: '2',
    name: 'Gluten-Free Bread',
    brand: 'Nature\'s Best',
    barcode: '2345678901234',
    ingredients: ['Brown rice flour', 'Tapioca starch', 'Xanthan gum', 'Yeast', 'Salt'],
  },
  {
    id: '3',
    name: 'Chocolate Chip Cookies',
    brand: 'Sweet Treats',
    barcode: '3456789012345',
    ingredients: ['Wheat flour', 'Sugar', 'Butter', 'Chocolate chips', 'Eggs', 'Vanilla extract', 'Baking soda'],
  },
  {
    id: '4',
    name: 'Almond Butter',
    brand: 'Nutty Goodness',
    barcode: '4567890123456',
    ingredients: ['Roasted almonds', 'Sea salt'],
  },
  {
    id: '5',
    name: 'Soy Milk',
    brand: 'Plant Power',
    barcode: '5678901234567',
    ingredients: ['Filtered water', 'Soybeans', 'Cane sugar', 'Calcium carbonate', 'Vitamin D2', 'Vitamin B12'],
  },
  {
    id: '6',
    name: 'Chicken Broth',
    brand: 'Kitchen Basics',
    barcode: '6789012345678',
    ingredients: ['Chicken stock', 'Salt', 'Onion powder', 'Garlic powder', 'Natural flavoring'],
  },
  {
    id: '7',
    name: 'Vegan Cheese',
    brand: 'Plant Based',
    barcode: '7890123456789',
    ingredients: ['Coconut oil', 'Potato starch', 'Soy protein isolate', 'Nutritional yeast', 'Salt', 'Natural flavors'],
  },
  {
    id: '8',
    name: 'Peanut Butter',
    brand: 'Nutty Goodness',
    barcode: '8901234567890',
    ingredients: ['Roasted peanuts', 'Sugar', 'Molasses', 'Salt'],
  },
  {
    id: '9',
    name: 'Wheat Crackers',
    brand: 'Crunchy Time',
    barcode: '9012345678901',
    ingredients: ['Wheat flour', 'Vegetable oil', 'Salt', 'Yeast', 'Malt extract'],
  },
  {
    id: '10',
    name: 'Lactose-Free Yogurt',
    brand: 'Happy Cow Dairy',
    barcode: '0123456789012',
    ingredients: ['Lactose-free milk', 'Live cultures', 'Natural vanilla flavor'],
  },
  {
    id: '11',
    name: 'Mixed Nuts',
    brand: 'Nature\'s Best',
    barcode: '1122334455667',
    ingredients: ['Almonds', 'Cashews', 'Hazelnuts', 'Walnuts', 'Salt'],
  },
  {
    id: '12',
    name: 'Soy Sauce',
    brand: 'Asian Kitchen',
    barcode: '2233445566778',
    ingredients: ['Water', 'Soybeans', 'Wheat', 'Salt', 'Sugar'],
  },
];

// Barcode to product mapping for scanner
export const barcodeToProduct: Record<string, Product> = mockProducts.reduce(
  (acc, product) => {
    acc[product.barcode] = product;
    return acc;
  },
  {} as Record<string, Product>
);

// Dietary restriction synonyms for ingredient analysis
export const dietarySynonyms = {
  dairy: [
    'milk', 'dairy', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein', 
    'lactose', 'milk solids', 'lactose', 'ghee', 'buttermilk'
  ],
  gluten: [
    'wheat', 'barley', 'rye', 'malt', 'spelt', 'flour', 'bread', 'pasta', 
    'cereal', 'oats', 'bulgur', 'couscous', 'semolina'
  ],
  meat: [
    'chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'seafood', 'gelatin',
    'chicken stock', 'beef broth', 'pork fat', 'lard', 'bacon'
  ],
  nuts: [
    'almond', 'walnut', 'pecan', 'cashew', 'hazelnut', 'pistachio', 'macadamia',
    'peanut', 'peanut oil', 'almond oil', 'walnut oil'
  ],
  soy: [
    'soy', 'soybean', 'soy lecithin', 'soy protein', 'soy sauce', 'tofu',
    'tempeh', 'miso', 'soy oil', 'soy flour'
  ],
} as const;
