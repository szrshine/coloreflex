# Faz 7: Production İçin Yapılacaklar

## 🔴 ÖNEMLİ: Production'a çıkmadan önce mutlaka yapılması gerekenler

### 1. Sentry Kurulumu (Crash Reporting)

**Adımlar:**

1. Sentry hesabı oluştur: https://sentry.io/
2. Yeni proje oluştur (React Native seçeneğini kullan)
3. DSN (Data Source Name) kopyala
4. Terminal'de şu komutları çalıştır:

```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative -p ios android
```

5. `src/services/crashReporting.js` dosyasını güncelle:
   - SENTRY_DSN değişkenini gerçek DSN ile değiştir
   - Tüm yorum satırlarını kaldır
   - Production kontrollerini aktif et

6. Test et:
```javascript
import { testCrash } from './src/services/crashReporting';
// Development modunda test crash yap
testCrash();
```

### 2. Firebase Analytics Kurulumu

**Adımlar:**

1. Firebase Console'a git: https://console.firebase.google.com/
2. Yeni proje oluştur (veya var olanı kullan)
3. Android uygulaması ekle:
   - Package name: `com.szrgame.colordrop` (app.json'dakiyle aynı olmalı)
   - `google-services.json` dosyasını indir
   - `android/app/` klasörüne yerleştir

4. iOS uygulaması ekle:
   - Bundle ID: `com.szrgame.colordrop`
   - `GoogleService-Info.plist` dosyasını indir
   - `ios/` klasörüne yerleştir

5. Firebase paketlerini yükle:
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

6. `src/services/analytics.js` dosyasını güncelle:
   - Import satırlarının yorumlarını kaldır
   - Mock analytics yerine gerçek analytics kullan
   - Tüm yorum satırlarını kaldır

7. Test et - Debug menüsünde Firebase events'leri göreceksiniz

### 3. Performance Optimizasyon Testi

**Yapılacaklar:**

1. Farklı cihazlarda test:
   - iPhone SE (küçük ekran)
   - iPhone 13 (orta ekran)
   - iPhone 14 Plus (büyük ekran)
   - iPad (tablet)
   - Düşük-orta-yüksek performanslı Android cihazlar

2. FPS (Frame Rate) kontrol:
```javascript
import { useFPS } from './src/hooks/usePerformance';

// Component'te
const fps = useFPS();
console.log('Current FPS:', fps);
```

3. Memory leak kontrolü:
```javascript
import { useMemoryMonitor } from './src/hooks/usePerformance';

// Component'te
useMemoryMonitor();
```

4. Performans sorunları varsa:
   - Console'da performance warning'leri kontrol et
   - 16ms'den uzun süren fonksiyonları optimize et
   - Gereksiz re-render'ları engelle

### 4. Responsive Design Testi

**Test edilmesi gereken ekran boyutları:**

- ✅ iPhone SE (375 x 667) - SMALL
- ✅ iPhone 13 (390 x 844) - MEDIUM
- ✅ iPhone 14 Plus (428 x 926) - LARGE
- ✅ iPad Pro (1024 x 1366) - XLARGE
- ✅ Android Small (360 x 640)
- ✅ Android Large (412 x 915)

**Kontrol edilecekler:**

- [ ] Toplar ekrana sığıyor mu?
- [ ] Butonlar dokunulabilir boyutta mı?
- [ ] Textler okunabilir mi?
- [ ] Banner reklam oyun alanını kapatmıyor mu?
- [ ] Safe area (notch/status bar) doğru hesaplanmış mı?
- [ ] Landscape mode devre dışı mı? (app.json'da orientation: "portrait")

### 5. Error Handling İyileştirmeleri

**Eklenmesi gereken try-catch blokları:**

1. Tüm async fonksiyonlarda:
```javascript
try {
  await AsyncStorage.setItem('key', 'value');
} catch (error) {
  logError(error, { context: 'AsyncStorage.setItem' });
}
```

2. Kritik game logic'te:
```javascript
try {
  // Oyun mantığı
} catch (error) {
  logError(error, { context: 'Game Logic' });
  // Fallback davranışı
}
```

3. Network request'lerde:
```javascript
try {
  const response = await fetch(url);
} catch (error) {
  logError(error, { context: 'Network Request', url });
}
```

### 6. Analytics Event'lerini Entegre Et

**Önemli yerlere analytics ekle:**

```javascript
// App.js - useEffect içinde
import { logAppOpen, updateLastLoginDate } from './src/services/analytics';

useEffect(() => {
  logAppOpen();
  updateLastLoginDate();
}, []);

// Oyun başladığında
import { logGameStart } from './src/services/analytics';
logGameStart();

// Oyun bittiğinde
import { logGameOver } from './src/services/analytics';
logGameOver(score, duration, correctMatches, wrongMatches);

// Başarım kazanıldığında
import { logAchievementUnlocked } from './src/services/analytics';
logAchievementUnlocked(achievement.id, achievement.title);

// Satın alma yapıldığında
import { logPurchase } from './src/services/analytics';
logPurchase(productId, productName, price);

// Reklam gösterildiğinde
import { logAdImpression } from './src/services/analytics';
logAdImpression('interstitial', 'game_over');
```

### 7. Crash Reporting Breadcrumbs Ekle

**Oyun akışını takip için:**

```javascript
import { addBreadcrumb, logGameEvent } from './src/services/crashReporting';

// Oyun event'lerinde
logGameEvent('ball_spawned', { ballId, color });
logGameEvent('correct_match', { score, streak });
logGameEvent('wrong_match', { livesLeft });
logGameEvent('powerup_activated', { powerupType });

// Kullanıcı aksiyonlarında
addBreadcrumb('User clicked start', 'ui');
addBreadcrumb('User opened settings', 'navigation');
addBreadcrumb('User purchased skin', 'monetization');
```

### 8. Bundle Size Optimizasyonu

**Gereksiz kütüphaneleri kontrol et:**

```bash
# Bundle analyzer yükle
npm install --save-dev react-native-bundle-visualizer

# Analiz et
npx react-native-bundle-visualizer

# Kullanılmayan imports'ları kaldır
# Büyük kütüphaneleri alternatiflerle değiştir
```

### 9. Code Cleanup (Production Öncesi)

**Yapılacaklar:**

- [ ] Tüm console.log'ları kaldır (production build'de otomatik kaldırılır ama yine de temizle)
- [ ] TODO yorumlarını kontrol et ve tamamla
- [ ] Test kodlarını kaldır
- [ ] Kullanılmayan import'ları temizle
- [ ] Gereksiz state'leri kaldır
- [ ] Dead code'ları temizle

### 10. Production Build Testi

**EAS Build ile test:**

```bash
# iOS production build
eas build --platform ios --profile production

# Android production build
eas build --platform android --profile production
```

**Test edilecekler:**

- [ ] Uygulama açılıyor mu?
- [ ] Crash oluyor mu?
- [ ] Reklamlar gösteriliyor mu?
- [ ] IAP çalışıyor mu?
- [ ] Analytics events gönderiliyor mu?
- [ ] Sentry'de crash'ler görünüyor mu?

### 11. Beta Test (TestFlight / Internal Testing)

**iOS - TestFlight:**

1. App Store Connect'te Internal Testing başlat
2. 5-10 kişiye davet gönder
3. En az 1 hafta test ettir
4. Feedback topla ve düzelt

**Android - Internal Testing:**

1. Play Console'da Internal Testing track'e yükle
2. Test kullanıcıları ekle
3. En az 1 hafta test ettir
4. Feedback topla ve düzelt

### 12. Production Checklist

**Store'a göndermeden önce:**

- [ ] Sentry aktif ve çalışıyor
- [ ] Firebase Analytics aktif ve event'ler gönderiliyor
- [ ] Error Boundary tüm uygulamayı sarıyor
- [ ] Production build'de reklamlar gerçek (test ad unit'leri değil)
- [ ] Version number doğru (app.json)
- [ ] Build number artırıldı
- [ ] Privacy Policy URL eklendi
- [ ] Terms of Service URL eklendi
- [ ] App Store/Play Store açıklamaları hazır
- [ ] Ekran görüntüleri hazır
- [ ] Icon ve splash screen doğru
- [ ] Beta test tamamlandı
- [ ] Kritik bug'lar giderildi

## Faydalı Linkler

- **Sentry Docs:** https://docs.sentry.io/platforms/react-native/
- **Firebase Analytics Docs:** https://rnfirebase.io/analytics/usage
- **React Native Performance:** https://reactnative.dev/docs/performance
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **App Store Connect:** https://appstoreconnect.apple.com/
- **Google Play Console:** https://play.google.com/console/

## Notlar

- Development modunda tüm servisler mock olarak çalışır
- Production modunda gerçek servislere bağlanır
- Test cihazlarında production build test etmeyi unutma
- Beta test feedback'lerini ciddiye al
- İlk versiyonda mükemmel olmak zorunda değilsin, güncelleme yapabilirsin

**Başarılar! 🚀**
