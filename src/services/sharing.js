/**
 * Paylaşma Servisi
 *
 * Oyun skorlarını sosyal medyada paylaşma
 *
 * KURULUM TALİMATLARI (Production için):
 *
 * 1. expo-sharing paketini yükle:
 *    npx expo install expo-sharing
 *
 * 2. (Opsiyonel) Screenshot almak için:
 *    npx expo install react-native-view-shot
 *
 * Özellikler:
 * - Skor paylaşımı
 * - Store linkli paylaşım
 * - Screenshot paylaşımı (opsiyonel)
 * - Sosyal medya desteği
 */

import { Share, Platform } from 'react-native';
// import * as Sharing from 'expo-sharing'; // Production için enable et

/**
 * Store linkleri
 */
const STORE_LINKS = {
  ios: 'https://apps.apple.com/app/colordrop/id123456789', // TODO: Gerçek App Store linki ekle
  android: 'https://play.google.com/store/apps/details?id=com.szrgame.colordrop', // TODO: Gerçek Play Store linki ekle
};

/**
 * Skoru paylaş
 *
 * @param {number} score - Paylaşılacak skor
 * @param {string} highScore - En yüksek skor
 */
export const shareScore = async (score, highScore = null) => {
  try {
    const storeLink = Platform.OS === 'ios' ? STORE_LINKS.ios : STORE_LINKS.android;

    let message = `🎨 ColorDrop'ta ${score} puan yaptım! 🎯\n\n`;

    if (highScore && score >= highScore) {
      message += `🏆 Yeni rekor! En yüksek skorumu kırdım!\n\n`;
    }

    message += `Sen de dene ve skorunu paylaş!\n`;
    message += `İndir: ${storeLink}`;

    const result = await Share.share({
      message,
      url: storeLink, // iOS için
      title: 'ColorDrop - Skorumu Gör!',
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // iOS - Specific activity type
        return { success: true, activityType: result.activityType };
      } else {
        // Android - Shared
        return { success: true };
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
      return { success: false, dismissed: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Share score error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Başarımı paylaş
 *
 * @param {string} achievementName - Başarım adı
 * @param {string} achievementDescription - Başarım açıklaması
 */
export const shareAchievement = async (achievementName, achievementDescription) => {
  try {
    const storeLink = Platform.OS === 'ios' ? STORE_LINKS.ios : STORE_LINKS.android;

    const message = `🏆 ColorDrop'ta "${achievementName}" başarımını açtım!\n\n` +
      `${achievementDescription}\n\n` +
      `Sen de dene!\n` +
      `İndir: ${storeLink}`;

    const result = await Share.share({
      message,
      url: storeLink,
      title: 'ColorDrop - Başarım Açıldı!',
    });

    return result.action === Share.sharedAction
      ? { success: true }
      : { success: false };
  } catch (error) {
    console.error('Share achievement error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Liderlik sıralamasını paylaş
 *
 * @param {number} rank - Sıralama
 * @param {number} score - Skor
 */
export const shareLeaderboardRank = async (rank, score) => {
  try {
    const storeLink = Platform.OS === 'ios' ? STORE_LINKS.ios : STORE_LINKS.android;

    let message = `🎖️ ColorDrop liderlik tablosunda ${rank}. sıradayım!\n\n` +
      `Skorum: ${score} 🎯\n\n`;

    if (rank <= 10) {
      message += `🌟 Top 10'dayım!\n\n`;
    } else if (rank <= 100) {
      message += `💪 Top 100'deyim!\n\n`;
    }

    message += `Sen de yarış!\n` +
      `İndir: ${storeLink}`;

    const result = await Share.share({
      message,
      url: storeLink,
      title: 'ColorDrop - Liderlik Tablosu',
    });

    return result.action === Share.sharedAction
      ? { success: true }
      : { success: false };
  } catch (error) {
    console.error('Share rank error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Genel paylaşım (uygulama davetiyesi)
 */
export const shareApp = async () => {
  try {
    const storeLink = Platform.OS === 'ios' ? STORE_LINKS.ios : STORE_LINKS.android;

    const message = `🎨 ColorDrop - Eğlenceli bir renk eşleştirme oyunu! 🎯\n\n` +
      `Topları doğru renklere yönlendir, en yüksek skoru yap!\n\n` +
      `Ücretsiz indir: ${storeLink}`;

    const result = await Share.share({
      message,
      url: storeLink,
      title: 'ColorDrop - Renk Eşleştirme Oyunu',
    });

    return result.action === Share.sharedAction
      ? { success: true }
      : { success: false };
  } catch (error) {
    console.error('Share app error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Screenshot paylaşımı (expo-sharing ile)
 * TODO: Production için react-native-view-shot ile screenshot al
 *
 * @param {string} uri - Screenshot URI (react-native-view-shot'tan)
 */
export const shareScreenshot = async (uri) => {
  try {
    // TODO: expo-sharing implementation
    // if (!(await Sharing.isAvailableAsync())) {
    //   alert('Paylaşım özelliği bu cihazda kullanılamıyor');
    //   return { success: false };
    // }
    //
    // await Sharing.shareAsync(uri, {
    //   mimeType: 'image/png',
    //   dialogTitle: 'ColorDrop Skorumu Paylaş',
    // });
    //
    // return { success: true };

    // Geçici: Sadece metin paylaşımı
    return await shareScore(0);
  } catch (error) {
    console.error('Share screenshot error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * WhatsApp'a paylaş
 *
 * @param {number} score - Skor
 */
export const shareToWhatsApp = async (score) => {
  try {
    const storeLink = Platform.OS === 'ios' ? STORE_LINKS.ios : STORE_LINKS.android;

    const message = `🎨 ColorDrop'ta ${score} puan yaptım! 🎯 Sen de dene: ${storeLink}`;

    // WhatsApp URL scheme
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    const result = await Share.share({
      message,
    }, {
      // Android için
      dialogTitle: 'WhatsApp ile Paylaş',
    });

    return result.action === Share.sharedAction
      ? { success: true }
      : { success: false };
  } catch (error) {
    console.error('Share to WhatsApp error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Twitter'a paylaş
 *
 * @param {number} score - Skor
 */
export const shareToTwitter = async (score) => {
  try {
    const storeLink = Platform.OS === 'ios' ? STORE_LINKS.ios : STORE_LINKS.android;

    const message = `🎨 ColorDrop'ta ${score} puan yaptım! 🎯 #ColorDrop #MobileGame`;

    const result = await Share.share({
      message: `${message}\n${storeLink}`,
    });

    return result.action === Share.sharedAction
      ? { success: true }
      : { success: false };
  } catch (error) {
    console.error('Share to Twitter error:', error);
    return { success: false, error: error.message };
  }
};
