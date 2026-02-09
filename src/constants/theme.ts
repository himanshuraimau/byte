/**
 * Design System Tokens
 * High-Precision Industrial Minimalism
 */

// Light Mode Colors - Matching Web Exactly
export const LightColors = {
  // Background (matching web CSS variables)
  bg0: '#ffffff', // --bg
  bg1: '#f9f9f9', // --bg-secondary
  bg2: '#e5e5e5', // border (deprecated, use border0)

  // Text (matching web CSS variables)
  text0: '#000000', // --text
  text1: '#666666', // --text-secondary
  text2: '#888888', // muted text
  text3: '#BBBBBB', // placeholder

  // Accent (matching web CSS variables)
  accent0: '#22c55e', // --accent-green
  accent1: 'rgba(34, 197, 94, 0.12)', 
  accent2: 'rgba(34, 197, 94, 0.06)',

  // States
  destructive: '#ef4444', // Updated to match web
  warning: '#F59E0B',
  success: '#22c55e',

  // Borders (matching web CSS variables)
  border0: '#e5e5e5', // --border
  border1: '#d1d1d1', // --border-strong
};

// Dark Mode Colors - Matching Web Exactly
export const DarkColors = {
  // Background (matching web CSS variables)
  bg0: '#0a0a0a', // --bg
  bg1: '#1a1a1a', // --bg-secondary
  bg2: '#262626', // border (deprecated, use border0)

  // Text (matching web CSS variables)
  text0: '#ffffff', // --text
  text1: '#a0a0a0', // --text-secondary
  text2: '#888888', 
  text3: '#666666',

  // Accent (matching web CSS variables)
  accent0: '#22c55e', // --accent-green
  accent1: 'rgba(34, 197, 94, 0.16)',
  accent2: 'rgba(34, 197, 94, 0.08)',

  // States
  destructive: '#ef4444', // Matching web
  warning: '#F59E0B',
  success: '#22c55e',

  // Borders (matching web CSS variables)
  border0: '#262626', // --border
  border1: '#404040', // --border-strong
};

// Export Colors with light/dark theme support
export const Colors = {
  light: LightColors,
  dark: DarkColors,
};

// Also export LightColors as default for components that haven't migrated yet
// This maintains backward compatibility
export { LightColors as DefaultColors };

// Typography - Matching Web (Geist Pixel Square / Monospace)
// Note: Using GeistMono as closest match to Geist Pixel Square
// For exact match, would need to add Geist Pixel Square font file
export const Typography = {
  fontFamily: 'GeistMono_400Regular', // Closest to Geist Pixel Square
  fontFamilyBold: 'GeistMono_700Bold',
  fontFamilyMedium: 'GeistMono_500Medium',

  // Sans-serif (Human Content) - Actually using Mono now for industrial look
  display: {
    fontSize: 40,
    fontFamily: 'GeistMono_500Medium',
    lineHeight: 48,
  },
  h1: {
    fontSize: 32,
    fontFamily: 'GeistMono_500Medium',
    lineHeight: 40,
  },
  h2: {
    fontSize: 20,
    fontFamily: 'GeistMono_500Medium',
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    fontFamily: 'GeistMono_400Regular',
    lineHeight: 22.5,
  },
  small: {
    fontSize: 13,
    fontFamily: 'GeistMono_400Regular',
    lineHeight: 19.5,
  },

  // Monospace (System Data)
  monoLg: {
    fontSize: 56,
    fontFamily: 'GeistMono_400Regular',
    lineHeight: 67.2,
  },
  monoMd: {
    fontSize: 14,
    fontFamily: 'GeistMono_400Regular',
    lineHeight: 18.2,
  },
  monoSm: {
    fontSize: 12,
    fontFamily: 'GeistMono_400Regular',
    lineHeight: 15.6,
  },
  monoXs: {
    fontSize: 11,
    fontFamily: 'GeistMono_400Regular',
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
