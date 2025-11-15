import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';

// ===========================
// Generic Storage Functions
// ===========================

/**
 * Veriyi storage'a kaydet
 * @param {string} key - Storage key
 * @param {any} value - Kaydedilecek değer
 */
export const saveData = async (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
    throw error;
  }
};

/**
 * Veriyi storage'dan oku
 * @param {string} key - Storage key
 * @param {any} defaultValue - Bulunamazsa döndürülecek varsayılan değer
 * @returns {Promise<any>} Kaydedilmiş değer veya default value
 */
export const loadData = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return defaultValue;
    }

    // JSON parse dene, başarısız olursa string olarak dön
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Veriyi storage'dan sil
 * @param {string} key - Storage key
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
    throw error;
  }
};

/**
 * Tüm storage'ı temizle (dikkatli kullan!)
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all storage:', error);
    throw error;
  }
};

// ===========================
// Type-Safe Wrappers
// ===========================

// Tutorial
export const getHasSeenTutorial = async () => {
  const value = await loadData(STORAGE_KEYS.HAS_SEEN_TUTORIAL);
  return value === 'true';
};

export const setHasSeenTutorial = async (value) => {
  await saveData(STORAGE_KEYS.HAS_SEEN_TUTORIAL, value ? 'true' : 'false');
};

// High Score
export const getHighScore = async () => {
  const value = await loadData(STORAGE_KEYS.HIGH_SCORE, '0');
  return parseInt(value, 10);
};

export const setHighScore = async (score) => {
  await saveData(STORAGE_KEYS.HIGH_SCORE, score.toString());
};

// Coins
export const getCoins = async () => {
  const value = await loadData(STORAGE_KEYS.COINS, '0');
  return parseInt(value, 10);
};

export const setCoins = async (coins) => {
  await saveData(STORAGE_KEYS.COINS, coins.toString());
};

export const addCoins = async (amount) => {
  const currentCoins = await getCoins();
  const newCoins = currentCoins + amount;
  await setCoins(newCoins);
  return newCoins;
};

export const subtractCoins = async (amount) => {
  const currentCoins = await getCoins();
  const newCoins = Math.max(0, currentCoins - amount);
  await setCoins(newCoins);
  return newCoins;
};

// Total Correct Matches
export const getTotalCorrectMatches = async () => {
  const value = await loadData(STORAGE_KEYS.TOTAL_CORRECT_MATCHES, '0');
  return parseInt(value, 10);
};

export const setTotalCorrectMatches = async (count) => {
  await saveData(STORAGE_KEYS.TOTAL_CORRECT_MATCHES, count.toString());
};

// Skins
export const getSelectedSkin = async () => {
  return await loadData(STORAGE_KEYS.SELECTED_SKIN, 'default');
};

export const setSelectedSkin = async (skinId) => {
  await saveData(STORAGE_KEYS.SELECTED_SKIN, skinId);
};

export const getOwnedSkins = async () => {
  return await loadData(STORAGE_KEYS.OWNED_SKINS, ['default']);
};

export const setOwnedSkins = async (skins) => {
  await saveData(STORAGE_KEYS.OWNED_SKINS, skins);
};

// Power-up Inventory
export const getPowerupInventory = async () => {
  return await loadData(STORAGE_KEYS.POWERUP_INVENTORY, {
    slowmotion: 0,
    shield: 0,
    freeze: 0,
  });
};

export const setPowerupInventory = async (inventory) => {
  await saveData(STORAGE_KEYS.POWERUP_INVENTORY, inventory);
};

// Achievements
export const getAchievements = async () => {
  return await loadData(STORAGE_KEYS.ACHIEVEMENTS, []);
};

export const setAchievements = async (achievements) => {
  await saveData(STORAGE_KEYS.ACHIEVEMENTS, achievements);
};

// Daily Login
export const getLastLoginDate = async () => {
  return await loadData(STORAGE_KEYS.LAST_LOGIN_DATE);
};

export const setLastLoginDate = async (date) => {
  await saveData(STORAGE_KEYS.LAST_LOGIN_DATE, date);
};

export const getDailyLoginStreak = async () => {
  const value = await loadData(STORAGE_KEYS.DAILY_LOGIN_STREAK, '0');
  return parseInt(value, 10);
};

export const setDailyLoginStreak = async (streak) => {
  await saveData(STORAGE_KEYS.DAILY_LOGIN_STREAK, streak.toString());
};

// Daily Reward Claimed
export const getDailyRewardClaimed = async () => {
  const value = await loadData(STORAGE_KEYS.DAILY_REWARD_CLAIMED);
  return value === 'true';
};

export const setDailyRewardClaimed = async (value) => {
  await saveData(STORAGE_KEYS.DAILY_REWARD_CLAIMED, value ? 'true' : 'false');
};

// Daily Tasks
export const getDailyTasks = async () => {
  return await loadData(STORAGE_KEYS.DAILY_TASKS, []);
};

export const setDailyTasks = async (tasks) => {
  await saveData(STORAGE_KEYS.DAILY_TASKS, tasks);
};

// Settings
export const getSoundEnabled = async () => {
  const value = await loadData(STORAGE_KEYS.SOUND_ENABLED, 'true');
  return value === 'true';
};

export const setSoundEnabled = async (enabled) => {
  await saveData(STORAGE_KEYS.SOUND_ENABLED, enabled ? 'true' : 'false');
};

export const getMusicEnabled = async () => {
  const value = await loadData(STORAGE_KEYS.MUSIC_ENABLED, 'true');
  return value === 'true';
};

export const setMusicEnabled = async (enabled) => {
  await saveData(STORAGE_KEYS.MUSIC_ENABLED, enabled ? 'true' : 'false');
};

export const getHapticEnabled = async () => {
  const value = await loadData(STORAGE_KEYS.HAPTIC_ENABLED, 'true');
  return value === 'true';
};

export const setHapticEnabled = async (enabled) => {
  await saveData(STORAGE_KEYS.HAPTIC_ENABLED, enabled ? 'true' : 'false');
};

// Stats
export const getTotalGamesPlayed = async () => {
  const value = await loadData(STORAGE_KEYS.TOTAL_GAMES_PLAYED, '0');
  return parseInt(value, 10);
};

export const setTotalGamesPlayed = async (count) => {
  await saveData(STORAGE_KEYS.TOTAL_GAMES_PLAYED, count.toString());
};

export const getBestStreak = async () => {
  const value = await loadData(STORAGE_KEYS.BEST_STREAK, '0');
  return parseInt(value, 10);
};

export const setBestStreak = async (streak) => {
  await saveData(STORAGE_KEYS.BEST_STREAK, streak.toString());
};
