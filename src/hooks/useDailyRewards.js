import { useState, useCallback } from 'react';
import * as StorageService from '../services/storage';

/**
 * Custom hook for managing daily login, streaks, and daily tasks
 * Bu hook günlük giriş, streak ve günlük görevleri yönetir
 */
export const useDailyRewards = ({ onStreakAchievement }) => {
  const [dailyLoginStreak, setDailyLoginStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);

  // ===========================
  // Check Daily Login
  // ===========================

  const checkDailyLogin = useCallback(async () => {
    try {
      const today = new Date().toDateString();
      const lastLogin = await StorageService.getLastLoginDate();
      const streak = await StorageService.getDailyLoginStreak();

      if (lastLogin !== today) {
        // Yeni gün girişi
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = 1;
        if (lastLogin === yesterdayStr) {
          // Ardışık gün
          newStreak = streak + 1;
        }

        setDailyLoginStreak(newStreak);
        setLastLoginDate(today);
        setDailyRewardClaimed(false);

        await Promise.all([
          StorageService.setLastLoginDate(today),
          StorageService.setDailyLoginStreak(newStreak),
          StorageService.setDailyRewardClaimed(false),
        ]);

        // Günlük streak başarımlarını kontrol et
        if (onStreakAchievement) {
          onStreakAchievement(newStreak);
        }

        // Günlük görevleri oluştur
        await generateDailyTasks();

        return { isNewDay: true, streak: newStreak };
      } else {
        // Aynı gün
        setDailyLoginStreak(streak);
        setLastLoginDate(lastLogin);
        const claimed = await StorageService.getDailyRewardClaimed();
        setDailyRewardClaimed(claimed);
        await loadDailyTasks();

        return { isNewDay: false, streak };
      }
    } catch (error) {
      console.log('Günlük giriş kontrolü hatası:', error);
      return { isNewDay: false, streak: 0 };
    }
  }, [onStreakAchievement]);

  // ===========================
  // Generate Daily Tasks
  // ===========================

  const generateDailyTasks = useCallback(async () => {
    const tasks = [
      { id: 'play_5', title: '5 oyun oyna', target: 5, progress: 0, completed: false, reward: 50 },
      { id: 'score_25', title: '25 puan kazan (tek oyunda)', target: 25, progress: 0, completed: false, reward: 75 },
      { id: 'match_10', title: '10 doğru eşleşme yap', target: 10, progress: 0, completed: false, reward: 30 },
    ];
    setDailyTasks(tasks);
    await StorageService.setDailyTasks(tasks);
    return tasks;
  }, []);

  // ===========================
  // Load Daily Tasks
  // ===========================

  const loadDailyTasks = useCallback(async () => {
    try {
      const tasks = await StorageService.getDailyTasks();
      if (tasks && tasks.length > 0) {
        setDailyTasks(tasks);
      } else {
        await generateDailyTasks();
      }
    } catch (error) {
      console.log('Günlük görevler yüklenirken hata:', error);
      await generateDailyTasks();
    }
  }, [generateDailyTasks]);

  // ===========================
  // Update Daily Task
  // ===========================

  const updateDailyTask = useCallback(async (taskId, progress) => {
    const updatedTasks = dailyTasks.map(task => {
      if (task.id === taskId) {
        const newProgress = Math.min(progress, task.target);
        const completed = newProgress >= task.target;
        return { ...task, progress: newProgress, completed };
      }
      return task;
    });

    setDailyTasks(updatedTasks);
    await StorageService.setDailyTasks(updatedTasks);

    // Tamamlanan görev varsa return et
    const completedTask = updatedTasks.find(t => t.id === taskId && t.completed);
    return completedTask;
  }, [dailyTasks]);

  // ===========================
  // Claim Daily Reward
  // ===========================

  const claimDailyReward = useCallback(async () => {
    if (!dailyRewardClaimed) {
      setDailyRewardClaimed(true);
      await StorageService.setDailyRewardClaimed(true);

      // Streak'e göre ödül hesapla
      const baseReward = 10;
      const streakBonus = Math.min(dailyLoginStreak * 5, 50); // Max 50 bonus
      const totalReward = baseReward + streakBonus;

      return { success: true, reward: totalReward, streak: dailyLoginStreak };
    }
    return { success: false, reward: 0 };
  }, [dailyRewardClaimed, dailyLoginStreak]);

  // ===========================
  // Get Completed Tasks Count
  // ===========================

  const getCompletedTasksCount = useCallback(() => {
    return dailyTasks.filter(task => task.completed).length;
  }, [dailyTasks]);

  // ===========================
  // Get Total Tasks Reward
  // ===========================

  const getTotalTasksReward = useCallback(() => {
    return dailyTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + (task.reward || 0), 0);
  }, [dailyTasks]);

  // ===========================
  // Return
  // ===========================

  return {
    dailyLoginStreak,
    lastLoginDate,
    dailyRewardClaimed,
    dailyTasks,
    checkDailyLogin,
    generateDailyTasks,
    loadDailyTasks,
    updateDailyTask,
    claimDailyReward,
    getCompletedTasksCount,
    getTotalTasksReward,
  };
};
