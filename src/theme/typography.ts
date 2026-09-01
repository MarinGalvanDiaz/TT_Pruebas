import { TextStyle } from 'react-native';

/**
 * Libérate Typography
 * Headlines: Plus Jakarta Sans / System
 * Body & Labels: Be Vietnam Pro / Inter / System
 */
export const Typography: Record<string, TextStyle> = {
  displayHero: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  headlineLg: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  headlineMd: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  labelSm: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  labelSmBold: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
};
