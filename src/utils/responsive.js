// Responsive Design Utilities
// Farklı ekran boyutları için responsive değerler sağlar

import { Dimensions, Platform, StatusBar } from 'react-native';

// Ekran boyutlarını al
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Ekran kategorileri
export const SCREEN_SIZES = {
  SMALL: 'small',      // iPhone SE, küçük Android'ler
  MEDIUM: 'medium',    // iPhone 13, standart telefonlar
  LARGE: 'large',      // iPhone 14 Plus, büyük telefonlar
  XLARGE: 'xlarge',    // Tabletler
};

/**
 * Ekran boyutuna göre kategori döndür
 * @returns {string} Screen size category
 */
export const getScreenSize = () => {
  const { width, height } = getScreenDimensions();
  const smallerDimension = Math.min(width, height);

  if (smallerDimension < 350) {
    return SCREEN_SIZES.SMALL;
  } else if (smallerDimension < 400) {
    return SCREEN_SIZES.MEDIUM;
  } else if (smallerDimension < 600) {
    return SCREEN_SIZES.LARGE;
  } else {
    return SCREEN_SIZES.XLARGE;
  }
};

/**
 * Ekran genişliğine göre ölçekleme
 * @param {number} size - Base size
 * @returns {number} Scaled size
 */
export const scaleWidth = (size) => {
  const { width } = getScreenDimensions();
  const baseWidth = 375; // iPhone X/11/12/13 base width
  return (width / baseWidth) * size;
};

/**
 * Ekran yüksekliğine göre ölçekleme
 * @param {number} size - Base size
 * @returns {number} Scaled size
 */
export const scaleHeight = (size) => {
  const { height } = getScreenDimensions();
  const baseHeight = 812; // iPhone X/11/12/13 base height
  return (height / baseHeight) * size;
};

/**
 * Moderate scale - Çok agresif olmayan ölçekleme
 * @param {number} size - Base size
 * @param {number} factor - Scale factor (0-1, default 0.5)
 * @returns {number} Scaled size
 */
export const moderateScale = (size, factor = 0.5) => {
  const { width } = getScreenDimensions();
  const baseWidth = 375;
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Font size için responsive ölçekleme
 * @param {number} size - Base font size
 * @returns {number} Scaled font size
 */
export const scaleFontSize = (size) => {
  return moderateScale(size, 0.3); // Font'lar için daha az agresif
};

/**
 * Safe area insets hesapla (notch, status bar için)
 * @returns {object} Insets object
 */
export const getSafeAreaInsets = () => {
  const { height, width } = getScreenDimensions();

  // iPhone X ve sonrası için notch var
  const hasNotch = Platform.OS === 'ios' && height >= 812;

  return {
    top: hasNotch ? 44 : StatusBar.currentHeight || 20,
    bottom: hasNotch ? 34 : 0,
    left: 0,
    right: 0,
  };
};

/**
 * Aspect ratio hesapla
 * @returns {number} Screen aspect ratio
 */
export const getAspectRatio = () => {
  const { width, height } = getScreenDimensions();
  return height / width;
};

/**
 * Ekran orientation (yatay/dikey)
 * @returns {string} 'portrait' | 'landscape'
 */
export const getOrientation = () => {
  const { width, height } = getScreenDimensions();
  return height > width ? 'portrait' : 'landscape';
};

/**
 * Tablet olup olmadığını kontrol et
 * @returns {boolean}
 */
export const isTablet = () => {
  const { width, height } = getScreenDimensions();
  const smallerDimension = Math.min(width, height);
  return smallerDimension >= 600;
};

/**
 * Küçük ekran olup olmadığını kontrol et
 * @returns {boolean}
 */
export const isSmallScreen = () => {
  return getScreenSize() === SCREEN_SIZES.SMALL;
};

/**
 * Ekran boyutuna göre değer döndür
 * @param {object} values - { small, medium, large, xlarge }
 * @returns {any} Ekran boyutuna uygun değer
 */
export const responsiveValue = (values) => {
  const screenSize = getScreenSize();
  return values[screenSize] || values.medium || values.small;
};

/**
 * Platform-specific değer döndür
 * @param {object} values - { ios, android, default }
 * @returns {any}
 */
export const platformValue = (values) => {
  if (Platform.OS === 'ios' && values.ios !== undefined) {
    return values.ios;
  }
  if (Platform.OS === 'android' && values.android !== undefined) {
    return values.android;
  }
  return values.default;
};

/**
 * Oyun alanı için güvenli boyutları hesapla
 * @returns {object} { width, height, safeTop, safeBottom }
 */
export const getGameAreaDimensions = () => {
  const { width, height } = getScreenDimensions();
  const insets = getSafeAreaInsets();

  return {
    width,
    height,
    safeTop: insets.top,
    safeBottom: insets.bottom,
    usableHeight: height - insets.top - insets.bottom,
  };
};

/**
 * Banner reklam yüksekliğini hesapla
 * @returns {number} Banner height
 */
export const getBannerHeight = () => {
  const screenSize = getScreenSize();

  // Tablet'lerde daha büyük banner
  if (screenSize === SCREEN_SIZES.XLARGE) {
    return 90; // Tablet banner (tablet için 728x90)
  }

  // Standart banner (320x50)
  return 50;
};

/**
 * Dinamik padding değerleri
 */
export const padding = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
};

/**
 * Dinamik margin değerleri
 */
export const margin = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
};

/**
 * Dinamik font boyutları
 */
export const fontSize = {
  xs: scaleFontSize(12),
  sm: scaleFontSize(14),
  md: scaleFontSize(16),
  lg: scaleFontSize(20),
  xl: scaleFontSize(24),
  xxl: scaleFontSize(32),
  xxxl: scaleFontSize(48),
};

/**
 * Responsive style oluşturucu
 * @param {object} baseStyles - Base styles
 * @returns {object} Responsive styles
 */
export const createResponsiveStyle = (baseStyles) => {
  const screenSize = getScreenSize();

  // Ekran boyutuna göre özel stiller varsa uygula
  const screenSpecificStyles = baseStyles[screenSize] || {};

  // Base stilleri ve ekran-specific stilleri birleştir
  return {
    ...baseStyles,
    ...screenSpecificStyles,
  };
};

export default {
  getScreenDimensions,
  getScreenSize,
  scaleWidth,
  scaleHeight,
  moderateScale,
  scaleFontSize,
  getSafeAreaInsets,
  getAspectRatio,
  getOrientation,
  isTablet,
  isSmallScreen,
  responsiveValue,
  platformValue,
  getGameAreaDimensions,
  getBannerHeight,
  padding,
  margin,
  fontSize,
  createResponsiveStyle,
  SCREEN_SIZES,
};
