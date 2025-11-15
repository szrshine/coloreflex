import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Theme - Renk paleti, font boyutları, spacing değerleri
 */

// Temel renkler
export const colors = {
  // Primary colors
  primary: '#FF3B30',
  secondary: '#007AFF',
  success: '#34C759',
  warning: '#FFCC00',
  danger: '#FF3B30',

  // Background colors
  background: {
    primary: '#1a1a2e',
    secondary: '#2C2C3E',
    overlay: 'rgba(0, 0, 0, 0.7)',
    card: 'rgba(255, 255, 255, 0.05)',
    cardHighlight: 'rgba(255, 255, 255, 0.1)',
    input: 'rgba(255, 255, 255, 0.15)',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#aaa',
    tertiary: '#777',
    inverse: '#1a1a2e',
  },

  // Border colors
  border: {
    primary: '#3C3C4E',
    secondary: 'rgba(255, 255, 255, 0.2)',
  },

  // Semantic colors
  coin: '#FFCC00',
  newRecord: '#34C759',
  achievement: '#FFCC00',
  premium: '#FFCC00',

  // Game colors
  game: {
    red: '#FF3B30',
    blue: '#007AFF',
    green: '#34C759',
    yellow: '#FFCC00',
  },
};

// Font sizes
export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 56,

  // Responsive font sizes
  responsiveTitle: Math.min(56, width * 0.14),
  responsiveSubtitle: Math.min(18, width * 0.045),
  responsiveHighScore: Math.min(48, width * 0.12),
  responsiveHighScoreLabel: Math.min(14, width * 0.035),
  responsivePlayButton: Math.min(24, width * 0.06),
  responsiveMenuButton: Math.min(16, width * 0.04),
  responsiveInstruction: Math.min(14, width * 0.035),
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
  xxxl: 60,
};

// Border radius
export const borderRadius = {
  sm: 10,
  base: 15,
  md: 20,
  lg: 25,
  xl: 30,
  round: 50,
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playButton: {
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
};

// Dimensions
export const dimensions = {
  width,
  height,

  // Responsive dimensions
  highScoreContainerMinWidth: Math.min(200, width * 0.5),
  playButtonPaddingX: Math.min(60, width * 0.15),
  menuButtonMaxWidth: Math.min(350, width * 0.9),
  instructionsMaxWidth: Math.min(350, width * 0.9),
};

// Z-index layers
export const zIndex = {
  base: 1,
  overlay: 5,
  modal: 10,
  header: 10,
  popup: 100,
};

// Opacity values
export const opacity = {
  disabled: 0.5,
  overlay: 0.7,
  subtle: 0.8,
};

export default {
  colors,
  fontSize,
  spacing,
  borderRadius,
  shadows,
  dimensions,
  zIndex,
  opacity,
};
