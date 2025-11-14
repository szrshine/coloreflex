// Monetization Module - Mock Implementation for Expo Go
// NOTE: react-native-google-mobile-ads requires native build (expo build or EAS)
// This is a mock implementation for development with Expo Go
import { Platform, View } from 'react-native';

// Mock Test Ad Unit IDs
const AD_UNIT_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  }),
  rewarded: Platform.select({
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
  }),
};

// Mock AdMob initialization
export const initializeAdMob = async () => {
  console.log('AdMob Mock: Initialized (Expo Go compatible)');
  return true;
};

// Mock Interstitial Ad
let interstitialLoaded = true; // Always ready in mock

export const loadInterstitialAd = async () => {
  console.log('AdMob Mock: Interstitial ad loaded');
  interstitialLoaded = true;
};

export const showInterstitialAd = async () => {
  console.log('AdMob Mock: Showing interstitial ad (mock)');
  return true;
};

export const isInterstitialReady = () => {
  return interstitialLoaded;
};

// Mock Rewarded Video Ad
let rewardedLoaded = true; // Always ready in mock

export const loadRewardedAd = async () => {
  console.log('AdMob Mock: Rewarded ad loaded');
  rewardedLoaded = true;
};

export const showRewardedAd = async (callback) => {
  console.log('AdMob Mock: Showing rewarded ad (mock)');
  // Simulate reward after 1 second
  setTimeout(() => {
    console.log('AdMob Mock: User earned reward');
    callback(true);
  }, 1000);
  return true;
};

export const isRewardedAdReady = () => {
  return rewardedLoaded;
};

// IAP Functions (Mock Implementation)
let availableProducts = [];
let purchasedProducts = [];

export const initializeIAP = async () => {
  console.log('IAP Mock: Initialized for Expo Go');

  // Mock products for development
  availableProducts = [
    { productId: 'com.szrgame.colordrop.removeads', title: 'Remove Ads', price: '$2.99' },
    { productId: 'com.szrgame.colordrop.premiumskins', title: 'Premium Skins', price: '$1.99' },
    { productId: 'com.szrgame.colordrop.coins100', title: '100 Coins', price: '$0.99' },
    { productId: 'com.szrgame.colordrop.coins600', title: '600 Coins', price: '$4.99' },
    { productId: 'com.szrgame.colordrop.coins1500', title: '1500 Coins', price: '$9.99' },
  ];

  return null;
};

export const loadProducts = async () => {
  return availableProducts;
};

export const purchaseProduct = async (productId) => {
  console.log('IAP Mock: Simulating purchase for', productId);
  return new Promise((resolve) => {
    setTimeout(() => {
      purchasedProducts.push(productId);
      resolve({ productId });
    }, 1000);
  });
};

export const restorePurchases = async () => {
  console.log('IAP Mock: Restoring purchases');
  return purchasedProducts;
};

export const hasPurchased = (productId) => {
  return purchasedProducts.includes(productId);
};

export const getAvailableProducts = () => {
  return availableProducts;
};

export const hasRemovedAds = () => {
  return hasPurchased('com.szrgame.colordrop.removeads');
};

export const hasPremiumSkins = () => {
  return hasPurchased('com.szrgame.colordrop.premiumskins');
};

// IAP Product IDs
export const IAP_PRODUCT_IDS = {
  removeAds: 'com.szrgame.colordrop.removeads',
  premiumSkins: 'com.szrgame.colordrop.premiumskins',
  powerUpPack: 'com.szrgame.colordrop.poweruppack',
  coinPackSmall: 'com.szrgame.colordrop.coins100',
  coinPackMedium: 'com.szrgame.colordrop.coins600',
  coinPackLarge: 'com.szrgame.colordrop.coins1500',
};

// Mock Banner Ad Component - Just returns an empty View
export const AdMobBanner = () => {
  return View;
};

// Mock BannerAdSize
export const BannerAdSize = {
  BANNER: 'banner',
  LARGE_BANNER: 'largeBanner',
  MEDIUM_RECTANGLE: 'mediumRectangle',
  FULL_BANNER: 'fullBanner',
  LEADERBOARD: 'leaderboard',
};

export { AD_UNIT_IDS };
