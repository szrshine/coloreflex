import { useState, useCallback } from 'react';
import * as StorageService from '../services/storage';

/**
 * Custom hook for managing game statistics
 * Bu hook oyun istatistiklerini yönetir
 */
export const useGameStats = () => {
  const [stats, setStats] = useState({
    totalGamesPlayed: 0,
    bestStreak: 0,
    totalCorrectMatches: 0,
    highScore: 0,
  });

  // ===========================
  // Load Stats
  // ===========================

  const loadStats = useCallback(async () => {
    try {
      const [gamesPlayed, bestStreak, correctMatches, highScore] = await Promise.all([
        StorageService.getTotalGamesPlayed(),
        StorageService.getBestStreak(),
        StorageService.getTotalCorrectMatches(),
        StorageService.getHighScore(),
      ]);

      setStats({
        totalGamesPlayed: gamesPlayed,
        bestStreak: bestStreak,
        totalCorrectMatches: correctMatches,
        highScore: highScore,
      });
    } catch (error) {
      console.log('❌ İstatistikler yüklenirken hata:', error);
    }
  }, []);

  // ===========================
  // Save Stats
  // ===========================

  const saveStats = useCallback(async () => {
    try {
      await Promise.all([
        StorageService.setTotalGamesPlayed(stats.totalGamesPlayed),
        StorageService.setBestStreak(stats.bestStreak),
        StorageService.setTotalCorrectMatches(stats.totalCorrectMatches),
        StorageService.setHighScore(stats.highScore),
      ]);
    } catch (error) {
      console.log('❌ İstatistikler kaydedilirken hata:', error);
    }
  }, [stats]);

  // ===========================
  // Update Individual Stats
  // ===========================

  const incrementGamesPlayed = useCallback(async () => {
    const newCount = stats.totalGamesPlayed + 1;
    setStats(prev => ({ ...prev, totalGamesPlayed: newCount }));
    await StorageService.setTotalGamesPlayed(newCount);
    return newCount;
  }, [stats.totalGamesPlayed]);

  const updateBestStreak = useCallback(async (streak) => {
    if (streak > stats.bestStreak) {
      setStats(prev => ({ ...prev, bestStreak: streak }));
      await StorageService.setBestStreak(streak);
      return true;
    }
    return false;
  }, [stats.bestStreak]);

  const incrementCorrectMatches = useCallback(async () => {
    const newCount = stats.totalCorrectMatches + 1;
    setStats(prev => ({ ...prev, totalCorrectMatches: newCount }));
    await StorageService.setTotalCorrectMatches(newCount);
    return newCount;
  }, [stats.totalCorrectMatches]);

  const updateHighScore = useCallback(async (score) => {
    if (score > stats.highScore) {
      setStats(prev => ({ ...prev, highScore: score }));
      await StorageService.setHighScore(score);
      return true;
    }
    return false;
  }, [stats.highScore]);

  // ===========================
  // Return
  // ===========================

  return {
    stats,
    loadStats,
    saveStats,
    incrementGamesPlayed,
    updateBestStreak,
    incrementCorrectMatches,
    updateHighScore,
  };
};
