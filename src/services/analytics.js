// Analytics Service - Firebase Analytics Integration
// Bu dosya kullanıcı davranışlarını ve metrikleri takip eder

/**
 * PRODUCTION İÇİN KURULUM:
 *
 * 1. Firebase Console'da proje oluştur: https://console.firebase.google.com/
 * 2. Android ve iOS uygulamaları ekle
 * 3. Paketleri yükle:
 *    npm install @react-native-firebase/app @react-native-firebase/analytics
 *
 * 4. Config dosyalarını ekle:
 *    - google-services.json (android/app/ klasörüne)
 *    - GoogleService-Info.plist (ios/ klasörüne)
 *
 * 5. Bu dosyadaki yorumları kaldır
 */

// import analytics from '@react-native-firebase/analytics';

// Development modunda mı?
const __DEV__ = process.env.NODE_ENV !== 'production';

// Mock analytics fonksiyonları (development için)
const mockAnalytics = {
  logEvent: (eventName, params) => {
    console.log(`[Analytics] Event: ${eventName}`, params);
  },
  setUserProperty: (name, value) => {
    console.log(`[Analytics] User Property: ${name} = ${value}`);
  },
  setUserId: (userId) => {
    console.log(`[Analytics] User ID: ${userId}`);
  },
};

/**
 * Analytics'i başlat
 */
export const initializeAnalytics = async () => {
  if (__DEV__) {
    console.log('[Analytics] Development modunda - Mock analytics kullanılıyor');
    return;
  }

  // Production'da Firebase Analytics otomatik başlar
  console.log('[Analytics] Firebase Analytics aktif');
};

/**
 * Event logla
 * @param {string} eventName - Event adı
 * @param {object} params - Event parametreleri
 */
export const logEvent = async (eventName, params = {}) => {
  if (__DEV__) {
    mockAnalytics.logEvent(eventName, params);
    return;
  }

  // await analytics().logEvent(eventName, params);
};

/**
 * Kullanıcı özelliği ayarla
 * @param {string} name - Özellik adı
 * @param {string} value - Özellik değeri
 */
export const setUserProperty = async (name, value) => {
  if (__DEV__) {
    mockAnalytics.setUserProperty(name, value);
    return;
  }

  // await analytics().setUserProperty(name, value);
};

/**
 * Kullanıcı ID ayarla
 * @param {string} userId - Kullanıcı ID
 */
export const setUserId = async (userId) => {
  if (__DEV__) {
    mockAnalytics.setUserId(userId);
    return;
  }

  // await analytics().setUserId(userId);
};

// ========================================
// Oyun Spesifik Analytics Event'leri
// ========================================

/**
 * Uygulama açılış event'i
 */
export const logAppOpen = () => {
  logEvent('app_open', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Oyun başlangıç event'i
 */
export const logGameStart = () => {
  logEvent('game_start', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Oyun bitiş event'i
 * @param {number} score - Final skoru
 * @param {number} duration - Oyun süresi (saniye)
 * @param {number} correctMatches - Doğru eşleşme sayısı
 * @param {number} wrongMatches - Yanlış eşleşme sayısı
 */
export const logGameOver = (score, duration, correctMatches, wrongMatches) => {
  logEvent('game_over', {
    score,
    duration_seconds: duration,
    correct_matches: correctMatches,
    wrong_matches: wrongMatches,
    accuracy: correctMatches / (correctMatches + wrongMatches) || 0,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Başarım kilidi açma event'i
 * @param {string} achievementId - Başarım ID
 * @param {string} achievementName - Başarım adı
 */
export const logAchievementUnlocked = (achievementId, achievementName) => {
  logEvent('achievement_unlocked', {
    achievement_id: achievementId,
    achievement_name: achievementName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Reklam görüntülenme event'i
 * @param {string} adType - Reklam tipi (banner, interstitial, rewarded)
 * @param {string} placement - Reklam yeri
 */
export const logAdImpression = (adType, placement = '') => {
  logEvent('ad_impression', {
    ad_type: adType,
    placement,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Reklam tıklama event'i
 * @param {string} adType - Reklam tipi
 */
export const logAdClick = (adType) => {
  logEvent('ad_click', {
    ad_type: adType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Satın alma event'i
 * @param {string} productId - Ürün ID
 * @param {string} productName - Ürün adı
 * @param {number} value - Fiyat
 * @param {string} currency - Para birimi
 */
export const logPurchase = (productId, productName, value, currency = 'USD') => {
  logEvent('purchase', {
    product_id: productId,
    product_name: productName,
    value,
    currency,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Tutorial tamamlama event'i
 */
export const logTutorialComplete = () => {
  logEvent('tutorial_complete', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Paylaşım event'i
 * @param {string} contentType - Paylaşılan içerik tipi
 * @param {string} method - Paylaşım yöntemi (whatsapp, twitter, etc.)
 */
export const logShare = (contentType, method = '') => {
  logEvent('share', {
    content_type: contentType,
    method,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Ayar değişimi event'i
 * @param {string} settingName - Ayar adı
 * @param {any} value - Yeni değer
 */
export const logSettingsChange = (settingName, value) => {
  logEvent('settings_change', {
    setting_name: settingName,
    value: String(value),
    timestamp: new Date().toISOString(),
  });
};

/**
 * Ekran görüntüleme event'i
 * @param {string} screenName - Ekran adı
 */
export const logScreenView = (screenName) => {
  logEvent('screen_view', {
    screen_name: screenName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Liderlik tablosu görüntüleme
 * @param {string} period - Periyod (daily, weekly, monthly, all)
 */
export const logLeaderboardView = (period) => {
  logEvent('leaderboard_view', {
    period,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Power-up kullanımı
 * @param {string} powerupId - Power-up ID
 * @param {string} powerupName - Power-up adı
 */
export const logPowerupUsed = (powerupId, powerupName) => {
  logEvent('powerup_used', {
    powerup_id: powerupId,
    powerup_name: powerupName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Coin kazanma
 * @param {number} amount - Kazanılan miktar
 * @param {string} source - Kaynak (game, daily_reward, video_ad, etc.)
 */
export const logCoinsEarned = (amount, source) => {
  logEvent('coins_earned', {
    amount,
    source,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Coin harcama
 * @param {number} amount - Harcanan miktar
 * @param {string} purpose - Amaç (skin, powerup, continue, etc.)
 */
export const logCoinsSpent = (amount, purpose) => {
  logEvent('coins_spent', {
    amount,
    purpose,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Günlük görev tamamlama
 * @param {string} taskId - Görev ID
 */
export const logDailyTaskComplete = (taskId) => {
  logEvent('daily_task_complete', {
    task_id: taskId,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Günlük ödül alma
 * @param {number} day - Gün sayısı
 * @param {number} streak - Ardışık gün
 */
export const logDailyRewardClaimed = (day, streak) => {
  logEvent('daily_reward_claimed', {
    day,
    streak,
    timestamp: new Date().toISOString(),
  });
};

// ========================================
// User Properties
// ========================================

/**
 * Toplam oynanan oyun sayısını güncelle
 */
export const updateTotalGamesPlayed = (count) => {
  setUserProperty('total_games_played', String(count));
};

/**
 * En yüksek skoru güncelle
 */
export const updateHighestScore = (score) => {
  setUserProperty('highest_score', String(score));
};

/**
 * Reklamsız satın alma durumu
 */
export const updateHasNoAdsPurchase = (hasPurchased) => {
  setUserProperty('has_purchased_noads', hasPurchased ? 'true' : 'false');
};

/**
 * Tutorial tamamlandı mı?
 */
export const updateTutorialCompleted = (completed) => {
  setUserProperty('tutorial_completed', completed ? 'true' : 'false');
};

/**
 * Son giriş tarihi
 */
export const updateLastLoginDate = () => {
  const today = new Date().toISOString().split('T')[0];
  setUserProperty('last_login_date', today);
};

export default {
  initializeAnalytics,
  logEvent,
  setUserProperty,
  setUserId,
  // Game events
  logAppOpen,
  logGameStart,
  logGameOver,
  logAchievementUnlocked,
  logAdImpression,
  logAdClick,
  logPurchase,
  logTutorialComplete,
  logShare,
  logSettingsChange,
  logScreenView,
  logLeaderboardView,
  logPowerupUsed,
  logCoinsEarned,
  logCoinsSpent,
  logDailyTaskComplete,
  logDailyRewardClaimed,
  // User properties
  updateTotalGamesPlayed,
  updateHighestScore,
  updateHasNoAdsPurchase,
  updateTutorialCompleted,
  updateLastLoginDate,
};
