/**
 * Tarih ve zaman yardımcı fonksiyonları
 */

/**
 * Bugünün tarih string'ini al (toDateString formatında)
 * @returns {string} Bugünün tarihi
 */
export const getTodayString = () => {
  return new Date().toDateString();
};

/**
 * Dünün tarih string'ini al
 * @returns {string} Dünün tarihi
 */
export const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toDateString();
};

/**
 * İki tarih string'i aynı gün mü?
 * @param {string} dateStr1 - İlk tarih
 * @param {string} dateStr2 - İkinci tarih
 * @returns {boolean} Aynı gün mü?
 */
export const isSameDay = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return false;
  return dateStr1 === dateStr2;
};

/**
 * İkinci tarih birinci tarihten bir gün sonra mı?
 * @param {string} date1Str - İlk tarih (önceki gün olması beklenir)
 * @param {string} date2Str - İkinci tarih (sonraki gün olması beklenir)
 * @returns {boolean} Ardışık günler mi?
 */
export const isConsecutiveDay = (date1Str, date2Str) => {
  if (!date1Str || !date2Str) return false;

  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  // İkinci tarihin bir gün sonra olup olmadığını kontrol et
  const nextDay = new Date(date1);
  nextDay.setDate(nextDay.getDate() + 1);

  return nextDay.toDateString() === date2.toDateString();
};

/**
 * Bugün son giriş tarihinden sonra mı?
 * @param {string} lastLoginStr - Son giriş tarihi
 * @returns {boolean} Yeni gün mü?
 */
export const isNewDay = (lastLoginStr) => {
  if (!lastLoginStr) return true;

  const today = getTodayString();
  return !isSameDay(today, lastLoginStr);
};

/**
 * Günlük streak hesapla
 * @param {string} lastLoginStr - Son giriş tarihi
 * @param {number} currentStreak - Mevcut streak
 * @returns {number} Yeni streak değeri
 */
export const calculateDailyStreak = (lastLoginStr, currentStreak = 0) => {
  if (!lastLoginStr) return 1; // İlk giriş

  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (isSameDay(today, lastLoginStr)) {
    // Aynı gün, streak değişmez
    return currentStreak;
  }

  if (isSameDay(yesterday, lastLoginStr)) {
    // Ardışık gün, streak artır
    return currentStreak + 1;
  }

  // Streak kırıldı, 1'den başla
  return 1;
};

/**
 * İki tarih arasındaki gün sayısı
 * @param {string} date1Str - İlk tarih
 * @param {string} date2Str - İkinci tarih
 * @returns {number} Gün farkı
 */
export const getDaysDifference = (date1Str, date2Str) => {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Tarih formatla (human readable)
 * @param {string} dateStr - Tarih string'i
 * @returns {string} Formatlanmış tarih
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'Bilinmiyor';

  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('tr-TR', options);
};

/**
 * Bugünden X gün önce
 * @param {number} days - Kaç gün önce
 * @returns {string} Tarih string'i
 */
export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toDateString();
};

/**
 * Bugünden X gün sonra
 * @param {number} days - Kaç gün sonra
 * @returns {string} Tarih string'i
 */
export const getDaysLater = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toDateString();
};
