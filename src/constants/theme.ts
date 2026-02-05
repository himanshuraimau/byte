/**
 * Design System Tokens
 * High-Precision Industrial Minimalism
 */

// Light Mode Colors
export const LightColors = {
  // Background
  bg0: '#FFFFFF', // Cards, main backgrounds
  bg1: '#F7F7F7', // Subtle fills, secondary backgrounds
  bg2: '#EEEEEE', // Dividers, borders (rare)

  // Text
  text0: '#111111', // Primary text, headings
  text1: '#444444', // Secondary text, body content
  text2: '#888888', // Metadata, timestamps, muted text
  text3: '#BBBBBB', // Placeholder text, disabled states

  // Accent
  accent0: '#2BB673', // Primary accent (green), progress bars, active states
  accent1: 'rgba(43, 182, 115, 0.12)', // Subtle accent backgrounds
  accent2: 'rgba(43, 182, 115, 0.06)', // Very subtle fills

  // States
  destructive: '#DC2626', // Delete, cancel, errors
  warning: '#F59E0B', // Warnings (future use)
  success: '#2BB673', // Success states (same as accent)

  // Borders
  border0: 'rgba(0, 0, 0, 0.06)', // Subtle borders (rare use)
  border1: 'rgba(0, 0, 0, 0.12)', // Medium borders
};

// Dark Mode Colors
export const DarkColors = {
  // Background
  bg0: '#1A1A1A', // Cards, main backgrounds
  bg1: '#0F0F0F', // Subtle fills, secondary backgrounds
  bg2: '#2A2A2A', // Dividers, borders (rare)

  // Text
  text0: '#FFFFFF', // Primary text, headings
  text1: '#D4D4D4', // Secondary text, body content
  text2: '#A3A3A3', // Metadata, timestamps, muted text
  text3: '#666666', // Placeholder text, disabled states

  // Accent
  accent0: '#2BB673', // Primary accent (green), progress bars, active states
  accent1: 'rgba(43, 182, 115, 0.16)', // Subtle accent backgrounds
  accent2: 'rgba(43, 182, 115, 0.08)', // Very subtle fills

  // States
  destructive: '#EF4444', // Delete, cancel, errors
  warning: '#F59E0B', // Warnings (future use)
  success: '#2BB673', // Success states (same as accent)

  // Borders
  border0: 'rgba(255, 255, 255, 0.08)', // Subtle borders (rare use)
  border1: 'rgba(255, 255, 255, 0.12)', // Medium borders
};

// Export Colors with light/dark theme support
export const Colors = {
  light: LightColors,
  dark: DarkColors,
};

// Also export LightColors as default for components that haven't migrated yet
// This maintains backward compatibility
export { LightColors as DefaultColors };

// Typography
export const Typography = {
  // Sans-serif (Human Content)
  display: {
    fontSize: 40,
    fontWeight: '500' as const,
    lineHeight: 48,
  },
  h1: {
    fontSize: 32,
    fontWeight: '500' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22.5,
  },
  small: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 19.5,
  },

  // Monospace (System Data)
  monoLg: {
    fontSize: 56,
    fontWeight: '400' as const,
    lineHeight: 67.2,
  },
  monoMd: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18.2,
  },
  monoSm: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 15.6,
  },
  monoXs: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 14.3,
  },
};

// Spacing System (4px base unit)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 144,
};

// Shadow System
export const Shadows = {
  z1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  z2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  z3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  z4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 12,
  },
};

// Border Radius
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

// Transitions
export const Transitions = {
  fast: 150,
  base: 200,
  slow: 300,
};
