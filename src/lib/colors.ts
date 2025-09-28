/**
 * Color palette for NutriLens app
 * 5-color limit as per design requirements
 */
export const colors = {
  // Primary colors
  primaryGreen: '#36C090',  // Safe ingredients
  warnYellow: '#F5C746',    // Caution ingredients
  alertRed: '#F35B5B',      // Avoid ingredients
  neutralBG: '#F7F7FA',     // Background
  accentBlue: '#5B8CFF',    // Links/mascot accents
  
  // Semantic variations
  text: {
    primary: '#2D3748',
    secondary: '#718096',
    inverse: '#FFFFFF',
  },
  
  // Background variations
  surface: '#FFFFFF',
  surfaceSecondary: '#F7F7FA',
  
  // Status colors
  success: '#36C090',
  warning: '#F5C746',
  error: '#F35B5B',
  info: '#5B8CFF',
} as const;

export type ColorKey = keyof typeof colors;
