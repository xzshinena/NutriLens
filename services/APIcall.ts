/**
 * importing gemini api
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DietaryAnalysis, DietaryRestriction, ProductNutrition } from '../types/dietary';

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

console.log('Gemini API Key configured:', GEMINI_API_KEY ? 'Yes' : 'No');
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
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = createAnalysisPrompt(product, dietaryRestriction);
    console.log('Sending request to Gemini API...');
    
    // Create timeout promise
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
  
  const prompt = `
You are a nutrition expert analyzing food products for dietary compatibility.

PRODUCT INFORMATION:
- Product Name: ${product.productName}
- Brand: ${product.brand || 'Unknown'}
- Ingredients: ${product.ingredients || 'Not specified'}

NUTRITION FACTS (per 100g unless specified):
- Calories: ${product.calories || 'Unknown'} kcal
- Carbohydrates: ${product.carbs || 'Unknown'}g
- Sugars: ${product.sugars || 'Unknown'}g
- Fat: ${product.fat || 'Unknown'}g
- Saturated Fat: ${product.saturatedFat || 'Unknown'}g
- Protein: ${product.protein || 'Unknown'}g
- Fiber: ${product.fiber || 'Unknown'}g
- Salt: ${product.salt || 'Unknown'}g
- Sodium: ${product.sodium || 'Unknown'}mg
- Allergens: ${product.allergens?.join(', ') || 'None specified'}
- Nutri-Score: ${product.nutriScore || 'Not available'}

DIETARY RESTRICTION: ${dietary.name}
Description: ${dietary.description}

DIETARY RULES:
${Object.entries(dietary.rules).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

INGREDIENTS TO AVOID:
${dietary.avoidIngredients.join(', ')}

PREFERRED INGREDIENTS:
${dietary.preferIngredients.join(', ')}

ANALYSIS REQUIRED:
Please analyze this product's compatibility with the ${dietary.name} dietary restriction and respond in the following JSON format:

{
  "isCompatible": boolean,
  "riskLevel": "low" | "medium" | "high",
  "compatibilityScore": number (0-100),
  "reasons": [
    "Primary reason for compatibility/incompatibility"
  ],
  "warnings": [
    "Specific warnings about concerning ingredients",
    "Nutritional warnings",
  ],
  "recommendations": [
    "Actionable recommendations",
    "Portion size suggestions",
    "etc."
  ],
  "alternatives": [
    "Suggested alternative products",
    "Brand recommendations",
    "etc."
  ]
}

Focus on:
1. Ingredient analysis for forbidden/preferred items
2. Nutritional compliance with dietary rules
3. Practical advice for the user (a child)
4. Risk assessment based on severity of violations
5. Educational information about why certain ingredients are problematic

keep consideration that the user is a child`;

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
      
      // Validate and return parsed response
      return {
        isCompatible: Boolean(parsed.isCompatible),
        riskLevel: parsed.riskLevel || 'medium',
        compatibilityScore: Math.min(Math.max(parsed.compatibilityScore || 50, 0), 100),
        reasons: Array.isArray(parsed.reasons) ? parsed.reasons : ['Analysis completed'],
        warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : []
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
    alternatives: []
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
    alternatives: []
  };

  const ingredients = product.ingredients?.toLowerCase() || '';
  
  // Check avoided ingredients
  const foundBadIngredients = dietary.avoidIngredients.filter(ingredient => 
    ingredients.includes(ingredient.toLowerCase())
  );
  
  if (foundBadIngredients.length > 0) {
    analysis.isCompatible = false;
    analysis.riskLevel = 'high';
    analysis.compatibilityScore = Math.max(0, 100 - foundBadIngredients.length * 25);
    analysis.reasons.push(`Contains restricted ingredients: ${foundBadIngredients.join(', ')}`);
    analysis.warnings.push('This product contains ingredients not compatible with your dietary restriction');
  }

  // Check nutritional rules
  

  // Adjust compatibility based on score
  if (analysis.compatibilityScore < 70) {
    analysis.isCompatible = false;
    analysis.riskLevel = analysis.compatibilityScore < 50 ? 'high' : 'medium';
  }

  if (analysis.reasons.length === 0) {
    analysis.reasons.push(
      analysis.isCompatible 
        ? 'No major compatibility issues found with your dietary restriction'
        : 'Some concerns found with this product for your dietary restriction'
    );
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
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Explain the ${dietary.name} dietary restriction to a child.
Include:
1. What it is and why people follow it
2. Main foods to avoid and why
3. Recommended foods
4. Key health considerations
5. Tips for following this diet

Keep the explanation concise but informative, suitable for a child.
Response should be 2-3 sentences maximum.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error getting dietary explanation:', error);
    return `${dietary.name}: ${dietary.description}`;
  }
};
