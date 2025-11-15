/**
 * Audio servisi
 * Bu servis ses dosyaları için helper fonksiyonlar sağlar
 * Not: Asıl ses yükleme ve çalma işlemleri useAudio hook'unda yapılıyor
 */

/**
 * Ses dosyası path'lerini döndür
 */
export const SOUND_ASSETS = {
  correct: require('../../../assets/sounds/correct.mp3'),
  wrong: require('../../../assets/sounds/wrong.mp3'),
  click: require('../../../assets/sounds/click.mp3'),
  background: require('../../../assets/sounds/background.mp3'),
};

/**
 * Ses ayarlarını döndür
 */
export const SOUND_CONFIG = {
  correct: {
    volume: 1.0,
  },
  wrong: {
    volume: 1.0,
  },
  click: {
    volume: 0.7,
  },
  background: {
    volume: 0.6,
    isLooping: true,
  },
};

/**
 * Ses dosyasının ayarlarını al
 * @param {string} soundType - Ses tipi (correct, wrong, click, background)
 * @returns {Object} Ses ayarları
 */
export const getSoundConfig = (soundType) => {
  return SOUND_CONFIG[soundType] || { volume: 1.0 };
};

/**
 * Ses dosyası path'ini al
 * @param {string} soundType - Ses tipi
 * @returns {any} Ses dosyası require
 */
export const getSoundAsset = (soundType) => {
  return SOUND_ASSETS[soundType];
};

/**
 * Tüm ses tiplerini döndür
 * @returns {Array<string>} Ses tipleri
 */
export const getAllSoundTypes = () => {
  return Object.keys(SOUND_ASSETS);
};

/**
 * Ses tipi geçerli mi?
 * @param {string} soundType - Ses tipi
 * @returns {boolean} Geçerli mi?
 */
export const isValidSoundType = (soundType) => {
  return SOUND_ASSETS.hasOwnProperty(soundType);
};
