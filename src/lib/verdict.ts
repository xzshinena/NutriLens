/**
 * Verdict engine for analyzing products against user dietary restrictions
 * Determines if products are safe, require caution, or should be avoided
 */
import { IngredientFlag, Product, UserSettings, Verdict } from '../types';
import { dietarySynonyms } from './mockData';

/**
 * Analyze a single ingredient against user settings
 */
const analyzeIngredient = (
  ingredient: string,
  settings: UserSettings
): IngredientFlag => {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Check for avoid conditions (user has restriction AND ingredient contains trigger)
  const avoidReasons: string[] = [];
  
  if (settings.noDairy && dietarySynonyms.dairy.some(synonym => 
    lowerIngredient.includes(synonym.toLowerCase())
  )) {
    avoidReasons.push('contains dairy');
  }
  
  if (settings.noGluten && dietarySynonyms.gluten.some(synonym => 
    lowerIngredient.includes(synonym.toLowerCase())
  )) {
    avoidReasons.push('contains gluten');
  }
  
  if (settings.noMeat && dietarySynonyms.meat.some(synonym => 
    lowerIngredient.includes(synonym.toLowerCase())
  )) {
    avoidReasons.push('contains meat');
  }
  
  if (settings.noNuts && dietarySynonyms.nuts.some(synonym => 
    lowerIngredient.includes(synonym.toLowerCase())
  )) {
    avoidReasons.push('contains nuts');
  }
  
  if (settings.noSoy && dietarySynonyms.soy.some(synonym => 
    lowerIngredient.includes(synonym.toLowerCase())
  )) {
    avoidReasons.push('contains soy');
  }
  
  // Return appropriate flag
  if (avoidReasons.length > 0) {
    return {
      ingredient,
      flag: 'avoid',
      reason: avoidReasons.join(', ')
    };
  }
  
  // Check for caution conditions (potential cross-contamination or unclear ingredients)
  const cautionReasons: string[] = [];
  
  // Check for "natural flavors" or "spices" which might contain allergens
  if (lowerIngredient.includes('natural flavor') || 
      lowerIngredient.includes('artificial flavor') ||
      lowerIngredient.includes('spices')) {
    cautionReasons.push('may contain allergens');
  }
  
  // Check for "processed in facility" warnings
  if (lowerIngredient.includes('processed') || 
      lowerIngredient.includes('manufactured')) {
    cautionReasons.push('processed in shared facility');
  }
  
  if (cautionReasons.length > 0) {
    return {
      ingredient,
      flag: 'caution',
      reason: cautionReasons.join(', ')
    };
  }
  
  // Safe ingredient
  return {
    ingredient,
    flag: 'safe'
  };
};

/**
 * Generate kid-friendly summary line based on verdict
 */
const generateSummaryLine = (verdict: 'good' | 'caution' | 'avoid', flags: IngredientFlag[]): string => {
  const avoidFlags = flags.filter(f => f.flag === 'avoid');
  const cautionFlags = flags.filter(f => f.flag === 'caution');
  
  if (verdict === 'avoid') {
    const reasons = avoidFlags.map(f => f.reason).filter(Boolean);
    if (reasons.length > 0) {
      return `Watch out! This has ${reasons[0]}. It might upset your tummy!`;
    }
    return 'Watch out! This has ingredients you need to avoid.';
  }
  
  if (verdict === 'caution') {
    return 'This looks mostly okay, but check with a grown-up first!';
  }
  
  return 'Good choice! This looks safe for you to eat!';
};

/**
 * Analyze a product against user dietary settings
 */
export const analyzeProduct = (product: Product, settings: UserSettings): Verdict => {
  // Analyze each ingredient
  const perIngredientFlags = product.ingredients.map(ingredient => 
    analyzeIngredient(ingredient, settings)
  );
  
  // Determine overall product verdict
  const hasAvoid = perIngredientFlags.some(flag => flag.flag === 'avoid');
  const hasCaution = perIngredientFlags.some(flag => flag.flag === 'caution');
  
  let productVerdict: 'good' | 'caution' | 'avoid';
  if (hasAvoid) {
    productVerdict = 'avoid';
  } else if (hasCaution) {
    productVerdict = 'caution';
  } else {
    productVerdict = 'good';
  }
  
  // Generate summary line
  const summaryLine = generateSummaryLine(productVerdict, perIngredientFlags);
  
  return {
    productVerdict,
    summaryLine,
    perIngredientFlags
  };
};

/**
 * Get owl mood based on verdict
 */
export const getOwlMood = (verdict: 'good' | 'caution' | 'avoid'): 'happy' | 'concerned' | 'warning' => {
  switch (verdict) {
    case 'good':
      return 'happy';
    case 'caution':
      return 'concerned';
    case 'avoid':
      return 'warning';
  }
};
