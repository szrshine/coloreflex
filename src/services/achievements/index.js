import { ACHIEVEMENTS_LIST } from '../../constants/achievements';

/**
 * Achievement servisi
 * Bu servis başarım kontrolü ve progress tracking için helper fonksiyonlar sağlar
 */

/**
 * Başarım gereksinimini kontrol et
 * @param {string} achievementId - Başarım ID'si
 * @param {number} currentValue - Mevcut değer
 * @returns {Object} { achievement, isUnlocked, progress, requirement }
 */
export const checkAchievementRequirement = (achievementId, currentValue) => {
  const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);

  if (!achievement) {
    console.warn(`Achievement not found: ${achievementId}`);
    return null;
  }

  const progress = Math.min(currentValue, achievement.requirement);
  const isUnlocked = progress >= achievement.requirement;

  return {
    achievement,
    isUnlocked,
    progress,
    requirement: achievement.requirement,
    percentage: Math.round((progress / achievement.requirement) * 100),
  };
};

/**
 * Skorla ilgili başarımları kontrol et
 * @param {number} score - Oyuncu skoru
 * @returns {Array} Kontrol edilmesi gereken başarımlar
 */
export const checkScoreAchievements = (score) => {
  const scoreAchievements = ACHIEVEMENTS_LIST.filter(a => a.type === 'score');
  const toCheck = [];

  scoreAchievements.forEach(achievement => {
    if (score >= achievement.requirement) {
      toCheck.push({
        id: achievement.id,
        progress: score,
      });
    }
  });

  return toCheck;
};

/**
 * Streak başarımlarını kontrol et
 * @param {number} streak - Ardışık doğru eşleşme sayısı
 * @returns {Array} Kontrol edilmesi gereken başarımlar
 */
export const checkStreakAchievements = (streak) => {
  const streakAchievements = ACHIEVEMENTS_LIST.filter(a => a.type === 'streak');
  const toCheck = [];

  streakAchievements.forEach(achievement => {
    if (streak >= achievement.requirement) {
      toCheck.push({
        id: achievement.id,
        progress: streak,
      });
    }
  });

  return toCheck;
};

/**
 * Oyun sayısı başarımlarını kontrol et
 * @param {number} gamesPlayed - Toplam oynanan oyun
 * @returns {Array} Kontrol edilmesi gereken başarımlar
 */
export const checkGamesPlayedAchievements = (gamesPlayed) => {
  const gamesAchievements = ACHIEVEMENTS_LIST.filter(a => a.type === 'games');
  const toCheck = [];

  gamesAchievements.forEach(achievement => {
    if (gamesPlayed >= achievement.requirement) {
      toCheck.push({
        id: achievement.id,
        progress: gamesPlayed,
      });
    }
  });

  return toCheck;
};

/**
 * Günlük giriş streak başarımlarını kontrol et
 * @param {number} dailyStreak - Günlük giriş streak
 * @returns {Array} Kontrol edilmesi gereken başarımlar
 */
export const checkDailyStreakAchievements = (dailyStreak) => {
  const dailyAchievements = ACHIEVEMENTS_LIST.filter(a => a.type === 'daily_streak');
  const toCheck = [];

  dailyAchievements.forEach(achievement => {
    if (dailyStreak >= achievement.requirement) {
      toCheck.push({
        id: achievement.id,
        progress: dailyStreak,
      });
    }
  });

  return toCheck;
};

/**
 * Hız başarımlarını kontrol et
 * @param {number} speedMatches - Maksimum hızda yapılan eşleşme sayısı
 * @param {number} currentSpeed - Mevcut oyun hızı
 * @param {number} maxSpeed - Maksimum oyun hızı
 * @returns {Array} Kontrol edilmesi gereken başarımlar
 */
export const checkSpeedAchievements = (speedMatches, currentSpeed, maxSpeed) => {
  const speedAchievements = ACHIEVEMENTS_LIST.filter(a => a.type === 'speed');
  const toCheck = [];

  // Sadece maksimum hızda ise
  if (currentSpeed >= maxSpeed) {
    speedAchievements.forEach(achievement => {
      if (speedMatches >= achievement.requirement) {
        toCheck.push({
          id: achievement.id,
          progress: speedMatches,
        });
      }
    });
  }

  return toCheck;
};

/**
 * Tüm başarımların toplam progress'ini hesapla
 * @param {Object} achievementStates - Başarım state'leri
 * @returns {Object} { total, unlocked, percentage }
 */
export const calculateOverallProgress = (achievementStates) => {
  const total = ACHIEVEMENTS_LIST.length;
  const unlocked = Object.values(achievementStates).filter(state => state.unlocked).length;
  const percentage = Math.round((unlocked / total) * 100);

  return {
    total,
    unlocked,
    locked: total - unlocked,
    percentage,
  };
};

/**
 * Başarımları kategorilere göre grupla
 * @returns {Object} Kategorize edilmiş başarımlar
 */
export const getAchievementsByCategory = () => {
  const categories = {};

  ACHIEVEMENTS_LIST.forEach(achievement => {
    if (!categories[achievement.type]) {
      categories[achievement.type] = [];
    }
    categories[achievement.type].push(achievement);
  });

  return categories;
};

/**
 * Başarım kategorisinin display name'ini al
 * @param {string} type - Başarım tipi
 * @returns {string} Display name
 */
export const getAchievementCategoryName = (type) => {
  const categoryNames = {
    games: 'Oyun',
    score: 'Skor',
    streak: 'Seri',
    daily_streak: 'Günlük Giriş',
    speed: 'Hız',
  };

  return categoryNames[type] || type;
};

/**
 * Sonraki kilidi açılacak başarımı bul
 * @param {Object} achievementStates - Başarım state'leri
 * @param {string} type - Başarım tipi (opsiyonel)
 * @returns {Object|null} Sonraki başarım
 */
export const getNextAchievementToUnlock = (achievementStates, type = null) => {
  let achievements = ACHIEVEMENTS_LIST;

  if (type) {
    achievements = achievements.filter(a => a.type === type);
  }

  // Henüz açılmamış başarımları bul
  const locked = achievements.filter(a => {
    const state = achievementStates[a.id];
    return !state || !state.unlocked;
  });

  // En düşük requirement'a sahip olanı seç
  if (locked.length === 0) return null;

  return locked.reduce((lowest, current) =>
    current.requirement < lowest.requirement ? current : lowest
  );
};
