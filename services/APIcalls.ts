/**
 * importing gemini api
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
import { DietaryAnalysis, DietaryRestriction, ProductNutrition } from '../lib/dietary';

// Initialize Gemini AI - Enhanced debugging
console.log('🔍 API Key Loading Debug:');
console.log('  - process.env.EXPO_PUBLIC_GEMINI_API_KEY:', process.env.EXPO_PUBLIC_GEMINI_API_KEY ? 'EXISTS' : 'MISSING');
console.log('  - Constants.expoConfig?.extra?.geminiApiKey:', Constants.expoConfig?.extra?.geminiApiKey ? 'EXISTS' : 'MISSING');

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 
                      Constants.expoConfig?.extra?.geminiApiKey;

console.log('Final Result: Gemini API Key configured:', GEMINI_API_KEY ? 'Yes ✅' : 'No ❌');

if (GEMINI_API_KEY && GEMINI_API_KEY.includes('your_api_key_here')) {
  console.warn('⚠️ Please replace GEMINI_API_KEY with your actual API key!');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Analyzes a product's compatibility with dietary restrictions using Gemini AI
 */
export const analyzeDietaryCompatibility = async (
  product: ProductNutrition,
  dietaryRestriction: DietaryRestriction
): Promise<DietaryAnalysis> => {
  
  if (!genAI || !GEMINI_API_KEY) {
    // Fallback to rule-based analysis if Gemini is not available
    return fallbackAnalysis(product, dietaryRestriction);
  }

  try {
    console.log('Initializing Gemini model: gemini-2.5-flash-lite');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = createAnalysisPrompt(product, dietaryRestriction);
    console.log('Sending simplified request to Gemini API...');
    console.log('Prompt length:', prompt.length, 'characters');
    
    // Create timeout promise (15 seconds for flash-lite model)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout after 15 seconds')), 15000);
    });
    
    // Race between API call and timeout
    const result: any = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    
    console.log('Gemini API responded, processing...');
    const response = await result.response;
    const text = response.text();
    console.log('Gemini response length:', text.length);

    return parseGeminiResponse(text, product, dietaryRestriction);
    
  } catch (error) {
    console.error('Gemini API error:', error);
    console.log('Falling back to rule-based analysis');
    
    // Fallback to rule-based analysis on error
    return fallbackAnalysis(product, dietaryRestriction);
  }
};

/**
 * Creates a comprehensive prompt for Gemini AI analysis
 */
const createAnalysisPrompt = (
  product: ProductNutrition, 
  dietary: DietaryRestriction
): string => {
  
  const prompt = `Check if "${product.productName}" is safe for ${dietary.name} diet.

Ingredients: ${product.ingredients || 'Not specified'}
Avoid: ${dietary.avoidIngredients.join(', ')}

JSON response:
{
  "isCompatible": true/false,
  "warnings": ["ingredient concerns"],
  "recommendations": ["simple advice"]
}`;

  return prompt;
};

/**
 * Parses Gemini's response and creates a structured analysis object
 */
const parseGeminiResponse = (
  response: string,
  product: ProductNutrition,
  dietary: DietaryRestriction
): DietaryAnalysis => {
  
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and return simplified response
      const isCompatible = Boolean(parsed.isCompatible);
      const warnings = Array.isArray(parsed.warnings) ? parsed.warnings : [];
      const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
      
      return {
        isCompatible,
        riskLevel: warnings.length > 0 ? 'high' : 'low',
        compatibilityScore: isCompatible ? (warnings.length > 0 ? 70 : 90) : 20,
        reasons: [isCompatible ? 'Product appears safe for your diet' : 'Product contains concerning ingredients'],
        warnings,
        recommendations,
        alternatives: [],
        nutrientConcerns: []
      };
    }
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
  }

  // Fallback parsing if JSON extraction fails
  return parseTextResponse(response, product, dietary);
};

/**
 * Fallback text parsing when JSON parsing fails
 */
const parseTextResponse = (
  text: string,
  product: ProductNutrition,
  dietary: DietaryRestriction
): DietaryAnalysis => {
  
  const isCompatible = !text.toLowerCase().includes('not compatible') && 
                      !text.toLowerCase().includes('not suitable') &&
                      !text.toLowerCase().includes('avoid');
  
  const hasWarnings = text.toLowerCase().includes('warning') || 
                     text.toLowerCase().includes('concern') ||
                     text.toLowerCase().includes('caution');
  
  const riskLevel = hasWarnings ? 'high' : isCompatible ? 'low' : 'medium';
  
  return {
    isCompatible,
    riskLevel,
    compatibilityScore: isCompatible ? 75 : 25,
    reasons: [text.substring(0, 200) + '...'],
    warnings: hasWarnings ? ['Please review the full analysis carefully'] : [],
    recommendations: ['Consult with a nutritionist for personalized advice'],
    alternatives: [],
    nutrientConcerns: []
  };
};

/**
 * Fallback rule-based analysis when Gemini AI is not available
 */
const fallbackAnalysis = (
  product: ProductNutrition,
  dietary: DietaryRestriction
): DietaryAnalysis => {
  
  const analysis: DietaryAnalysis = {
    isCompatible: true,
    riskLevel: 'low',
    compatibilityScore: 100,
    reasons: [],
    warnings: [],
    recommendations: [],
    alternatives: [],
    nutrientConcerns: []
  };

  const ingredients = product.ingredients?.toLowerCase() || '';
  
  // Check avoided ingredients (simplified)
  const foundBadIngredients = dietary.avoidIngredients.filter(ingredient => 
    ingredients.includes(ingredient.toLowerCase())
  );
  
  if (foundBadIngredients.length > 0) {
    analysis.isCompatible = false;
    analysis.riskLevel = 'high';
    analysis.compatibilityScore = 20;
    analysis.reasons = ['Contains ingredients to avoid for your diet'];
    analysis.warnings = foundBadIngredients.map(ingredient => `Contains ${ingredient}`);
    analysis.recommendations = [`Avoid this product due to ${foundBadIngredients[0]}`];
  } else {
    analysis.reasons = ['No concerning ingredients found'];
    analysis.recommendations = ['This product appears safe for your diet'];
  }

  return analysis;
};

/**
 * Helper function to get nutrient values from product
 */
const getProductNutrientValue = (product: ProductNutrition, nutrient: string): number | null => {
  const nutrientMap: { [key: string]: keyof ProductNutrition } = {
    'maxCalories': 'calories',
    'maxCarbs': 'carbs',
    'maxSugars': 'sugars',
    'maxFat': 'fat',
    'maxSaturatedFat': 'saturatedFat',
    'maxSalt': 'salt',
    'maxSodium': 'sodium',
    'minProtein': 'protein',
    'minFiber': 'fiber'
  };
  
  const productKey = nutrientMap[nutrient];
  return productKey ? (product[productKey] as number) || null : null;
};

/**
 * Gets a user-friendly explanation of a dietary restriction
 */
export const explainDietaryRestriction = async (dietary: DietaryRestriction): Promise<string> => {
  if (!genAI || !GEMINI_API_KEY) {
    return `${dietary.name}: ${dietary.description}`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const prompt = `Explain ${dietary.name} diet to a child in 2 simple sentences. What to avoid and why.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error getting dietary explanation:', error);
    return `${dietary.name}: ${dietary.description}`;
  }
};

/**
 * Interface for the database-ready scan history format
 */
export interface ScanHistoryRecord {
  // Product Information
  productName: string;
  brand?: string;
  ingredients?: string;
  
  // Nutritional Data
  nutrition: {
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
  
  // Product Metadata
  allergens?: string[];
  labels?: string[];
  nutriScore?: string;
  novaGroup?: number;
  
  // Dietary Analysis Results
  analysis: {
    isCompatible: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    compatibilityScore: number;
    reasons: string[];
    warnings: string[];
    recommendations: string[];
    alternatives: string[];
    nutrientConcerns: Array<{
      nutrient: string;
      value: number;
      limit: number;
      severity: 'low' | 'warning' | 'critical';
    }>;
  };
  
  // Dietary Restriction Context
  dietaryRestriction: {
    id: string;
    name: string;
    description: string;
  };
  
  // Metadata
  scanTimestamp: string; // ISO string
  productKey?: string;
}

/**
 * Formats dietary analysis and product data for database storage
 * This function extracts all compatibility and risk parameters in a structured format
 * suitable for storing scan history in a database
 */
export const formatScanHistoryRecord = (
  product: ProductNutrition,
  analysis: DietaryAnalysis,
  dietaryRestriction: DietaryRestriction
): ScanHistoryRecord => {
  
  return {
    // Product Information
    productName: product.productName,
    brand: product.brand,
    ingredients: product.ingredients,
    
    // Nutritional Data - organized in nested object for easier querying
    nutrition: {
      calories: product.calories,
      carbs: product.carbs,
      sugars: product.sugars,
      fat: product.fat,
      saturatedFat: product.saturatedFat,
      protein: product.protein,
      fiber: product.fiber,
      salt: product.salt,
      sodium: product.sodium,
    },
    
    // Product Metadata
    allergens: product.allergens,
    labels: product.labels,
    nutriScore: product.nutriScore,
    novaGroup: product.novaGroup,
    
    // Dietary Analysis Results - all compatibility and risk parameters
    analysis: {
      isCompatible: analysis.isCompatible,
      riskLevel: analysis.riskLevel,
      compatibilityScore: analysis.compatibilityScore,
      reasons: analysis.reasons,
      warnings: analysis.warnings,
      recommendations: analysis.recommendations,
      alternatives: analysis.alternatives || [],
      nutrientConcerns: analysis.nutrientConcerns || [],
    },
    
    // Dietary Restriction Context
    dietaryRestriction: {
      id: dietaryRestriction.id,
      name: dietaryRestriction.name,
      description: dietaryRestriction.description,
    },
    
    // Metadata
    scanTimestamp: new Date().toISOString(),
    productKey: analysis.productKey,
  };
};

