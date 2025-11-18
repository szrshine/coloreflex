# ColorDrop - Tam Hazırlıklı Yayın Checklist

## 📋 Genel Bakış

Bu checklist, ColorDrop oyununun App Store ve Google Play'e tam özelliklerle yayınlanması için gereken **tüm adımları** içerir. Hiçbir şey eksik kalmadan, profesyonel ve kullanıcı dostu bir oyun yayınlayacaksınız.

**Tahmini Süre:** 10-14 gün (tam zamanlı çalışma)

---

## 🎯 FAZ 1: TEKNİK ALTYAPI (1 Gün)

### 1.1 Uygulama Tanımlayıcıları
- [x] `app.json` içinde `bundleIdentifier` var: `com.szrgame.colordrop` ✅
- [x] `app.json` içinde `package` var: `com.szrgame.colordrop` ✅
- [x] Package name benzersiz ve değişmeyecek ✅

### 1.2 Uygulama Versiyonlama
- [x] `app.json` içinde `version`: "1.0.0" ✅
- [x] `app.json` içinde `versionCode`: 1 (Android) ✅
- [x] `app.json` içinde `buildNumber`: "1" (iOS) ✅
- [ ] Version politikası belirle (Major.Minor.Patch formatı)

### 1.3 Meta Bilgiler
- [ ] `app.json` içine `description` ekle (170 karakter max)
- [ ] Privacy Policy URL hazır ve erişilebilir
- [ ] Terms of Service URL hazır ve erişilebilir
- [ ] Support email adresi belirlendi
- [ ] App Store kategorisi: Games > Puzzle
- [ ] Yaş sınırlaması: 4+ (PEGI 3 / ESRB Everyone)

**Zaman:** 2 saat

---

## 📜 FAZ 2: YASAL GEREKSİNİMLER (1 Gün)

### 2.1 Gizlilik Politikası (Privacy Policy)
- [x] Privacy Policy metni mevcut: `assets/legal/privacy-policy.md` ✅
- [ ] GitHub Pages veya web sitesinde yayınla
- [ ] URL'i test et (erişilebilir mi?)
- [ ] URL'i `app.json` içine ekle
- [ ] Oyun içinden Privacy Policy'e link ekle (Ayarlar menüsü)

### 2.2 Kullanım Şartları (Terms of Service)
- [x] Terms of Service metni mevcut: `assets/legal/terms-of-service.md` ✅
- [ ] GitHub Pages veya web sitesinde yayınla
- [ ] URL'i test et (erişilebilir mi?)
- [ ] Oyun içinden Terms'e link ekle (Ayarlar menüsü)

### 2.3 İletişim ve Destek
- [ ] Destek email adresi oluştur (support@szrgame.com veya kişisel)
- [ ] Email adresini `app.json` ve Store listelerinde kullan
- [ ] Ayarlar menüsünde "İletişim/Destek" butonu ekle
- [ ] Email tıklandığında mail app açılsın (`Linking.openURL`)

**Zaman:** 4 saat

---

## 🎮 FAZ 3: KULLANICI DENEYİMİ (3 Gün)

### 3.1 İlk Açılış Deneyimi (Tutorial/Onboarding)
- [ ] Tutorial ekranı tasarla (3-4 slide)
- [ ] Tutorial içeriği:
  - [ ] Slide 1: Hoş geldin mesajı + oyun logosu
  - [ ] Slide 2: Oyun mekaniği açıklaması (toplar düşer, renk eşle)
  - [ ] Slide 3: Skor sistemi ve canlara açıklama
  - [ ] Slide 4: "Başla!" butonu
- [ ] Tutorial gösterildi mi kontrolü (AsyncStorage: `tutorial_completed`)
- [ ] Tutorial skip butonu ekle
- [ ] Ayarlar menüsünden "Tutorial'ı Tekrar Göster" seçeneği

**Kontrol:**
```javascript
// İlk açılışta tutorial göster
const isTutorialCompleted = await AsyncStorage.getItem('tutorial_completed');
if (!isTutorialCompleted) {
  showTutorial();
}
```

### 3.2 Ses Efektleri ve Müzik
- [ ] **Ses efektleri indir/oluştur:**
  - [ ] Doğru eşleşme sesi (pozitif, ödüllendirici)
  - [ ] Yanlış eşleşme sesi (negatif, uyarıcı)
  - [ ] Düğme tıklama sesi (menü butonları)
  - [ ] Oyun başlangıç sesi
  - [ ] Yeni rekor sesi (kutlama)
  - [ ] Power-up kullanım sesleri (3 adet)
  - [ ] Başarım kilidi açma sesi
- [ ] **Müzikler indir/oluştur:**
  - [ ] Ana menü background müziği (sakin, loop)
  - [ ] Oyun içi müzik (tempo yüksek, loop)
- [ ] Ses kaynağı: Freesound.org, OpenGameArt.org, Zapsplat
- [ ] Dosya formatı: MP3 veya OGG (küçük boyut)
- [ ] `assets/sounds/` klasörüne ekle
- [ ] `expo-av` kütüphanesi ile entegre et
- [ ] **Ayarlar menüsü ekle:**
  - [ ] Ses efektleri on/off toggle
  - [ ] Müzik on/off toggle
  - [ ] Volume slider (opsiyonel)
- [ ] Ayarları AsyncStorage'da sakla
- [ ] Oyun boyunca ses tercihleri uygulanıyor

**Dosya yapısı:**
```
assets/
  sounds/
    effects/
      correct.mp3
      wrong.mp3
      button.mp3
      game_start.mp3
      new_record.mp3
      powerup_slowmo.mp3
      powerup_shield.mp3
      powerup_freeze.mp3
      achievement.mp3
    music/
      menu_theme.mp3
      game_theme.mp3
```

### 3.3 Haptic Feedback (Titreşim)
- [ ] `expo-haptics` kütüphanesini yükle: `npx expo install expo-haptics`
- [ ] Haptic feedback ekle:
  - [ ] Doğru eşleşme: hafif başarı titreşimi
  - [ ] Yanlış eşleşme: orta şiddetli uyarı titreşimi
  - [ ] Düğme tıklamalar: çok hafif titreşim
  - [ ] Yeni rekor: uzun kutlama titreşimi
  - [ ] Başarım kilidi açma: orta titreşim
- [ ] Ayarlar menüsünde haptic feedback on/off toggle
- [ ] Ayarları AsyncStorage'da sakla

**Kod örneği:**
```javascript
import * as Haptics from 'expo-haptics';

// Doğru eşleşme
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Yanlış eşleşme
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
```

### 3.4 Görsel İyileştirmeler
- [ ] **Parçacık efektleri ekle:**
  - [ ] Doğru eşleşmede konfeti/patlama efekti
  - [ ] Yanlış eşleşmede kırmızı titreşim efekti
  - [ ] Yeni rekor anında parlama/yıldız efekti
- [ ] Skor artarken animasyon (sayı büyüyüp küçülsün)
- [ ] Loading ekranı ekle (oyun başlarken)
- [ ] Smooth transitions (ekranlar arası yumuşak geçişler)
- [ ] High score kırıldığında özel animasyon

**Zaman:** 2 gün

---

## 🏆 FAZ 4: OYUN İÇİ ÖZELLİKLER (3 Gün)

### 4.1 Ayarlar Menüsü
- [ ] Ayarlar butonu ekle (ana menüde dişli ikonu)
- [ ] Ayarlar ekranı oluştur
- [ ] **Ayarlar içeriği:**
  - [ ] Ses efektleri on/off toggle
  - [ ] Müzik on/off toggle
  - [ ] Haptic feedback on/off toggle
  - [ ] Tutorial'ı tekrar göster butonu
  - [ ] İstatistikler bölümü (toplam oyun, toplam skor)
  - [ ] Hakkında (version, developer info)
  - [ ] Gizlilik Politikası linki (tarayıcıda aç)
  - [ ] Kullanım Şartları linki (tarayıcıda aç)
  - [ ] İletişim butonu (email app aç)
  - [ ] Skorları sıfırla butonu (confirm dialog ile)
- [ ] Tüm ayarlar AsyncStorage'da saklanıyor
- [ ] Ayarlar değiştiğinde anında uygulanıyor

### 4.2 Başarımlar Sistemi (Achievements)
- [x] Başarım listesi mevcut: `src/constants/achievements.js` ✅
- [x] Başarım servisi mevcut: `src/services/achievements.js` ✅
- [ ] **Başarım kontrollerini oyuna entegre et:**
  - [ ] Her oyun bittiğinde başarımları kontrol et
  - [ ] Doğru zamanlarda başarım unlock et
- [ ] **Başarım toast notification:**
  - [ ] Başarım kazanıldığında ekranda popup göster
  - [ ] Popup'ta başarım ikonu, başlık ve açıklama
  - [ ] 3 saniye sonra otomatik kapansın
  - [ ] Ses efekti ve haptic feedback
- [ ] **Ana menüde başarımlar bölümü:**
  - [ ] Başarımlar ikonu/butonu ekle
  - [ ] Tüm başarımları listele (kilitsiz/kilitli)
  - [ ] Progress bar göster (kaçta kaç)
  - [ ] Kilitli başarımlar soluk görünsün
- [ ] Başarım verileri AsyncStorage'da saklanıyor
- [ ] Test: Tüm başarımlar tetiklenebilir mi?

### 4.3 Günlük Ödüller ve Görevler
- [ ] **Günlük ödüller sistemi:**
  - [ ] Günlük giriş kontrolü (son giriş tarihi kaydedilir)
  - [ ] Streak sistemi (ardışık gün takibi)
  - [ ] 7 günlük ödül takvimi tasarla
  - [ ] Giriş yapınca "Günlük Ödül" popup'ı göster
  - [ ] Ödül: Coin veya power-up
- [ ] **Günlük görevler:**
  - [ ] Her gün 3 basit görev oluştur
  - [ ] Görevler: "5 oyun oyna", "25 puan kazan", "10 doğru eşleşme"
  - [ ] Ana menüde günlük görevler kartı göster
  - [ ] Görev ilerlemesini göster (progress bar)
  - [ ] Görev tamamlanınca ödül ver
  - [ ] Gece yarısı görevleri sıfırla
- [ ] AsyncStorage'da görev durumları saklanıyor
- [ ] Timezone doğru çalışıyor mu test et

### 4.4 İstatistikler ve Profil
- [ ] **Kullanıcı istatistikleri takip et:**
  - [ ] Toplam oynanan oyun sayısı
  - [ ] Toplam puan
  - [ ] Ortalama puan
  - [ ] En yüksek skor
  - [ ] En uzun streak (ardışık doğru eşleşme)
  - [ ] Toplam oyun süresi (dakika cinsinden)
  - [ ] Toplam doğru eşleşme sayısı
  - [ ] Toplam yanlış eşleşme sayısı
  - [ ] Başarı oranı (doğru/toplam)
  - [ ] İlk oyun tarihi
  - [ ] Son oyun tarihi
- [ ] **İstatistikler ekranı:**
  - [ ] Ayarlar menüsünden erişilebilir
  - [ ] İstatistikleri kart/liste olarak göster
  - [ ] Görsel: progress bar veya chart (opsiyonel)
- [ ] İstatistikler AsyncStorage'da saklanıyor
- [ ] Her oyun sonunda istatistikler güncelleniyor

**Zaman:** 2-3 gün

---

## 🌐 FAZ 5: SOSYAL VE REKABET (2 Gün)

### 5.1 Liderlik Tablosu (Leaderboard)
- [x] Leaderboard UI mevcut: `src/screens/LeaderboardScreen.js` ✅
- [x] Leaderboard servisi mevcut: `src/services/leaderboard.js` ✅
- [ ] **Firebase Firestore kurulumu:**
  - [ ] Firebase projesi oluştur (console.firebase.google.com)
  - [ ] Android uygulaması ekle
  - [ ] `google-services.json` indir → `android/app/` klasörüne kopyala
  - [ ] iOS uygulaması ekle
  - [ ] `GoogleService-Info.plist` indir → `ios/` klasörüne kopyala
  - [ ] Paketleri yükle: `npm install @react-native-firebase/app @react-native-firebase/firestore`
  - [ ] `app.json` içine Firebase plugin ekle
  - [ ] `npx expo prebuild` komutu çalıştır
- [ ] **Firestore Rules ayarla:**
  - [ ] Firebase Console > Firestore Database > Rules
  - [ ] Leaderboard collection için read: public, write: authenticated
  - [ ] Rules'ı yayınla
- [ ] **Leaderboard servisini Firebase'e bağla:**
  - [ ] `src/services/leaderboard.js` içindeki Firebase kodlarını aktif et
  - [ ] Mock data fonksiyonunu kaldır
  - [ ] `seedMockData()` çağrısını tamamen SİL
  - [ ] `submitScore()` fonksiyonu Firebase'e skor gönderiyor
  - [ ] `getLeaderboard()` fonksiyonu Firebase'den skorları çekiyor
  - [ ] Offline cache çalışıyor (AsyncStorage fallback)
- [ ] **Firebase Authentication (opsiyonel ama önerilen):**
  - [ ] `npm install @react-native-firebase/auth` yükle
  - [ ] Anonim authentication aktif et
  - [ ] `getUserId()` fonksiyonu Firebase Auth UID döndürüyor
- [ ] **Cloud Functions (opsiyonel):**
  - [ ] `firebase-tools` yükle: `npm install -g firebase-tools`
  - [ ] `firebase init functions` komutu çalıştır
  - [ ] Günlük/haftalık/aylık leaderboard reset fonksiyonları oluştur
  - [ ] `firebase deploy --only functions` ile deploy et
- [ ] **Test:**
  - [ ] Skor gönder, Firebase Console'da görünüyor mu?
  - [ ] Leaderboard'u çek, veriler geliyor mu?
  - [ ] Offline modda cache çalışıyor mu?
  - [ ] Birden fazla cihazdan test et

### 5.2 Arkadaşlarla Paylaşma
- [x] Sharing servisi mevcut: `src/services/sharing.js` ✅
- [ ] **Store linklerini güncelle:**
  - [ ] iOS App Store linki (yayından sonra güncellenecek)
  - [ ] Android Play Store linki: `https://play.google.com/store/apps/details?id=com.szrgame.colordrop`
  - [ ] Şimdilik geçici link koy (GitHub, web sitesi)
- [ ] **Game Over ekranında paylaşım butonu:**
  - [ ] "Paylaş" butonu ekle
  - [ ] Buton tıklanınca share sheet açılsın
  - [ ] Paylaşım metni: "ColorDrop'ta X puan yaptım! Sen de dene!"
  - [ ] Store linki dahil
- [ ] **Screenshot paylaşımı (opsiyonel):**
  - [ ] `react-native-view-shot` yükle
  - [ ] Game Over ekranından screenshot al
  - [ ] Screenshot'u paylaş
- [ ] Test: Paylaşım WhatsApp, Twitter'da çalışıyor mu?

**Zaman:** 2 gün

---

## 📊 FAZ 6: ANALYTİCS VE CRASH REPORTİNG (1 Gün)

### 6.1 Sentry Kurulumu (Crash Reporting)
- [ ] Sentry hesabı oluştur: https://sentry.io/
- [ ] Yeni proje oluştur (React Native)
- [ ] DSN (Data Source Name) kopyala
- [ ] Terminal'de yükle:
  ```bash
  npm install @sentry/react-native
  npx @sentry/wizard -i reactNative -p ios android
  ```
- [ ] `src/services/crashReporting.js` güncelle:
  - [ ] `SENTRY_DSN` değişkenini gerçek DSN ile değiştir
  - [ ] `__DEV__` kontrolü kaldır (production'da aktif olmalı)
  - [ ] Mock Sentry kodlarını kaldır
- [ ] `App.js` içinde Sentry'yi initialize et
- [ ] Error Boundary ekle (tüm uygulamayı saran)
- [ ] Test crash gönder:
  ```javascript
  import { testCrash } from './src/services/crashReporting';
  testCrash(); // Development modunda test et
  ```
- [ ] Sentry Dashboard'da crash göründü mü kontrol et

### 6.2 Firebase Analytics Kurulumu
- [ ] Firebase Console > Analytics aktif et
- [ ] Paketleri yükle: `npm install @react-native-firebase/analytics`
- [ ] `src/services/analytics.js` güncelle:
  - [ ] Firebase Analytics import satırlarını aktif et
  - [ ] Mock analytics kodlarını kaldır
  - [ ] `__DEV__` kontrolü kaldır
- [ ] **Analytics event'lerini entegre et:**
  - [ ] `app_open` - App.js useEffect içinde
  - [ ] `game_start` - Oyun başladığında
  - [ ] `game_over` - Oyun bittiğinde (skor, süre, doğru/yanlış)
  - [ ] `achievement_unlocked` - Başarım kazanıldığında
  - [ ] `tutorial_complete` - Tutorial tamamlandığında
  - [ ] `share` - Paylaşım yapıldığında
  - [ ] `settings_change` - Ayar değiştiğinde
- [ ] **User properties ayarla:**
  - [ ] `total_games_played`
  - [ ] `highest_score`
  - [ ] `tutorial_completed`
  - [ ] `last_login_date`
- [ ] Test: Firebase Console > DebugView'da event'ler görünüyor mu?

### 6.3 Crash Reporting Breadcrumbs
- [ ] Oyun akışına breadcrumb ekle:
  - [ ] `ball_spawned` - Top oluşturulduğunda
  - [ ] `correct_match` - Doğru eşleşme
  - [ ] `wrong_match` - Yanlış eşleşme
  - [ ] `powerup_activated` - Power-up kullanıldığında
- [ ] Kullanıcı aksiyonlarına breadcrumb:
  - [ ] "User clicked start"
  - [ ] "User opened settings"
  - [ ] "User shared score"
- [ ] Breadcrumb'lar Sentry Dashboard'da görünüyor mu?

**Zaman:** 4-6 saat

---

## ⚡ FAZ 7: PERFORMANS OPTİMİZASYONU (1 Gün)

### 7.1 Performans Testi
- [ ] Farklı cihazlarda test:
  - [ ] iPhone SE (küçük ekran, düşük performans)
  - [ ] iPhone 13 (orta ekran, orta performans)
  - [ ] iPhone 14 Plus (büyük ekran, yüksek performans)
  - [ ] iPad (tablet)
  - [ ] Android düşük performanslı cihaz
  - [ ] Android orta performanslı cihaz
  - [ ] Android yüksek performanslı cihaz
- [ ] FPS (Frame Rate) kontrol et:
  - [ ] Oyun 60 FPS'de çalışıyor mu?
  - [ ] Hızlandıkça FPS düşüyor mu?
- [ ] Memory leak kontrolü:
  - [ ] Uzun süre oynarken bellek artıyor mu?
  - [ ] Component unmount sonrası timer'lar temizleniyor mu?

### 7.2 Responsive Design Testi
- [ ] **Ekran boyutları test et:**
  - [ ] iPhone SE (375 x 667) - SMALL
  - [ ] iPhone 13 (390 x 844) - MEDIUM
  - [ ] iPhone 14 Plus (428 x 926) - LARGE
  - [ ] iPad Pro (1024 x 1366) - XLARGE
  - [ ] Android Small (360 x 640)
  - [ ] Android Large (412 x 915)
- [ ] **Kontroller:**
  - [ ] Toplar ekrana sığıyor mu?
  - [ ] Butonlar dokunulabilir boyutta mı? (min 44x44)
  - [ ] Textler okunabilir mi?
  - [ ] Safe area doğru çalışıyor mu?
  - [ ] Notch/Dynamic Island ile sorun var mı?
  - [ ] Landscape mode devre dışı mı? (app.json'da orientation: "portrait")

### 7.3 Performance Metrikleri (Kritik!)
- [ ] **FPS (Frame Rate) Kontrolü:**
  - [ ] Oyun 60 FPS'de çalışıyor mu?
  - [ ] React Native Debugger ile FPS monitor aç
  - [ ] Hızlandıkça FPS düşüyor mu? (45+ FPS altına düşmemeli)
  - [ ] Düşük performanslı cihazda test et (en az 30 FPS)
- [ ] **Memory (Bellek) Kontrolü:**
  - [ ] Memory leak var mı?
  - [ ] Uzun süre oynarken bellek artıyor mu?
  - [ ] Component unmount sonrası timer'lar temizleniyor mu?
  - [ ] Xcode Instruments veya Android Profiler ile test et
  - [ ] Hedef: <150MB RAM kullanımı
- [ ] **Battery (Pil) Kullanımı:**
  - [ ] 30 dakika oyunda pilden ne kadar gidiyor?
  - [ ] Aşırı ısınma var mı?
  - [ ] Background'da pil tüketiyor mu? (olmamalı)
  - [ ] Hedef: 30 dakikada %10'dan az
- [ ] **App Size (Boyut):**
  - [ ] iOS IPA boyutu ne kadar? (Hedef: <50MB, Max: 100MB)
  - [ ] Android AAB boyutu ne kadar? (Hedef: <30MB, Max: 100MB)
  - [ ] Asset'ler optimize edilmiş mi?
  - [ ] Gereksiz kütüphaneler kaldırıldı mı?

### 7.4 Code Cleanup
- [ ] Tüm `console.log` satırlarını kaldır (veya production'da disable et)
- [ ] TODO yorumlarını kontrol et, tamamlanmamış varsa tamamla
- [ ] Test kodlarını kaldır
- [ ] Kullanılmayan import'ları temizle
- [ ] Kullanılmayan state'leri/değişkenleri kaldır
- [ ] Dead code'ları temizle
- [ ] ESLint hatalarını düzelt

### 7.5 Bundle Size Optimizasyonu
- [ ] Bundle analyzer yükle: `npm install --save-dev react-native-bundle-visualizer`
- [ ] Analiz et: `npx react-native-bundle-visualizer`
- [ ] Büyük kütüphaneleri alternatiflerle değiştir (varsa)
- [ ] Kullanılmayan kütüphaneleri kaldır
- [ ] Asset'leri optimize et (görsel boyutlarını küçült)

**Zaman:** 4-6 saat

---

## 🏪 FAZ 8: STORE HAZIRLIKLARI (3 Gün)

### 8.1 Apple Developer Hesabı (iOS)
- [ ] Apple Developer hesabı oluştur ($99/yıl)
- [ ] https://developer.apple.com/programs/ adresine git
- [ ] "Enroll" butonuna tıkla
- [ ] Bireysel veya şirket hesabı seç
- [ ] Ödeme yap ($99/yıl)
- [ ] Onay bekle (1-2 gün)
- [ ] **Banking Information (Gelir için - ÖNEMLİ):**
  - [ ] App Store Connect > Agreements, Tax, and Banking
  - [ ] Paid Apps Agreement'i kabul et
  - [ ] Tax forms doldur (ABD vergi bilgileri)
  - [ ] Banking information ekle (hesap numarası, SWIFT/IBAN)
  - [ ] Onay bekle (birkaç gün sürebilir)
  - [ ] Not: Bu adım tamamlanmadan gelir alamazsın!

### 8.2 App Store Connect Hazırlığı
- [ ] https://appstoreconnect.apple.com/ adresine git
- [ ] "My Apps" > "+" > "New App" tıkla
- [ ] **Uygulama bilgileri:**
  - [ ] Platform: iOS
  - [ ] Name: ColorDrop
  - [ ] Primary Language: English (U.S.)
  - [ ] Bundle ID: com.szrgame.colordrop
  - [ ] SKU: colordrop-001
- [ ] **App Information:**
  - [ ] Name: ColorDrop
  - [ ] Subtitle: Fast Color Matching Game
  - [ ] Category: Games > Puzzle
  - [ ] Secondary Category: Games > Arcade
  - [ ] Privacy Policy URL: [GitHub Pages veya web sitesi]
  - [ ] Support URL: https://github.com/szrshine/ColorDrop
- [ ] **Age Rating:**
  - [ ] Şiddet: Yok
  - [ ] Cinsel İçerik: Yok
  - [ ] Küfür: Yok
  - [ ] Kumar: Yok
  - [ ] Sonuç: 4+
- [ ] **Description (4000 char max):**
  - [ ] İlk 2 cümle çekici olsun (en önemli!)
  - [ ] Oyun mekaniğini açıkla
  - [ ] Özellikleri listele (bullet points)
  - [ ] Anahtar kelimeleri doğal olarak yerleştir
  - [ ] Call-to-action ekle
- [ ] **Keywords (100 char, virgülle ayrılmış):**
  - [ ] Örnek: color,match,puzzle,casual,game,reflex,brain,quick,drop,arcade,fun
- [ ] **Promotional Text (170 char, güncellenebilir):**
  - [ ] Örnek: "Match colors, beat your high score! Power-ups, daily challenges, and global leaderboards!"
- [ ] **What's New in Version 1.0.0:**
  - [ ] İlk sürüm açıklaması yaz

### 8.3 Google Play Console Hesabı (Android)
- [ ] Google Play Console hesabı oluştur ($25 tek seferlik)
- [ ] https://play.google.com/console adresine git
- [ ] "Create Account" tıkla
- [ ] Developer hesap türü seç (Individual veya Organization)
- [ ] $25 kayıt ücretini öde
- [ ] Hesap onayını bekle (birkaç saat - 1 gün)
- [ ] **Payment Profile (Gelir için - ÖNEMLİ):**
  - [ ] Play Console > Payments profile
  - [ ] Banka hesap bilgilerini ekle
  - [ ] Vergi bilgilerini doldur
  - [ ] Onay bekle
  - [ ] Not: Bu adım tamamlanmadan gelir alamazsın!

### 8.4 Play Console Hazırlığı
- [ ] Play Console'a giriş yap
- [ ] "Create app" butonuna tıkla
- [ ] **Uygulama bilgileri:**
  - [ ] App name: ColorDrop
  - [ ] Default language: English (United States)
  - [ ] App or game: Game
  - [ ] Free or paid: Free
  - [ ] Declarations: Tüm kutuları işaretle
- [ ] **Store Listing:**
  - [ ] App name: ColorDrop
  - [ ] Short description (80 char): "Fast-paced color matching puzzle game!"
  - [ ] Full description (4000 char): FAZ_8_TODO_PRODUCTION.md'den kopyala
  - [ ] App category: Games > Puzzle
  - [ ] Tags: casual, color, match, puzzle, arcade
  - [ ] Contact email: support@szrgame.com (veya kişisel)
  - [ ] Website: https://github.com/szrshine/ColorDrop
  - [ ] Privacy Policy URL: [GitHub Pages veya web sitesi]
- [ ] **Content Rating (IARC Questionnaire):**
  - [ ] Category: Games
  - [ ] Şiddet: Hayır
  - [ ] Cinsel İçerik: Hayır
  - [ ] Küfür: Hayır
  - [ ] Alkol/Uyuşturucu: Hayır
  - [ ] Kumar: Hayır
  - [ ] Kullanıcı etkileşimi: Evet (leaderboard)
  - [ ] Reklam: Evet (AdMob - ileride eklenecek)
  - [ ] Sonuç: PEGI 3 / ESRB Everyone
- [ ] **Data Safety:**
  - [ ] Veri toplama: Evet
  - [ ] Toplanan veriler: Device ID, App activity
  - [ ] Veri şifreleniyor: Evet
  - [ ] Kullanıcı veri silebilir: Evet
  - [ ] Veri kullanımı: Analytics, Advertising
  - [ ] Privacy Policy URL ekle
- [ ] **Play App Signing (ÖNERİLEN - Google tarafından öneriliyor):**
  - [ ] Play Console > Setup > App signing
  - [ ] "Use Google Play App Signing" seç
  - [ ] Google keystore'u otomatik yönetir
  - [ ] Upload key'i sen oluşturursun, Google release key'i yönetir
  - [ ] Avantaj: Keystore kaybetsen bile güncelleme yapabilirsin
  - [ ] Not: Bir kez aktif edersen geri alamazsın, ama çok önerilir!

### 8.5 Yasal Uyumluluk (COPPA, GDPR)
- [ ] **COPPA Compliance (Çocuk Gizliliği - ABD Yasası):**
  - [ ] Oyunun hedef kitlesi 13 yaş altını içeriyor mu? → Hayır (4+ ama genel kitle)
  - [ ] 13 yaş altından veri toplanıyor mu? → Minimal (sadece cihaz ID, analytics)
  - [ ] AdMob'da "Family-friendly ads" aktif mi? → Evet (ayarlanacak)
  - [ ] Privacy Policy'de çocuk gizliliği belirtilmiş mi? → Evet
- [ ] **GDPR Compliance (Avrupa Veri Koruma Yasası):**
  - [ ] Privacy Policy'de GDPR hakları belirtilmiş mi? (erişim, silme, düzeltme)
  - [ ] Kullanıcı verilerini silebiliyor mu? → Evet (local data, Firebase'den istek ile)
  - [ ] Veri işleme şeffaf mı? → Evet (policy'de açıklanmış)
  - [ ] AB ülkelerinde yayınlanacak mı? → Evet (worldwide)
  - [ ] Cookie consent gerekli mi? → Hayır (native app, web değil)
- [ ] **Genel Compliance:**
  - [ ] Telif hakkı ihlali yok (müzik, ses, görsel)
  - [ ] Uygunsuz içerik yok
  - [ ] Yaş sınırlaması doğru (4+)
  - [ ] Reklamlar yaş sınırına uygun

### 8.6 Ekran Görüntüleri Oluşturma
- [ ] **iOS Screenshots (6-10 adet):**
  - [ ] 6.7" iPhone (1290 x 2796) - ZORUNLU
  - [ ] 6.5" iPhone (1242 x 2688) - ZORUNLU
  - [ ] 5.5" iPhone (1242 x 2208) - ZORUNLU
  - [ ] iPad Pro (2048 x 2732) - Opsiyonel
- [ ] **Android Screenshots (minimum 2, max 8):**
  - [ ] Phone screenshots (min 320px, max 3840px)
  - [ ] 7" Tablet (opsiyonel)
  - [ ] 10" Tablet (opsiyonel)
- [ ] **Screenshot içerikleri:**
  1. Ana menü - "Welcome to ColorDrop!"
  2. Gameplay - "Match Falling Colors"
  3. Combo/Streak - "Build Combos!"
  4. Leaderboard - "Compete Globally"
  5. Başarımlar - "Unlock Achievements"
  6. Power-ups - "Use Power-ups"
  7. Skinler - "Customize Your Game"
  8. Game Over - "Beat Your High Score!"
- [ ] Screenshot'lara text overlay ekle (özellik açıklamaları)
- [ ] Figma veya Canva ile tasarla
- [ ] Tutarlı renk şeması ve font kullan

### 8.6 Grafik Varlıklar
- [ ] **App Icon (her iki platform):**
  - [ ] 1024 x 1024 PNG (Alpha yok)
  - [ ] Basit, tanınabilir tasarım
  - [ ] Küçük boyutta okunabilir
- [ ] **Feature Graphic (Android - ÖNEMLİ):**
  - [ ] 1024 x 500 JPG veya PNG
  - [ ] "ColorDrop" büyük font
  - [ ] Renkli gradient background
  - [ ] Falling balls görseli
  - [ ] "Download Now" call-to-action
- [ ] **Splash Screen:**
  - [ ] Logo ortada
  - [ ] Brand renklerini kullan
  - [ ] `app.json` içinde splash konfigürasyonu doğru

### 8.7 Rollout Stratejisi (Android)
- [ ] **Yayın stratejisi belirle:**
  - [ ] **100% Rollout (Önerilen ilk yayın için):** Herkese aynı anda yayınla
  - [ ] **Staged Rollout (İleride güncellemeler için):**
    - [ ] %10 → 1 gün bekle → sorun yoksa %50 → 1 gün → %100
    - [ ] Büyük hataları erken tespit etmeye yarar
    - [ ] İlk yayın için gerek yok, ama 2. güncellemeden itibaren kullan
- [ ] **A/B Testing (İleride):**
  - [ ] Play Console'da A/B test özelliği var
  - [ ] Farklı icon, screenshot, description test edebilirsin
  - [ ] İlk yayından sonra kullan

### 8.8 App Preview Video (Opsiyonel ama Önerilen)
- [ ] 15-30 saniye gameplay kaydı
- [ ] İlk 3 saniye en çekici olmalı
- [ ] Background müzik ekle (telif hakkı olmayan)
- [ ] Text overlay: "ColorDrop" + "Download Now"
- [ ] OBS Studio veya QuickTime ile kaydet
- [ ] DaVinci Resolve veya iMovie ile düzenle
- [ ] YouTube'a unlisted olarak yükle (Android için)
- [ ] iOS için MP4/M4V formatında hazırla
- [ ] App Store Connect ve Play Console'a yükle

### 8.9 ASO (App Store Optimization)
- [ ] **Keyword araştırması yap:**
  - [ ] Rakip oyunları incele (Color Switch, Ballz, Stack Ball)
  - [ ] Popüler anahtar kelimeleri belirle
  - [ ] App Annie, Sensor Tower veya Mobile Action kullan
- [ ] **Primary Keywords:**
  - color match, puzzle game, color game, casual game
  - reflex game, brain game, quick game, arcade game
- [ ] **Long-tail Keywords:**
  - color matching puzzle, fast paced puzzle
  - addictive color game, quick casual game
- [ ] Anahtar kelimeleri description'da doğal olarak kullan
- [ ] Title'da primary keyword kullan (Play Store)

**Zaman:** 3 gün

---

## 🔨 FAZ 9: BUİLD VE TEST (2 Gün)

### 9.1 Production Build Hazırlığı
- [ ] **Ortam değişkenleri ayarla:**
  - [ ] Development/production ortamlarını ayır
  - [ ] Test reklam ID'lerini gerçekleriyle değiştir (ileride)
  - [ ] API key'lerini production'a göre ayarla
  - [ ] Debug modu kapat
  - [ ] `console.log` disable et (production'da)
- [ ] **app.json son kontroller:**
  - [ ] Version: 1.0.0
  - [ ] versionCode: 1 (Android)
  - [ ] buildNumber: "1" (iOS)
  - [ ] bundleIdentifier: com.szrgame.colordrop
  - [ ] package: com.szrgame.colordrop
  - [ ] Icon path doğru
  - [ ] Splash screen path doğru
  - [ ] orientation: "portrait"
  - [ ] Privacy Policy URL var
  - [ ] Terms of Service URL var (opsiyonel)
- [ ] **Code signing hazırlığı:**
  - [ ] iOS: Signing Certificate ve Provisioning Profile (EAS Build otomatik halleder)
  - [ ] Android: Keystore oluştur (EAS Build otomatik halleder veya manuel oluştur)
  - [ ] Keystore şifresini kaydet (GÜVENLE SAKLA!)

### 9.2 EAS Build Kurulumu
- [ ] EAS hesabı oluştur: https://expo.dev/
- [ ] `npm install -g eas-cli` yükle
- [ ] `eas login` ile giriş yap
- [ ] `eas build:configure` komutu çalıştır
- [ ] `eas.json` dosyası oluşturuldu
- [ ] `eas.json` içinde production profili var

### 9.3 iOS Build
- [ ] `eas build --platform ios --profile production` komutu çalıştır
- [ ] Build tamamlanmasını bekle (20-30 dakika)
- [ ] IPA dosyasını indir
- [ ] **TestFlight'a yükle:**
  - [ ] Transporter uygulamasını aç (Mac App Store'dan indir)
  - [ ] IPA dosyasını Transporter'a sürükle
  - [ ] "Deliver" butonuna tıkla
  - [ ] Yükleme tamamlanmasını bekle
- [ ] **TestFlight Beta Test:**
  - [ ] App Store Connect > TestFlight > Internal Testing
  - [ ] Test kullanıcıları ekle (5-10 kişi)
  - [ ] Davet gönder
  - [ ] 2-3 gün test ettir
  - [ ] Kritik bug var mı kontrol et
  - [ ] Feedback topla ve düzelt

### 9.4 Android Build
- [ ] `eas build --platform android --profile production` komutu çalıştır
- [ ] Build tamamlanmasını bekle (20-30 dakika)
- [ ] AAB (Android App Bundle) dosyasını indir
- [ ] **Play Console'a yükle:**
  - [ ] Play Console > ColorDrop > Production > Create new release
  - [ ] AAB dosyasını yükle
  - [ ] Release notes yaz
  - [ ] "Save" tıkla (henüz yayınlama)
- [ ] **Internal Testing:**
  - [ ] Play Console > Testing > Internal testing
  - [ ] AAB dosyasını yükle
  - [ ] Test kullanıcıları ekle
  - [ ] 2-3 gün test ettir
  - [ ] Kritik bug var mı kontrol et
  - [ ] Feedback topla ve düzelt

### 9.5 Son Testler
- [ ] **Her iki platformda test et:**
  - [ ] Uygulama açılıyor mu?
  - [ ] Tutorial gösteriliyor mu?
  - [ ] Oyun oynayabiliyor musun?
  - [ ] Ses efektleri çalışıyor mu?
  - [ ] Haptic feedback çalışıyor mu?
  - [ ] Başarımlar tetikleniyor mu?
  - [ ] Leaderboard skorları gönderiyor/çekiyor mu?
  - [ ] Paylaşım çalışıyor mu?
  - [ ] Ayarlar kaydediliyor mu?
  - [ ] İstatistikler güncelleniyor mu?
  - [ ] Crash olmuyor mu?
- [ ] **Sentry'de crash göründü mü?**
  - [ ] Sentry Dashboard > Issues
  - [ ] Test crash gönder, görünüyor mu?
- [ ] **Firebase Analytics event'ler gönderiliyor mu?**
  - [ ] Firebase Console > Analytics > DebugView
  - [ ] Event'leri tetikle, görünüyor mu?

**Zaman:** 1-2 gün

---

## 🚀 FAZ 10: STORE YAYIN (1 Gün)

### 10.1 iOS Yayın
- [ ] **App Store Connect'te son kontroller:**
  - [ ] Tüm metadata tamamlandı mı?
  - [ ] Screenshots yüklendi mi?
  - [ ] Icon yüklendi mi?
  - [ ] Privacy Policy URL var mı?
  - [ ] Age rating tamamlandı mı?
  - [ ] Build seçildi mi? (TestFlight'tan)
- [ ] **Submit for Review:**
  - [ ] App Store Connect > Uygulamana git
  - [ ] "Submit for Review" butonuna tıkla
  - [ ] İnceleme bilgilerini doldur
  - [ ] "Submit" tıkla
- [ ] **Bekleme:**
  - [ ] İnceleme süresi: 1-3 gün (ortalama 24 saat)
  - [ ] Durum: "Waiting for Review" → "In Review" → "Ready for Sale"
  - [ ] Her gün kontrol et
- [ ] **Reddedilirse:**
  - [ ] Red sebebini oku
  - [ ] Gerekli düzeltmeleri yap
  - [ ] Yeni build yükle
  - [ ] Yeniden gönder

### 10.2 Android Yayın
- [ ] **Play Console'da son kontroller:**
  - [ ] Store listing tamamlandı mı?
  - [ ] Screenshots yüklendi mi?
  - [ ] Feature graphic yüklendi mi?
  - [ ] Content rating tamamlandı mı?
  - [ ] Data safety tamamlandı mı?
  - [ ] Privacy Policy URL var mı?
- [ ] **Production'a Yayınla:**
  - [ ] Play Console > Production > Create new release
  - [ ] AAB dosyasını yükle (Internal Testing'den kopyalanabilir)
  - [ ] Release notes yaz (English)
  - [ ] "Review release" tıkla
  - [ ] "Start rollout to Production" tıkla
- [ ] **Bekleme:**
  - [ ] İnceleme süresi: Birkaç saat - 2 gün
  - [ ] İlk yayında biraz uzun sürebilir
  - [ ] Onaylandıktan sonra birkaç saat içinde Store'da görünür
  - [ ] Her gün kontrol et
- [ ] **Reddedilirse:**
  - [ ] Red sebebini oku
  - [ ] Gerekli düzeltmeleri yap
  - [ ] Yeni AAB yükle
  - [ ] Yeniden gönder

### 10.3 Yayın Sonrası İlk Kontroller
- [ ] **Her iki Store'da görünürlük:**
  - [ ] App Store'da "ColorDrop" ara, çıkıyor mu?
  - [ ] Play Store'da "ColorDrop" ara, çıkıyor mu?
  - [ ] Store sayfası düzgün görünüyor mu?
  - [ ] Screenshots doğru gösteriliyor mu?
  - [ ] Description okunabilir mi?
- [ ] **İlk indirme testi:**
  - [ ] Farklı bir cihazdan indir
  - [ ] Uygulama açılıyor mu?
  - [ ] Crash olmuyor mu?
  - [ ] Tutorial gösteriliyor mu?
  - [ ] Oyun oynayabiliyor musun?
- [ ] **Monitoring:**
  - [ ] Sentry Dashboard aç (crash takibi)
  - [ ] Firebase Analytics aç (kullanıcı takibi)
  - [ ] App Store Connect / Play Console metrikleri kontrol et
  - [ ] İlk yorumları bekle ve cevapla

**Zaman:** 4-6 saat (bekleme hariç)

---

## 📢 FAZ 11: YAYIN SONRASI İLK ADIMLAR (1 Hafta)

### 11.1 İlk Gün (Launch Day)
- [ ] **Duyuru yap:**
  - [ ] Arkadaşlara ve aileye haber ver
  - [ ] Sosyal medyada paylaş (Twitter, Instagram, Facebook)
  - [ ] Store linklerini paylaş
  - [ ] "Oyunum yayınlandı!" postası
- [ ] **İlk 24 saatte takip:**
  - [ ] Kaç indirme oldu?
  - [ ] Crash var mı? (Sentry kontrol)
  - [ ] Kullanıcı yorumu geldi mi?
  - [ ] Analytics verileri akıyor mu?

### 11.2 İlk Hafta
- [ ] **Günlük takip:**
  - [ ] Günlük indirme sayısı
  - [ ] Crash raporları (Sentry)
  - [ ] Analytics verileri (Firebase)
    - [ ] DAU (Daily Active Users)
    - [ ] Session süreleri
    - [ ] Retention (D1, D3, D7)
  - [ ] Kullanıcı yorumlarına cevap ver (aynı gün içinde)
  - [ ] Store ranking'i kontrol et
- [ ] **Kritik bug varsa:**
  - [ ] Hemen düzelt
  - [ ] Version 1.0.1 olarak yeni build çıkar
  - [ ] "Bug fix" güncelleme yayınla
  - [ ] Kullanıcılara duyur
- [ ] **İlk feedback topla:**
  - [ ] Kullanıcı yorumlarını oku
  - [ ] Sık istenen özellikler neler?
  - [ ] En çok şikayet edilen şeyler neler?
  - [ ] Liste yap (gelecek güncellemeler için)

### 11.3 Organik Tanıtım
- [ ] **Sosyal medya:**
  - [ ] Reddit: r/androidgaming, r/iosgaming, r/indiegames
  - [ ] Twitter/X: #indiegame #mobilegame #ColorDrop
  - [ ] Instagram: Gameplay videolarını paylaş
  - [ ] TikTok: Kısa form videolar oluştur
- [ ] **İçerik oluştur:**
  - [ ] Gameplay videosu çek (YouTube)
  - [ ] GIF'ler oluştur (Twitter için)
  - [ ] Blog yazısı yaz (geliştirme hikayesi)
- [ ] **Topluluklar:**
  - [ ] Indie game forumlarında tanıt
  - [ ] Discord sunucuları (gaming communities)
  - [ ] ProductHunt'a yükle (launch day stratejisi)

### 11.4 Success Metrics Takibi
- [ ] **Downloads & Users:**
  - [ ] Total downloads (iOS + Android) - Hedef: İlk hafta 100+
  - [ ] Daily Active Users (DAU) - Günlük aktif kullanıcı
  - [ ] Monthly Active Users (MAU) - Aylık aktif kullanıcı
  - [ ] DAU/MAU ratio - Engagement oranı (Hedef: >%20)
  - [ ] User retention:
    - [ ] D1 (Day 1): %40+ olmalı (ilk gün geri dönüş)
    - [ ] D7 (Day 7): %15+ olmalı (7. gün geri dönüş)
    - [ ] D30 (Day 30): %5+ olmalı (30. gün geri dönüş)
- [ ] **Engagement Metrikleri:**
  - [ ] Average session length - Ortalama oturum süresi (Hedef: 3+ dakika)
  - [ ] Sessions per user - Kullanıcı başına oturum (Hedef: 2+ per gün)
  - [ ] Games played per session - Oturum başına oyun sayısı
  - [ ] Progression - Başarım kilidi açma oranı
- [ ] **Monetizasyon (İleride):**
  - [ ] Ad impressions - Reklam gösterimi
  - [ ] Ad click-through rate (CTR) - Tıklama oranı (Hedef: %1-2)
  - [ ] eCPM - Bin gösterim başına kazanç (Hedef: $1-5)
  - [ ] IAP conversion rate - Satın alma oranı (Hedef: %2-5)
  - [ ] ARPU (Average Revenue Per User) - Kullanıcı başına ortalama gelir
  - [ ] ARPPU (Average Revenue Per Paying User) - Ödeme yapan kullanıcı başına gelir
- [ ] **Kalite Metrikleri:**
  - [ ] Crash-free users - Çökme olmayan kullanıcı (Hedef: >%99)
  - [ ] App rating - Uygulama puanı (Hedef: >4.0)
  - [ ] Number of reviews - Yorum sayısı
  - [ ] Common feedback themes - Sık tekrarlanan geri bildirimler
- [ ] **ASO Performance:**
  - [ ] Keyword rankings - Anahtar kelime sıralamaları
  - [ ] Impression to install conversion - Görüntülemeden indirmeye dönüşüm (Hedef: >%15)
  - [ ] Search vs. browse traffic - Arama vs. gezinme trafiği oranı
  - [ ] Featured placements - Öne çıkarılma (eğer varsa)

**Zaman:** Sürekli (ilk hafta yoğun)

---

## 🚨 TROUBLESHOOTING: SIK RED SEBEPLERİ VE ÇÖZÜMLER

### Apple App Store Ret Sebepleri

#### 1. Guideline 2.1 - Performance (Crash/Bug)
**Sebep:** Uygulama çöküyor veya düzgün çalışmıyor
**Çözüm:**
- [ ] Crash'in tam sebebini bul (Apple log gönderir)
- [ ] Sentry'de crash görünüyor mu kontrol et
- [ ] Aynı cihaz/iOS versiyonunda test et
- [ ] Düzelt, yeni build yükle, tekrar gönder

#### 2. Guideline 4.3 - Spam
**Sebep:** Benzer oyunlara çok benzediği düşünülüyor
**Çözüm:**
- [ ] Description'da unique özelliklerini vurgula
- [ ] Screenshot'larda farklı gameplay göster
- [ ] "What makes this different" bölümü ekle
- [ ] Reviewer notes'a farklılıkları yaz

#### 3. Guideline 5.1.1 - Privacy
**Sebep:** Privacy Policy eksik veya yetersiz
**Çözüm:**
- [ ] Privacy Policy URL'i çalışıyor mu kontrol et
- [ ] Tüm veri toplama yöntemlerini kapsıyor mu?
- [ ] AdMob ve Firebase Analytics belirtilmiş mi?
- [ ] İletişim bilgileri var mı?
- [ ] Güncelle, yeni URL ekle, tekrar gönder

#### 4. Guideline 2.3.1 - Accurate Metadata
**Sebep:** Screenshot'lar veya description yanıltıcı
**Çözüm:**
- [ ] Screenshot'lar gerçek gameplay gösteriyor mu?
- [ ] Description'da olmayan özellik belirtilmiş mi?
- [ ] Düzelt ve tekrar gönder

### Google Play Store Ret Sebepleri

#### 1. Inappropriate Content
**Sebep:** Reklamlar uygunsuz içerik gösteriyor
**Çözüm:**
- [ ] AdMob > Settings > Family-friendly ads aktif et
- [ ] Ad filtering'i en yüksek seviyede tut
- [ ] Test et, uygunsuz reklam görünüyor mu?
- [ ] Yeni build yükle

#### 2. Deceptive Behavior
**Sebep:** Misleading screenshots veya description
**Çözüm:**
- [ ] Screenshot'ların gerçek gameplay olduğunu belirt
- [ ] Abartılı ifadeler varsa düzelt
- [ ] Store listing'i güncelle
- [ ] Yeniden gönder

#### 3. Broken Functionality
**Sebep:** Uygulama çalışmıyor veya özellikler eksik
**Çözüm:**
- [ ] Hangi özellik çalışmıyor tespiti yap
- [ ] Farklı cihazlarda test et
- [ ] Bug'ı düzelt
- [ ] Internal testing'de tekrar test et
- [ ] Yeni AAB yükle

#### 4. Data Safety Section Incomplete
**Sebep:** Data safety bölümü eksik veya yanlış
**Çözüm:**
- [ ] Tüm veri toplama yöntemlerini ekle
- [ ] Privacy Policy ile uyumlu mu kontrol et
- [ ] AdMob ve Firebase'i belirt
- [ ] Güncelle ve tekrar gönder

### Genel Troubleshooting İpuçları
- [ ] **Hızlı yanıt ver:** Ret yedikten sonra 2-3 gün içinde düzeltip tekrar gönder
- [ ] **Reviewer notes kullan:** Özel durumları açıkla
- [ ] **Testleri göster:** "X cihazda test edildi" gibi notlar ekle
- [ ] **Sabırlı ol:** Bazen 2-3 kere reddedilmek normal
- [ ] **Support'a yaz:** Anlamadığın bir red sebebi varsa sorabilirsin

---

## ✅ SON KONTROL LİSTESİ

### Teknik Altyapı
- [ ] Package name/Bundle ID: `com.szrgame.colordrop` ✅
- [ ] Version: 1.0.0 ✅
- [ ] Build number artırıldı ✅
- [ ] Privacy Policy URL eklendi
- [ ] Terms of Service URL eklendi
- [ ] Support email adresi ayarlandı
- [ ] Icon ve splash screen doğru

### Oyun Özellikleri
- [ ] Tutorial/Onboarding eklendi
- [ ] Ses efektleri çalışıyor
- [ ] Müzik çalışıyor
- [ ] Haptic feedback çalışıyor
- [ ] Başarımlar sistemi aktif
- [ ] Günlük ödüller ve görevler aktif
- [ ] Leaderboard Firebase'e bağlı
- [ ] Paylaşım özelliği çalışıyor
- [ ] Ayarlar menüsü tam
- [ ] İstatistikler takip ediliyor

### Analytics ve Monitoring
- [ ] Sentry kuruldu ve aktif
- [ ] Firebase Analytics kuruldu ve aktif
- [ ] Event'ler gönderiliyor
- [ ] Crash'ler izleniyor
- [ ] User properties ayarlı

### Store Hazırlıkları
- [ ] App Store Connect hesabı var
- [ ] Google Play Console hesabı var
- [ ] Her iki store'da uygulama oluşturuldu
- [ ] Tüm metadata girildi
- [ ] Screenshots yüklendi (minimum 6 adet)
- [ ] Feature graphic yüklendi (Android)
- [ ] Privacy Policy linki eklendi
- [ ] Age rating tamamlandı
- [ ] Content rating tamamlandı (Android)

### Build ve Test
- [ ] iOS production build oluşturuldu
- [ ] Android production build (AAB) oluşturuldu
- [ ] TestFlight/Internal Testing yapıldı
- [ ] Farklı cihazlarda test edildi
- [ ] Kritik bug yok
- [ ] Performance sorunsuz

### Yayın
- [ ] iOS "Submit for Review" yapıldı
- [ ] Android "Production'a yayınla" yapıldı
- [ ] Her iki store'da görünür halde
- [ ] İlk indirme testi yapıldı
- [ ] Monitoring aktif

### Pazarlama
- [ ] Sosyal medya hesapları hazır
- [ ] Launch day postları hazır
- [ ] Arkadaşlara/aileye duyuru listesi
- [ ] Store linkleri paylaşıldı

---

## 🎉 TEBRİKLER!

Bu checklist'i tamamladıysanız, **ColorDrop oyununuzu başarıyla yayınlamışsınız demektir!** 🚀

### Sonraki Adımlar:
1. **İlk 7 gün:** Günlük takip, bug fix, kullanıcı feedback
2. **2. hafta:** Performans iyileştirmeleri, küçük özellikler
3. **3-4. hafta:** Monetizasyon ekleme (AdMob, IAP)
4. **2-3. ay:** İleri seviye özellikler, yeni içerikler
5. **Sürekli:** Düzenli güncellemeler, topluluk oluşturma

### Unutmayın:
- Kullanıcı yorumlarına cevap verin
- Düzenli güncelleme yapın (2-4 haftada bir)
- Analytics verilerine göre karar alın
- Sabırlı olun - başarı zaman alır

**İyi şanslar ve başarılı bir yayın! 🎮✨**

---

---

## 📊 HIZLI REFERANS: ZAMAN ÇİZELGESİ

| Faz | Süre | Zorluk | Kritiklik | Bağımlılıklar |
|-----|------|--------|-----------|---------------|
| **Faz 1:** Teknik Altyapı | 2 saat | ⭐ Kolay | 🔴 Kritik | Yok |
| **Faz 2:** Yasal Gereksinimler | 4 saat | ⭐ Kolay | 🔴 Kritik | GitHub Pages veya web sitesi |
| **Faz 3:** Kullanıcı Deneyimi | 2 gün | ⭐⭐ Orta | 🟠 Yüksek | Ses dosyaları, haptic kütüphane |
| **Faz 4:** Oyun İçi Özellikler | 3 gün | ⭐⭐ Orta | 🟠 Yüksek | AsyncStorage |
| **Faz 5:** Sosyal ve Rekabet | 2 gün | ⭐⭐⭐ Zor | 🟠 Yüksek | Firebase projesi |
| **Faz 6:** Analytics & Crash | 1 gün | ⭐⭐ Kolay | 🔴 Kritik | Firebase, Sentry |
| **Faz 7:** Performans | 1 gün | ⭐⭐ Orta | 🟡 Orta | Test cihazları |
| **Faz 8:** Store Hazırlıkları | 3 gün | ⭐⭐ Orta | 🔴 Kritik | Developer hesapları ($99+$25) |
| **Faz 9:** Build ve Test | 2 gün | ⭐⭐ Orta | 🔴 Kritik | EAS hesabı |
| **Faz 10:** Store Yayın | 1 gün | ⭐ Kolay | 🔴 Kritik | Faz 1-9 tamamlanmış |
| **Faz 11:** Yayın Sonrası | Sürekli | ⭐⭐ Orta | 🟠 Yüksek | Monitoring araçları |

**TOPLAM SÜRE:** 12-14 gün (tam zamanlı) veya 3-4 hafta (part-time)

---

## 🎯 KRİTİK BAŞARI FAKTÖRLERİ

### Yayından Önce MUTLAKA Olmalı:
1. ✅ Privacy Policy ve Terms URL'leri çalışıyor
2. ✅ Sentry ve Firebase Analytics aktif
3. ✅ Tutorial eklendi
4. ✅ Ses efektleri ve haptic feedback çalışıyor
5. ✅ Leaderboard Firebase'e bağlı
6. ✅ Başarımlar ve günlük ödüller aktif
7. ✅ Minimum 6 screenshot hazır
8. ✅ Performance testleri geçti (60 FPS, <150MB RAM, <50MB size)
9. ✅ Banking/Tax bilgileri girildi (gelir almak için!)
10. ✅ TestFlight/Internal Testing tamamlandı

### İlk Hafta İçinde Yapılmalı:
1. ✅ Tüm kullanıcı yorumlarına cevap verildi
2. ✅ Kritik bug'lar düzeltildi (varsa)
3. ✅ Analytics verileri analiz edildi
4. ✅ Success metrics takip ediliyor
5. ✅ Sosyal medyada tanıtım yapıldı

### İlk Ay İçinde Hedefler:
1. 📊 100+ total indirme
2. ⭐ 4.0+ uygulama puanı
3. 🔁 %40+ D1 retention
4. 💬 10+ yorum
5. 🐛 %99+ crash-free users

---

## 💡 ÖNEMLİ NOTLAR

### ⚠️ Dikkat Edilmesi Gerekenler:
- **Banking/Tax bilgileri:** Bu adım tamamlanmadan gelir alamazsınız! Erken başlayın.
- **Play App Signing:** Bir kez aktif edince geri alamazsınız, ama ÇOK önerilir.
- **COPPA & GDPR:** AB/ABD'de yayınlanıyorsanız, uyumluluk zorunlu.
- **Performance metrikleri:** Store red sebebi olabilir, mutlaka test edin.
- **Screenshot kalitesi:** İndirme oranınızı en çok etkileyen faktör!

### 💰 Maliyet Özeti:
- Apple Developer: $99/yıl
- Google Play: $25 (bir kez)
- Firebase: Ücretsiz (başlangıç için yeterli)
- Sentry: Ücretsiz (5K error/ay)
- **TOPLAM:** $124 (ilk yıl)

### 📞 Yardım Kaynakları:
- **Apple Support:** https://developer.apple.com/contact/
- **Google Support:** https://support.google.com/googleplay/android-developer/
- **Firebase Docs:** https://firebase.google.com/docs
- **Sentry Docs:** https://docs.sentry.io/
- **Reddit r/gamedev:** https://reddit.com/r/gamedev
- **Discord Communities:** Indie Game Developers

---

## 🎉 FİNAL CHECKLIST - SUBMIT BUTONUNA BASMADAN ÖNCE

**Bu listeyi submit etmeden 1 saat önce bir kez daha kontrol et:**

- [ ] ✅ Production build her iki platformda test edildi
- [ ] ✅ Privacy Policy ve ToS linkleri çalışıyor
- [ ] ✅ Tüm screenshot'lar yüklendi ve doğru görünüyor
- [ ] ✅ Description hatasız ve çekici
- [ ] ✅ App icon profesyonel görünüyor
- [ ] ✅ Banking/Tax bilgileri onaylandı
- [ ] ✅ Version numbers doğru (1.0.0)
- [ ] ✅ Keystore yedeklendi (Android)
- [ ] ✅ Sentry ve Firebase aktif
- [ ] ✅ Crash yok, performance sorunsuz
- [ ] ✅ Support email adresi hazır ve monitör ediliyor
- [ ] ✅ Sosyal medya hesapları hazır (launch için)
- [ ] ✅ Mental olarak hazırsın (feedback'e açık, sabırlı)

**Hepsi tamam mı? SUBMIT ET! 🚀**

---

**Doküman Versiyonu:** 2.0
**Son Güncelleme:** 2025-11-17 (store-submission-checklist.md ile merge edildi)
**Yazar:** ColorDrop Development Team

**Değişiklik Notları (v2.0):**
- ✅ Banking/Tax bilgileri eklendi (Apple & Google)
- ✅ Play App Signing detayları eklendi
- ✅ COPPA ve GDPR compliance eklendi
- ✅ Performance metrikleri detaylandırıldı (FPS, Memory, Battery, Size)
- ✅ Rollout stratejisi eklendi (Android)
- ✅ Success metrics detaylandırıldı (DAU/MAU, eCPM, retention hedefleri)
- ✅ Troubleshooting bölümü eklendi (sık red sebepleri ve çözümleri)
- ✅ Hızlı referans zaman çizelgesi eklendi
- ✅ Kritik başarı faktörleri özeti eklendi
