/**
 * Typography system using Nunito font family
 * Rounded sans serif for kid-friendly design
 */
export const typography = {
  // Font families
  fontFamily: {
    regular: 'Nunito_400Regular',
    medium: 'Nunito_500Medium',
    semiBold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
  },
  
  // Font sizes with accessibility scaling
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Line heights for better readability
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
} as const;

export type TypographyKey = keyof typeof typography;
