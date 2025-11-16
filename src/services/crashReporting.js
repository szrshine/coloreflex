// Crash Reporting Service - Sentry Integration
// Bu dosya crash reporting ve error tracking için hazırlanmıştır

/**
 * PRODUCTION İÇİN KURULUM:
 *
 * 1. Sentry hesabı oluştur: https://sentry.io/
 * 2. React Native projesi oluştur
 * 3. DSN (Data Source Name) al
 * 4. Paketleri yükle:
 *    npm install @sentry/react-native
 *    npx @sentry/wizard -i reactNative -p ios android
 *
 * 5. Bu dosyadaki yorumları kaldır ve DSN'i güncelle
 */

// import * as Sentry from '@sentry/react-native';

// Sentry DSN (Production'da gerçek DSN kullanılmalı)
const SENTRY_DSN = 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID';

// Development modunda mı?
const __DEV__ = process.env.NODE_ENV !== 'production';

/**
 * Sentry'yi başlat
 */
export const initializeCrashReporting = () => {
  if (__DEV__) {
    console.log('[CrashReporting] Development modunda - Sentry devre dışı');
    return;
  }

  // Production'da Sentry'yi aktif et
  /*
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: false, // Production'da false olmalı
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 1.0, // Performance monitoring için
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    beforeSend(event, hint) {
      // Hassas bilgileri filtrele
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
  });

  console.log('[CrashReporting] Sentry başlatıldı');
  */
};

/**
 * Manuel olarak hata kaydet
 * @param {Error} error - Hata objesi
 * @param {object} context - Ek context bilgisi
 */
export const logError = (error, context = {}) => {
  if (__DEV__) {
    console.error('[CrashReporting] Error:', error);
    console.log('[CrashReporting] Context:', context);
    return;
  }

  // Production'da Sentry'ye gönder
  /*
  Sentry.captureException(error, {
    extra: context,
  });
  */
};

/**
 * Manuel mesaj kaydet (error olmayan önemli olaylar)
 * @param {string} message - Mesaj
 * @param {string} level - Severity level (info, warning, error)
 * @param {object} context - Ek context bilgisi
 */
export const logMessage = (message, level = 'info', context = {}) => {
  if (__DEV__) {
    console.log(`[CrashReporting] ${level.toUpperCase()}: ${message}`, context);
    return;
  }

  // Production'da Sentry'ye gönder
  /*
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
  */
};

/**
 * Kullanıcı bilgisini ayarla (opsiyonel)
 * @param {object} user - Kullanıcı bilgisi
 */
export const setUser = (user) => {
  if (__DEV__) {
    console.log('[CrashReporting] User set:', user);
    return;
  }

  /*
  Sentry.setUser({
    id: user.id,
    username: user.username,
    // Email ve IP eklemeyin (privacy)
  });
  */
};

/**
 * Kullanıcı bilgisini temizle
 */
export const clearUser = () => {
  if (__DEV__) {
    console.log('[CrashReporting] User cleared');
    return;
  }

  // Sentry.setUser(null);
};

/**
 * Custom breadcrumb ekle (olay geçmişi)
 * @param {string} message - Breadcrumb mesajı
 * @param {string} category - Kategori
 * @param {object} data - Ek veri
 */
export const addBreadcrumb = (message, category = 'custom', data = {}) => {
  if (__DEV__) {
    console.log(`[CrashReporting] Breadcrumb [${category}]: ${message}`, data);
    return;
  }

  /*
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
  */
};

/**
 * Oyun event'lerini logla (breadcrumb olarak)
 */
export const logGameEvent = (eventName, data = {}) => {
  addBreadcrumb(eventName, 'game', data);
};

/**
 * Test crash oluştur (sadece development için)
 */
export const testCrash = () => {
  if (!__DEV__) {
    console.warn('[CrashReporting] Test crash sadece development modunda çalışır');
    return;
  }

  // Test crash
  throw new Error('Test Crash - This is intentional for testing Sentry');
};

/**
 * Performance transaction başlat
 * @param {string} name - Transaction adı
 * @returns {object} Transaction objesi
 */
export const startTransaction = (name) => {
  if (__DEV__) {
    const startTime = Date.now();
    return {
      finish: () => {
        const duration = Date.now() - startTime;
        console.log(`[CrashReporting] Transaction "${name}" completed in ${duration}ms`);
      },
    };
  }

  /*
  const transaction = Sentry.startTransaction({ name });
  return transaction;
  */

  return { finish: () => {} };
};

export default {
  initializeCrashReporting,
  logError,
  logMessage,
  setUser,
  clearUser,
  addBreadcrumb,
  logGameEvent,
  testCrash,
  startTransaction,
};
