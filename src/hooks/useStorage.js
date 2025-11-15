import { useState, useEffect, useCallback } from 'react';
import * as StorageService from '../services/storage';

/**
 * Custom hook for managing all storage-related state and operations
 * Bu hook tüm AsyncStorage operasyonlarını merkezi olarak yönetir
 */
export const useStorage = () => {
  // State
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedSkin, setSelectedSkin] = useState('default');
  const [ownedSkins, setOwnedSkins] = useState(['default']);
  const [powerupInventory, setPowerupInventory] = useState({
    slowmotion: 0,
    shield: 0,
    freeze: 0,
  });
  const [achievements, setAchievements] = useState([]);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalCorrectMatches, setTotalCorrectMatches] = useState(0);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // ===========================
  // Initial Load
  // ===========================

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        loadedHighScore,
        loadedCoins,
        loadedSkin,
        loadedOwnedSkins,
        loadedPowerups,
        loadedAchievements,
        loadedTutorial,
        loadedSound,
        loadedMusic,
        loadedHaptic,
        loadedGamesPlayed,
        loadedBestStreak,
        loadedCorrectMatches,
      ] = await Promise.all([
        StorageService.getHighScore(),
        StorageService.getCoins(),
        StorageService.getSelectedSkin(),
        StorageService.getOwnedSkins(),
        StorageService.getPowerupInventory(),
        StorageService.getAchievements(),
        StorageService.getHasSeenTutorial(),
        StorageService.getSoundEnabled(),
        StorageService.getMusicEnabled(),
        StorageService.getHapticEnabled(),
        StorageService.getTotalGamesPlayed(),
        StorageService.getBestStreak(),
        StorageService.getTotalCorrectMatches(),
      ]);

      setHighScore(loadedHighScore);
      setCoins(loadedCoins);
      setSelectedSkin(loadedSkin);
      setOwnedSkins(loadedOwnedSkins);
      setPowerupInventory(loadedPowerups);
      setAchievements(loadedAchievements);
      setHasSeenTutorial(loadedTutorial);
      setSoundEnabled(loadedSound);
      setMusicEnabled(loadedMusic);
      setHapticEnabled(loadedHaptic);
      setTotalGamesPlayed(loadedGamesPlayed);
      setBestStreak(loadedBestStreak);
      setTotalCorrectMatches(loadedCorrectMatches);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ===========================
  // High Score Operations
  // ===========================

  const saveHighScore = useCallback(async (newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      await StorageService.setHighScore(newScore);
      return true;
    }
    return false;
  }, [highScore]);

  // ===========================
  // Coins Operations
  // ===========================

  const addCoins = useCallback(async (amount) => {
    const newCoins = await StorageService.addCoins(amount);
    setCoins(newCoins);
    return newCoins;
  }, []);

  const subtractCoins = useCallback(async (amount) => {
    const currentCoins = coins;
    if (currentCoins >= amount) {
      const newCoins = await StorageService.subtractCoins(amount);
      setCoins(newCoins);
      return true;
    }
    return false;
  }, [coins]);

  const updateCoins = useCallback(async (newCoins) => {
    setCoins(newCoins);
    await StorageService.setCoins(newCoins);
  }, []);

  // ===========================
  // Skin Operations
  // ===========================

  const selectSkin = useCallback(async (skinId) => {
    setSelectedSkin(skinId);
    await StorageService.setSelectedSkin(skinId);
  }, []);

  const purchaseSkin = useCallback(async (skinId, price) => {
    if (coins >= price && !ownedSkins.includes(skinId)) {
      const newCoins = await StorageService.subtractCoins(price);
      setCoins(newCoins);

      const newOwnedSkins = [...ownedSkins, skinId];
      setOwnedSkins(newOwnedSkins);
      await StorageService.setOwnedSkins(newOwnedSkins);

      return true;
    }
    return false;
  }, [coins, ownedSkins]);

  const unlockSkin = useCallback(async (skinId) => {
    if (!ownedSkins.includes(skinId)) {
      const newOwnedSkins = [...ownedSkins, skinId];
      setOwnedSkins(newOwnedSkins);
      await StorageService.setOwnedSkins(newOwnedSkins);
    }
  }, [ownedSkins]);

  // ===========================
  // Power-up Operations
  // ===========================

  const purchasePowerup = useCallback(async (powerupId, price) => {
    if (coins >= price) {
      const newCoins = await StorageService.subtractCoins(price);
      setCoins(newCoins);

      const newInventory = {
        ...powerupInventory,
        [powerupId]: (powerupInventory[powerupId] || 0) + 1,
      };
      setPowerupInventory(newInventory);
      await StorageService.setPowerupInventory(newInventory);

      return true;
    }
    return false;
  }, [coins, powerupInventory]);

  const usePowerup = useCallback(async (powerupId) => {
    if (powerupInventory[powerupId] > 0) {
      const newInventory = {
        ...powerupInventory,
        [powerupId]: powerupInventory[powerupId] - 1,
      };
      setPowerupInventory(newInventory);
      await StorageService.setPowerupInventory(newInventory);
      return true;
    }
    return false;
  }, [powerupInventory]);

  const updatePowerupInventory = useCallback(async (newInventory) => {
    setPowerupInventory(newInventory);
    await StorageService.setPowerupInventory(newInventory);
  }, []);

  // ===========================
  // Achievement Operations
  // ===========================

  const unlockAchievement = useCallback(async (achievementId) => {
    if (!achievements.includes(achievementId)) {
      const newAchievements = [...achievements, achievementId];
      setAchievements(newAchievements);
      await StorageService.setAchievements(newAchievements);
      return true;
    }
    return false;
  }, [achievements]);

  // ===========================
  // Tutorial
  // ===========================

  const markTutorialAsSeen = useCallback(async () => {
    setHasSeenTutorial(true);
    await StorageService.setHasSeenTutorial(true);
  }, []);

  // ===========================
  // Settings
  // ===========================

  const toggleSound = useCallback(async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await StorageService.setSoundEnabled(newValue);
    return newValue;
  }, [soundEnabled]);

  const toggleMusic = useCallback(async () => {
    const newValue = !musicEnabled;
    setMusicEnabled(newValue);
    await StorageService.setMusicEnabled(newValue);
    return newValue;
  }, [musicEnabled]);

  const toggleHaptic = useCallback(async () => {
    const newValue = !hapticEnabled;
    setHapticEnabled(newValue);
    await StorageService.setHapticEnabled(newValue);
    return newValue;
  }, [hapticEnabled]);

  // ===========================
  // Stats
  // ===========================

  const incrementGamesPlayed = useCallback(async () => {
    const newCount = totalGamesPlayed + 1;
    setTotalGamesPlayed(newCount);
    await StorageService.setTotalGamesPlayed(newCount);
    return newCount;
  }, [totalGamesPlayed]);

  const updateBestStreak = useCallback(async (streak) => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      await StorageService.setBestStreak(streak);
      return true;
    }
    return false;
  }, [bestStreak]);

  const incrementCorrectMatches = useCallback(async () => {
    const newCount = totalCorrectMatches + 1;
    setTotalCorrectMatches(newCount);
    await StorageService.setTotalCorrectMatches(newCount);
    return newCount;
  }, [totalCorrectMatches]);

  // ===========================
  // Return
  // ===========================

  return {
    // State
    highScore,
    coins,
    selectedSkin,
    ownedSkins,
    powerupInventory,
    achievements,
    hasSeenTutorial,
    soundEnabled,
    musicEnabled,
    hapticEnabled,
    totalGamesPlayed,
    bestStreak,
    totalCorrectMatches,
    isLoading,

    // Operations
    loadAllData,
    saveHighScore,
    addCoins,
    subtractCoins,
    updateCoins,
    selectSkin,
    purchaseSkin,
    unlockSkin,
    purchasePowerup,
    usePowerup,
    updatePowerupInventory,
    unlockAchievement,
    markTutorialAsSeen,
    toggleSound,
    toggleMusic,
    toggleHaptic,
    incrementGamesPlayed,
    updateBestStreak,
    incrementCorrectMatches,
  };
};
