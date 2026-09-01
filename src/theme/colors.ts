/**
 * Libérate Design System - Serene Support Theme Colors
 * Extracted directly from Stitch Design System
 */
export const Colors = {
  // Primary Palette (Lavender)
  primary: '#635979',
  onPrimary: '#ffffff',
  primaryContainer: '#d1c4e9',
  onPrimaryContainer: '#5a506f',
  primaryFixed: '#eaddff',
  primaryFixedDim: '#cdc1e5',
  onPrimaryFixed: '#1f1732',
  onPrimaryFixedVariant: '#4b4260',
  inversePrimary: '#cdc1e5',

  // Secondary Palette (Sky Blue)
  secondary: '#326578',
  onSecondary: '#ffffff',
  secondaryContainer: '#b5e7fe',
  onSecondaryContainer: '#37697d',
  secondaryFixed: '#bbe9ff',
  secondaryFixedDim: '#9ccee4',
  onSecondaryFixed: '#001f29',
  onSecondaryFixedVariant: '#154d5f',

  // Tertiary Palette (Mint Green)
  tertiary: '#4a654e',
  onTertiary: '#ffffff',
  tertiaryContainer: '#b4d2b6',
  onTertiaryContainer: '#415b45',
  tertiaryFixed: '#cceacd',
  tertiaryFixedDim: '#b1ceb2',
  onTertiaryFixed: '#07200e',
  onTertiaryFixedVariant: '#334d37',

  // Surface & Background (Soft Canvas)
  background: '#fbf9f5',
  onBackground: '#1b1c1a',
  surface: '#fbf9f5',
  onSurface: '#1b1c1a',
  surfaceDim: '#dbdad6',
  surfaceBright: '#fbf9f5',
  surfaceVariant: '#e4e2de',
  onSurfaceVariant: '#49454d',
  surfaceTint: '#635979',

  // Surface Containers (Tonal Layering)
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3ef',
  surfaceContainer: '#efeeea',
  surfaceContainerHigh: '#eae8e4',
  surfaceContainerHighest: '#e4e2de',

  // Inverses
  inverseSurface: '#30312e',
  inverseOnSurface: '#f2f0ed',

  // Outlines & Borders
  outline: '#7a757e',
  outlineVariant: '#cac4cd',

  // Errors & Alerts
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Warm Inputs & Tactile Accents
  inputBackground: 'rgba(255, 224, 204, 0.2)', // #FFE0CC at 20%
  inputBorder: '#e4e2de',
  glassOverlay: 'rgba(255, 255, 255, 0.45)',

  // Gradients
  gradientStart: '#635979',
  gradientEnd: '#326578',
} as const;

export type ColorName = keyof typeof Colors;
