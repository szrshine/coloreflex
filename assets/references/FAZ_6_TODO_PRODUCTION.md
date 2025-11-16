# Faz 6 - Production İçin Yapılması Gerekenler

## 🔴 KRİTİK - Mutlaka Yapılması Gerekenler

### 1. Firebase Firestore Kurulumu ve Entegrasyonu

#### Adım 1: Firebase Projesi Oluşturma
1. [Firebase Console](https://console.firebase.google.com)'a git
2. "Add Project" tıkla
3. Proje adı: `colordrop-game` (veya istediğin isim)
4. Google Analytics'i aktif et (önerilen)
5. Projeyi oluştur

#### Adım 2: Android Uygulaması Ekleme
1. Firebase Console'da Android ikonu tıkla
2. Package name: `com.szrgame.colordrop` (app.json'daki ile aynı olmalı)
3. App nickname: `ColorDrop Android`
4. SHA-1 certificate ekle (opsiyonel, ama önerilen):
   ```bash
   cd android
   ./gradlew signingReport
   ```
5. `google-services.json` dosyasını indir
6. Dosyayı `android/app/` klasörüne kopyala

#### Adım 3: iOS Uygulaması Ekleme
1. Firebase Console'da iOS ikonu tıkla
2. Bundle ID: `com.szrgame.colordrop` (app.json'daki ile aynı olmalı)
3. App nickname: `ColorDrop iOS`
4. `GoogleService-Info.plist` dosyasını indir
5. Dosyayı `ios/` klasörüne kopyala

#### Adım 4: NPM Paketlerini Yükle
```bash
npm install @react-native-firebase/app @react-native-firebase/firestore
```

#### Adım 5: app.json'ı Güncelle
```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/firestore"
    ]
  }
}
```

#### Adım 6: Native Build
```bash
npx expo prebuild
```

#### Adım 7: Firestore Rules Ayarla
Firebase Console > Firestore Database > Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leaderboard collection
    match /leaderboard/{userId} {
      // Herkes okuyabilir
      allow read: if true;

      // Sadece kendi kaydını yazabilir
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Adım 8: src/services/leaderboard.js'i Güncelle

**ŞU AN (Mock):**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
// import firestore from '@react-native-firebase/firestore';  // KAPALI
```

**PRODUCTION (Firebase):**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';  // AÇ
import auth from '@react-native-firebase/auth';  // AÇ
```

**submitScore fonksiyonunu güncelle:**
```javascript
export const submitScore = async (score, period = 'all') => {
  try {
    const userId = await getUserId();
    const userName = await getUserName();

    if (!userId) {
      throw new Error('User ID not found');
    }

    // Firebase'e kaydet
    const leaderboardRef = firestore()
      .collection('leaderboard')
      .doc(`${userId}_${period}`);

    await leaderboardRef.set({
      userId,
      userName,
      score,
      timestamp: firestore.FieldValue.serverTimestamp(),
      period,
    }, { merge: true });

    // Local cache'e de kaydet (offline için)
    const leaderboardKey = `leaderboard_${period}`;
    const leaderboardData = await AsyncStorage.getItem(leaderboardKey);
    let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];

    const existingIndex = leaderboard.findIndex(entry => entry.userId === userId);

    const entry = {
      userId,
      userName,
      score,
      timestamp: Date.now(),
      period,
    };

    if (existingIndex >= 0) {
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex] = entry;
      }
    } else {
      leaderboard.push(entry);
    }

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 100);

    await AsyncStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    return true;
  } catch (error) {
    console.error('Submit score error:', error);
    return false;
  }
};
```

**getLeaderboard fonksiyonunu güncelle:**
```javascript
export const getLeaderboard = async (period = 'all', limit = 100) => {
  try {
    // Firebase'den getir
    const leaderboardRef = firestore()
      .collection('leaderboard')
      .where('period', '==', period)
      .orderBy('score', 'desc')
      .limit(limit);

    const snapshot = await leaderboardRef.get();
    const leaderboard = snapshot.docs.map((doc, index) => ({
      ...doc.data(),
      rank: index + 1,
    }));

    // Local cache'e kaydet
    const leaderboardKey = `leaderboard_${period}`;
    await AsyncStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    return leaderboard;
  } catch (error) {
    console.error('Get leaderboard error:', error);

    // Hata durumunda local cache'den getir
    const leaderboardKey = `leaderboard_${period}`;
    const leaderboardData = await AsyncStorage.getItem(leaderboardKey);
    let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, limit);

    leaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return leaderboard;
  }
};
```

#### Adım 9: Mock Data Fonksiyonunu Kaldır
**src/screens/LeaderboardScreen.js** dosyasında:

**KALDIR:**
```javascript
const initializeLeaderboard = async () => {
  // SADECE GELİŞTİRME İÇİN: Mock data oluştur
  // Production'da bu satırı kaldırın
  await seedMockData();  // ← BU SATIRI SİL

  await checkUserName();
  await loadLeaderboard();
};
```

**PRODUCTION:**
```javascript
const initializeLeaderboard = async () => {
  await checkUserName();
  await loadLeaderboard();
};
```

**VEYA** `src/services/leaderboard.js`'den `seedMockData` fonksiyonunu tamamen sil.

---

### 2. Firebase Authentication (Opsiyonel ama Önerilen)

Kullanıcıları doğrulamak için:

```bash
npm install @react-native-firebase/auth
```

**Anonim Authentication:**
```javascript
import auth from '@react-native-firebase/auth';

export const getUserId = async () => {
  try {
    // Mevcut kullanıcıyı kontrol et
    let user = auth().currentUser;

    if (!user) {
      // Anonim giriş yap
      const userCredential = await auth().signInAnonymously();
      user = userCredential.user;
    }

    return user.uid;
  } catch (error) {
    console.error('Auth error:', error);
    // Fallback: AsyncStorage
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  }
};
```

---

### 3. Firebase Cloud Functions (Otomatik Leaderboard Reset)

#### Adım 1: Cloud Functions Kurulumu
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

#### Adım 2: functions/index.js
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Her gün gece yarısı daily leaderboard'u temizle
exports.resetDailyLeaderboard = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    console.log('Resetting daily leaderboard...');

    const batch = db.batch();
    const snapshot = await db.collection('leaderboard')
      .where('period', '==', 'daily')
      .get();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Daily leaderboard reset complete');
    return null;
  });

// Her Pazartesi gece yarısı weekly leaderboard'u temizle
exports.resetWeeklyLeaderboard = functions.pubsub
  .schedule('0 0 * * 1')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    console.log('Resetting weekly leaderboard...');

    const batch = db.batch();
    const snapshot = await db.collection('leaderboard')
      .where('period', '==', 'weekly')
      .get();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Weekly leaderboard reset complete');
    return null;
  });

// Her ayın 1'i gece yarısı monthly leaderboard'u temizle
exports.resetMonthlyLeaderboard = functions.pubsub
  .schedule('0 0 1 * *')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    console.log('Resetting monthly leaderboard...');

    const batch = db.batch();
    const snapshot = await db.collection('leaderboard')
      .where('period', '==', 'monthly')
      .get();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Monthly leaderboard reset complete');
    return null;
  });
```

#### Adım 3: Deploy
```bash
firebase deploy --only functions
```

---

## 🟡 ÖNEMLİ - Yapılması Önerilen

### 4. Store Linklerini Güncelle

**src/services/sharing.js** dosyasında:

**ŞU AN:**
```javascript
const STORE_LINKS = {
  ios: 'https://apps.apple.com/app/colordrop/id123456789', // TODO
  android: 'https://play.google.com/store/apps/details?id=com.szrgame.colordrop', // TODO
};
```

**PRODUCTION:**
```javascript
const STORE_LINKS = {
  ios: 'https://apps.apple.com/app/colordrop/id[GERÇEK_APP_STORE_ID]',
  android: 'https://play.google.com/store/apps/details?id=com.szrgame.colordrop',
};
```

**App Store ID'yi Bulma:**
1. App Store Connect'e git
2. Uygulamanı seç
3. App Information > General Information > Apple ID
4. Bu ID'yi kullan

---

### 5. Firestore İndexler Oluştur

Firebase Console > Firestore > Indexes:

**Composite Index:**
- Collection: `leaderboard`
- Fields:
  - `period` (Ascending)
  - `score` (Descending)

Veya komut satırı ile:
```bash
firebase firestore:indexes
```

---

### 6. Expo Sharing Kurulumu (Opsiyonel)

Daha gelişmiş paylaşım özellikleri için:

```bash
npx expo install expo-sharing
```

**src/services/sharing.js'de aktif et:**
```javascript
import * as Sharing from 'expo-sharing';

export const shareScreenshot = async (uri) => {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Paylaşım özelliği bu cihazda kullanılamıyor');
      return { success: false };
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: 'ColorDrop Skorumu Paylaş',
    });

    return { success: true };
  } catch (error) {
    console.error('Share screenshot error:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 🟢 BONUS - İyileştirmeler

### 7. Screenshot Paylaşımı (react-native-view-shot)

```bash
npm install react-native-view-shot
```

**Kullanım:**
```javascript
import ViewShot from 'react-native-view-shot';

// GameOverScreen'de
const viewShotRef = useRef();

const handleScreenshotShare = async () => {
  try {
    const uri = await viewShotRef.current.capture();
    await shareScreenshot(uri);
  } catch (error) {
    console.error('Screenshot error:', error);
  }
};

return (
  <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
    {/* Game Over içeriği */}
  </ViewShot>
);
```

---

### 8. Profil Fotoğrafı Desteği

Firebase Storage kullanarak:

```bash
npm install @react-native-firebase/storage
```

**Kullanıcı profil fotoğrafı yükleme:**
```javascript
import storage from '@react-native-firebase/storage';

export const uploadProfilePhoto = async (userId, photoUri) => {
  try {
    const reference = storage().ref(`profile_photos/${userId}.jpg`);
    await reference.putFile(photoUri);
    const url = await reference.getDownloadURL();

    // Firestore'da kullanıcı bilgisini güncelle
    await firestore().collection('users').doc(userId).set({
      photoURL: url,
    }, { merge: true });

    return url;
  } catch (error) {
    console.error('Upload photo error:', error);
    return null;
  }
};
```

---

### 9. Arkadaş Sistemi (Friends Leaderboard)

```javascript
// Arkadaş ekleme
export const addFriend = async (userId, friendUserId) => {
  await firestore().collection('friends').doc(userId).set({
    friends: firestore.FieldValue.arrayUnion(friendUserId),
  }, { merge: true });
};

// Arkadaş leaderboard'u getir
export const getFriendsLeaderboard = async (userId, period = 'all') => {
  const friendsDoc = await firestore().collection('friends').doc(userId).get();
  const friendIds = friendsDoc.data()?.friends || [];

  const leaderboard = [];
  for (const friendId of friendIds) {
    const friendScore = await firestore()
      .collection('leaderboard')
      .doc(`${friendId}_${period}`)
      .get();

    if (friendScore.exists) {
      leaderboard.push(friendScore.data());
    }
  }

  leaderboard.sort((a, b) => b.score - a.score);
  return leaderboard;
};
```

---

## 📋 Test Checklist

### Firebase Testi:
- [ ] Firebase projesi oluşturuldu
- [ ] Android app eklendi (`google-services.json` yerleştirildi)
- [ ] iOS app eklendi (`GoogleService-Info.plist` yerleştirildi)
- [ ] NPM paketleri yüklendi
- [ ] `npx expo prebuild` çalıştırıldı
- [ ] Firestore Rules ayarlandı
- [ ] İlk skor Firebase'e gönderildi
- [ ] Leaderboard Firebase'den çekildi
- [ ] Offline mod çalışıyor (local cache)

### Paylaşım Testi:
- [ ] Store linkleri güncellendi
- [ ] Skor paylaşımı test edildi
- [ ] Share sheet açılıyor
- [ ] WhatsApp paylaşımı çalışıyor
- [ ] Twitter paylaşımı çalışıyor
- [ ] Mesaj formatı doğru

### Cloud Functions Testi:
- [ ] Functions deploy edildi
- [ ] Daily reset çalışıyor (manuel test et: `firebase functions:shell`)
- [ ] Weekly reset çalışıyor
- [ ] Monthly reset çalışıyor
- [ ] Cloud Functions logları kontrol edildi

---

## 🚨 Dikkat Edilmesi Gerekenler

1. **Firebase Ücretsiz Limit:**
   - Günlük 50,000 okuma
   - Günlük 20,000 yazma
   - Günlük 20,000 silme
   - Eğer limit aşılırsa Blaze planına geçmelisin

2. **Firestore Güvenlik:**
   - Asla API key'leri commit etme
   - Rules'ları production'da sıkılaştır
   - User input'ları validate et

3. **Performans:**
   - Leaderboard'u cache'le (local storage)
   - Pagination ekle (100+ kullanıcı için)
   - Offline support sağla

4. **Mock Data:**
   - Production build'de `seedMockData()` çağrısını mutlaka kaldır
   - Test için ayrı Firebase projesi kullan

---

## 📞 Yardım Kaynakları

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [React Native Firebase](https://rnfirebase.io/)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)

---

## 🎯 Özet

**Minimum Production Gereksinimleri:**
1. ✅ Firebase Firestore kurulumu
2. ✅ `src/services/leaderboard.js`'de Firebase kodlarını aktif et
3. ✅ `seedMockData()` çağrısını kaldır
4. ✅ Store linklerini güncelle

**Önerilen:**
5. ✅ Firebase Authentication ekle
6. ✅ Cloud Functions ile otomatik reset
7. ✅ Firestore Rules güvenliğini artır
8. ✅ Expo Sharing kullan

**Bonus:**
9. ✅ Screenshot paylaşımı
10. ✅ Profil fotoğrafı
11. ✅ Arkadaş sistemi

Başarılar! 🚀
