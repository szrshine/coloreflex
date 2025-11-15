import { useState, useCallback } from 'react';
import { ACHIEVEMENTS_LIST } from '../constants/achievements';
import * as StorageService from '../services/storage';

/**
 * Custom hook for managing achievements
 * Bu hook başarım kontrolü, kilidi açma ve bildirim işlemlerini yönetir
 */
export const useAchievements = ({ onAchievementUnlocked }) => {
  const [achievementStates, setAchievementStates] = useState({});
  const [sessionAchievements, setSessionAchievements] = useState([]);

  // ===========================
  // Load Achievements
  // ===========================

  const loadAchievements = useCallback(async () => {
    try {
      const savedAchievements = await StorageService.getAchievements();

      // Array ise object'e çevir (eski format desteği)
      let achievementsObj = {};
      if (Array.isArray(savedAchievements)) {
        // Eski format: sadece ID listesi
        savedAchievements.forEach(id => {
          achievementsObj[id] = { unlocked: true, progress: 100 };
        });
      } else {
        achievementsObj = savedAchievements || {};
      }

      setAchievementStates(achievementsObj);
    } catch (error) {
      console.log('❌ Başarımlar yüklenirken hata:', error);
    }
  }, []);

  // ===========================
  // Check and Unlock Achievement
  // ===========================

  const checkAndUnlockAchievement = useCallback(async (achievementId, currentProgress) => {
    console.log('🎯 checkAndUnlockAchievement çağrıldı:', achievementId, 'Progress:', currentProgress);

    const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
    if (!achievement) {
      console.log('❌ Başarım bulunamadı:', achievementId);
      return;
    }

    console.log('✅ Başarım bulundu:', achievement.title, 'Gereksinim:', achievement.requirement);

    // AsyncStorage'dan güncel veriyi oku (race condition önlemek için)
    const savedAchievements = await StorageService.getAchievements();
    const currentAchievements = Array.isArray(savedAchievements)
      ? savedAchievements.reduce((acc, id) => ({ ...acc, [id]: { unlocked: true, progress: 100 } }), {})
      : savedAchievements || {};

    const currentState = currentAchievements[achievementId];
    console.log('📊 Mevcut durum:', currentState);

    if (currentState && currentState.unlocked) {
      console.log('⏭️ Zaten açılmış, atlanıyor');
      return; // Zaten açılmış
    }

    const newProgress = Math.min(currentProgress, achievement.requirement);
    const unlocked = newProgress >= achievement.requirement;

    console.log('📈 Progress:', newProgress, 'Unlocked:', unlocked);

    const updatedAchievements = {
      ...currentAchievements,
      [achievementId]: { unlocked, progress: newProgress }
    };

    setAchievementStates(updatedAchievements);
    await StorageService.setAchievements(updatedAchievements);

    if (unlocked && (!currentState || !currentState.unlocked)) {
      // Yeni başarım açıldı!
      console.log('🎉 YENİ BAŞARIM AÇILDI:', achievement.title);

      // Session achievements'a ekle
      setSessionAchievements(prev => {
        const alreadyAdded = prev.find(a => a.id === achievement.id);
        if (alreadyAdded) return prev;
        return [...prev, achievement];
      });

      // Callback çağır (ses, haptic, bildirim için)
      if (onAchievementUnlocked) {
        onAchievementUnlocked(achievement);
      }

      return achievement;
    }
  }, [onAchievementUnlocked]);

  // ===========================
  // Check Multiple Achievements
  // ===========================

  const checkAchievements = useCallback(async (checks) => {
    // checks: [{ id: 'first_game', progress: 1 }, { id: 'beginner', progress: 10 }, ...]
    const unlockedAchievements = [];

    for (const check of checks) {
      const result = await checkAndUnlockAchievement(check.id, check.progress);
      if (result) {
        unlockedAchievements.push(result);
      }
    }

    return unlockedAchievements;
  }, [checkAndUnlockAchievement]);

  // ===========================
  // Get Achievement State
  // ===========================

  const getAchievementState = useCallback((achievementId) => {
    const state = achievementStates[achievementId];
    if (!state) {
      return { unlocked: false, progress: 0 };
    }
    return state;
  }, [achievementStates]);

  // ===========================
  // Get All Achievement States (for display)
  // ===========================

  const getAllAchievementStates = useCallback(() => {
    return ACHIEVEMENTS_LIST.map(achievement => ({
      ...achievement,
      ...getAchievementState(achievement.id)
    }));
  }, [getAchievementState]);

  // ===========================
  // Clear Session Achievements
  // ===========================

  const clearSessionAchievements = useCallback(() => {
    setSessionAchievements([]);
  }, []);

  // ===========================
  // Return
  // ===========================

  return {
    achievementStates,
    sessionAchievements,
    loadAchievements,
    checkAndUnlockAchievement,
    checkAchievements,
    getAchievementState,
    getAllAchievementStates,
    clearSessionAchievements,
  };
};
