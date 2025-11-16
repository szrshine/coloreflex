/**
 * Leaderboard Servisi
 *
 * Firebase Firestore ile liderlik tablosu yönetimi
 *
 * KURULUM TALİMATLARI (Production için):
 *
 * 1. Firebase Console'da proje oluştur (https://console.firebase.google.com)
 * 2. Android ve iOS uygulamaları ekle
 * 3. google-services.json (Android) ve GoogleService-Info.plist (iOS) dosyalarını indir
 * 4. NPM paketlerini yükle:
 *    npm install @react-native-firebase/app @react-native-firebase/firestore
 * 5. app.json'a Firebase config ekle
 * 6. Native build yap (expo prebuild)
 *
 * Firebase Firestore Yapısı:
 *
 * leaderboard (collection)
 *   ├── {userId} (document)
 *   │   ├── userId: string
 *   │   ├── userName: string
 *   │   ├── score: number
 *   │   ├── timestamp: timestamp
 *   │   ├── period: string ('daily', 'weekly', 'monthly', 'all')
 *
 * Firestore Rules:
 * ```
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /leaderboard/{userId} {
 *       allow read: if true;
 *       allow write: if request.auth != null && request.auth.uid == userId;
 *     }
 *   }
 * }
 * ```
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase import (şu an disabled - production için enable et)
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// ============================================================================
// MOCK IMPLEMENTATION (Geliştirme için)
// Production'da tüm mock fonksiyonları Firebase fonksiyonları ile değiştirin
// ============================================================================

/**
 * Kullanıcı ID'si oluştur veya getir
 */
export const getUserId = async () => {
  try {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      // Benzersiz ID oluştur
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  } catch (error) {
    console.error('Get user ID error:', error);
    return null;
  }
};

/**
 * Kullanıcı ismini getir
 */
export const getUserName = async () => {
  try {
    const userName = await AsyncStorage.getItem('userName');
    return userName || 'Anonim';
  } catch (error) {
    console.error('Get user name error:', error);
    return 'Anonim';
  }
};

/**
 * Kullanıcı ismini kaydet
 */
export const saveUserName = async (name) => {
  try {
    await AsyncStorage.setItem('userName', name);
    return true;
  } catch (error) {
    console.error('Save user name error:', error);
    return false;
  }
};

/**
 * Skoru leaderboard'a gönder
 *
 * @param {number} score - Kullanıcının skoru
 * @param {string} period - Periyot ('daily', 'weekly', 'monthly', 'all')
 */
export const submitScore = async (score, period = 'all') => {
  try {
    const userId = await getUserId();
    const userName = await getUserName();

    if (!userId) {
      throw new Error('User ID not found');
    }

    // MOCK: Local storage'a kaydet
    const leaderboardKey = `leaderboard_${period}`;
    const leaderboardData = await AsyncStorage.getItem(leaderboardKey);
    let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];

    // Kullanıcının mevcut kaydını bul
    const existingIndex = leaderboard.findIndex(entry => entry.userId === userId);

    const entry = {
      userId,
      userName,
      score,
      timestamp: Date.now(),
      period,
    };

    if (existingIndex >= 0) {
      // Sadece daha yüksek skorsa güncelle
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex] = entry;
      }
    } else {
      // Yeni kayıt ekle
      leaderboard.push(entry);
    }

    // Sırala (en yüksek skordan başla)
    leaderboard.sort((a, b) => b.score - a.score);

    // Top 100'ü sakla
    leaderboard = leaderboard.slice(0, 100);

    await AsyncStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    // TODO: Firebase implementation
    // const leaderboardRef = firestore().collection('leaderboard').doc(userId);
    // await leaderboardRef.set({
    //   userId,
    //   userName,
    //   score,
    //   timestamp: firestore.FieldValue.serverTimestamp(),
    //   period,
    // }, { merge: true });

    return true;
  } catch (error) {
    console.error('Submit score error:', error);
    return false;
  }
};

/**
 * Leaderboard'u getir
 *
 * @param {string} period - Periyot ('daily', 'weekly', 'monthly', 'all')
 * @param {number} limit - Kaç kayıt getirileceği (default: 100)
 */
export const getLeaderboard = async (period = 'all', limit = 100) => {
  try {
    // MOCK: Local storage'dan getir
    const leaderboardKey = `leaderboard_${period}`;
    const leaderboardData = await AsyncStorage.getItem(leaderboardKey);
    let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];

    // Sırala ve limit uygula
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, limit);

    // Rank ekle
    leaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // TODO: Firebase implementation
    // const leaderboardRef = firestore()
    //   .collection('leaderboard')
    //   .where('period', '==', period)
    //   .orderBy('score', 'desc')
    //   .limit(limit);
    //
    // const snapshot = await leaderboardRef.get();
    // const leaderboard = snapshot.docs.map((doc, index) => ({
    //   ...doc.data(),
    //   rank: index + 1,
    // }));

    return leaderboard;
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return [];
  }
};

/**
 * Kullanıcının sıralamasını getir
 *
 * @param {number} score - Kullanıcının skoru
 * @param {string} period - Periyot ('daily', 'weekly', 'monthly', 'all')
 */
export const getUserRank = async (score, period = 'all') => {
  try {
    const leaderboard = await getLeaderboard(period, 1000);
    const rank = leaderboard.filter(entry => entry.score > score).length + 1;

    // TODO: Firebase implementation
    // const leaderboardRef = firestore()
    //   .collection('leaderboard')
    //   .where('period', '==', period)
    //   .where('score', '>', score);
    //
    // const snapshot = await leaderboardRef.get();
    // const rank = snapshot.size + 1;

    return rank;
  } catch (error) {
    console.error('Get user rank error:', error);
    return null;
  }
};

/**
 * Günlük/haftalık/aylık leaderboard'ları temizle (scheduled task ile çalışmalı)
 */
export const resetPeriodLeaderboards = async () => {
  try {
    const now = new Date();
    const today = now.toDateString();

    // Son reset tarihini kontrol et
    const lastReset = await AsyncStorage.getItem('lastLeaderboardReset');

    if (lastReset !== today) {
      // Günlük reset
      await AsyncStorage.setItem('leaderboard_daily', JSON.stringify([]));

      // Haftalık reset (Pazartesi günleri)
      if (now.getDay() === 1) {
        await AsyncStorage.setItem('leaderboard_weekly', JSON.stringify([]));
      }

      // Aylık reset (Ayın ilk günü)
      if (now.getDate() === 1) {
        await AsyncStorage.setItem('leaderboard_monthly', JSON.stringify([]));
      }

      await AsyncStorage.setItem('lastLeaderboardReset', today);
    }

    // TODO: Firebase implementation (Cloud Functions ile)
    // Firebase Cloud Functions ile scheduled task oluştur:
    // - Her gün 00:00'da daily leaderboard'u temizle
    // - Her Pazartesi 00:00'da weekly leaderboard'u temizle
    // - Her ayın 1'i 00:00'da monthly leaderboard'u temizle

    return true;
  } catch (error) {
    console.error('Reset period leaderboards error:', error);
    return false;
  }
};

/**
 * Test verisi oluştur (geliştirme için)
 */
export const seedMockData = async () => {
  try {
    const names = [
      'AlphaGamer', 'BetaMaster', 'ColorKing', 'DropQueen', 'EpicPlayer',
      'FastFingers', 'GameLegend', 'HyperDrop', 'IceCold', 'JumpMaster',
      'KillerPro', 'LightSpeed', 'MegaDrop', 'NinjaSkill', 'OmegaWin',
      'ProGamer', 'QuickDraw', 'RapidFire', 'SuperStar', 'TurboBoost',
    ];

    const periods = ['all', 'monthly', 'weekly', 'daily'];

    for (const period of periods) {
      const leaderboard = [];
      for (let i = 0; i < 50; i++) {
        leaderboard.push({
          userId: 'mock_' + i,
          userName: names[i % names.length] + (i > 19 ? (i - 19) : ''),
          score: Math.max(5, 150 - i * 3 - Math.floor(Math.random() * 5)),
          timestamp: Date.now() - i * 3600000,
          period,
        });
      }

      const leaderboardKey = `leaderboard_${period}`;
      await AsyncStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
    }

    console.log('Mock leaderboard data seeded successfully');
    return true;
  } catch (error) {
    console.error('Seed mock data error:', error);
    return false;
  }
};
