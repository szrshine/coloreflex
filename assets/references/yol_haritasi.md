# ColorDrop Oyun Geliştirme ve Yayın Yol Haritası

## Genel Bakış
Bu belge, ColorDrop oyununun App Store ve Google Play'e yayınlanması ve gelir elde etmesi için gereken tüm adımları detaylı bir şekilde açıklamaktadır.

---

## Faz 1: Temel Teknik Altyapı (1-2 Gün)

### 1.1 Uygulama Tanımlayıcıları
**Amaç:** Store'lara yüklenebilir hale getirmek

**Yapılacaklar:**
- app.json dosyasına Android için `package` ekle (örn: com.yourcompany.colordrop)
- app.json dosyasına iOS için `bundleIdentifier` ekle (aynı format)
- Package name benzersiz olmalı, başka uygulamalar tarafından kullanılmamalı
- Şirket domain'iniz varsa ters DNS formatı kullanın (com.domain.uygulama)
- Domain yoksa, kişisel format kullanın (com.adiniz.colordrop)

**Not:** Bu değerler bir kere belirlendikten sonra değiştirilemez!

### 1.2 Uygulama Versiyonlama
**Amaç:** Güncelleme yönetimi için sağlam bir sistem kurmak

**Yapılacaklar:**
- app.json içindeki version numarasını doğru formatta tut (Major.Minor.Patch)
- Android için `versionCode` ekle (her build'de artan bir sayı, başlangıç: 1)
- iOS için `buildNumber` ekle (her build'de artan bir sayı, başlangıç: 1)
- Version politikası belirle: Büyük güncellemeler için Major, yeni özellikler için Minor, bug fix için Patch

### 1.3 Uygulama İzinleri ve Meta Bilgiler
**Amaç:** Store gereksinimleri ve kullanıcı bilgilendirmesi

**Yapılacaklar:**
- app.json'a description ekle (kısa açıklama, 170 karakter max)
- Privacy policy URL'i hazırla (Faz 2'de oluşturulacak)
- App Store kategorisi belirle (Games > Puzzle veya Games > Arcade)
- Yaş sınırlaması belirle (PEGI/ESRB uyumlu, muhtemelen 3+)
- Android permissions listesi kontrol et (gerekmeyen izinleri kaldır)

---

## Faz 2: Yasal Gereksinimler (1 Gün)

### 2.1 Gizlilik Politikası (Privacy Policy)
**Amaç:** App Store ve Google Play zorunlu gereksinimi

**Yapılacaklar:**
- Online privacy policy generator kullan (iubenda, freeprivacypolicy, vs.)
- Şu bilgileri içermeli:
  - Hangi verileri topladığınız (skor bilgileri, cihaz bilgileri)
  - Verileri nasıl kullandığınız
  - Üçüncü parti hizmetler (AdMob, Analytics)
  - Kullanıcı hakları
  - İletişim bilgileri
- Politikayı bir web sitesinde yayınla (GitHub Pages veya ücretsiz hosting)
- URL'i app.json'a ekle

### 2.2 Kullanım Şartları (Terms of Service)
**Amaç:** Yasal koruma ve Store gereksinimleri

**Yapılacaklar:**
- Terms of Service template kullan
- Şu konuları içermeli:
  - Kullanım kuralları
  - Yasaklanan davranışlar
  - Sorumluluk reddi
  - Hesap askıya alma/silme koşulları (eğer hesap sistemi eklenirse)
  - Değişiklik hakları
- Politika ile aynı yerde yayınla
- Oyun içinde erişilebilir yap (Ayarlar menüsüne link ekle)

### 2.3 İletişim ve Destek
**Yapılacaklar:**
- Destek e-posta adresi oluştur (support@domain.com veya kişisel e-posta)
- E-posta adresini app.json ve Store listelerinde kullan
- Oyun içinde "İletişim" veya "Destek" bölümü ekle

---

## Faz 3: Kullanıcı Deneyimi İyileştirmeleri (2-3 Gün)

### 3.1 İlk Açılış Deneyimi (Tutorial/Onboarding)
**Amaç:** Kullanıcıların oyunu hemen anlaması ve oynamaya başlaması

**Yapılacaklar:**
- İlk açılışta tek seferlik tutorial göster
- Tutorial adımları:
  1. "Hoş Geldin" ekranı
  2. Oyun mekaniğini açıklayan 2-3 slide (görsel + kısa metin)
  3. İnteraktif deneme (1-2 top ile güvenli ortamda pratik)
  4. "Başla!" butonu
- AsyncStorage ile tutorial gösterildi mi kontrolü
- Ayarlar menüsünden tutorial'ı tekrar gösterme seçeneği
- Tutorial skip butonu ekle (kullanıcı anlamışsa geçsin)

### 3.2 Ses Efektleri ve Müzik
**Amaç:** Oyun deneyimini zenginleştirmek ve profesyonel hissettirmek

**Yapılacaklar:**

**Ses Efektleri:**
- Doğru eşleşme ses efekti (pozitif, ödüllendirici ses)
- Yanlış eşleşme ses efekti (negatif, uyarıcı ses)
- Düğme tıklama sesi (menü, butonlar)
- Oyun başlangıç sesi
- Yeni rekor sesi (kutlama efekti)
- Power-up kullanım sesleri (ileride eklenecek özellikler için)

**Müzik:**
- Menü için sakin bir background müzik (loop)
- Oyun esnasında tempo yüksek müzik (loop)
- Müziği açma/kapama seçeneği
- Ses efektlerini açma/kapama seçeneği (ayrı ayrı)

**Ses Dosyaları:**
- Freesound.org, OpenGameArt.org, Zapsplat gibi ücretsiz kaynaklardan indir
- Alternatif: Fiverr'dan uygun fiyata özel ses paketi sipariş et ($10-30)
- Dosya formatı: MP3 veya OGG (dosya boyutu küçük olsun)
- expo-av kütüphanesini kullan (ses çalma için)

**Ayarlar:**
- AsyncStorage ile kullanıcı tercihlerini sakla
- Ayarlar menüsü ekle (ana menüde ayarlar ikonu)
- Ses/müzik on/off toggle'ları

### 3.3 Haptic Feedback (Titreşim)
**Amaç:** Dokunsal geri bildirim ile oyun deneyimini artırmak

**Yapılacaklar:**
- expo-haptics kütüphanesini kullan
- Doğru eşleşme: hafif başarı titreşimi
- Yanlış eşleşme: orta şiddetli uyarı titreşimi
- Düğme tıklamalar: çok hafif titreşim
- Yeni rekor: uzun kutlama titreşimi
- Ayarlarda haptic feedback açma/kapama seçeneği

### 3.4 Görsel İyileştirmeler
**Amaç:** Oyunu daha çekici ve profesyonel göstermek

**Yapılacaklar:**
- Parçacık efektleri (particle effects) ekle:
  - Doğru eşleşmede patlama/konfeti efekti
  - Yanlış eşleşmede kırmızı titreşim efekti
- Skor artarken animasyon ekle (sayı büyüyüp küçülsün)
- Yeni rekor anında ekran efekti (parlama, yıldız vs.)
- Loading ekranı ekle (oyun başlarken)
- Smooth transitions (ekranlar arası yumuşak geçişler)

---

## Faz 4: Oyun İçi Özellikler (3-4 Gün)

### 4.1 Ayarlar Menüsü
**Yapılacaklar:**
- Ana menüye ayarlar butonu (dişli ikonu)
- Ayarlar ekranı oluştur:
  - Ses efektleri on/off
  - Müzik on/off
  - Haptic feedback on/off
  - Tutorial'ı tekrar göster butonu
  - İstatistikler (toplam oynanan oyun, toplam skor)
  - Hakkında (versiyon, geliştirici bilgisi)
  - Gizlilik Politikası linki
  - Kullanım Şartları linki
  - İletişim butonu (e-posta aç)
  - Skorları sıfırla butonu (confirm dialog ile)

### 4.2 Başarımlar Sistemi (Achievements)
**Amaç:** Kullanıcı engagement'ı artırmak ve yeniden oynatılabilirliği yükseltmek

**Yapılacaklar:**
- Başarım listesi oluştur:
  - "İlk Adım" - İlk oyunu tamamla
  - "Başlangıç Seviyesi" - 10 puan kazan
  - "Uzman" - 25 puan kazan
  - "Usta" - 50 puan kazan
  - "Efsane" - 100 puan kazan
  - "Hız Canavarı" - En yüksek hızda 5 doğru eşleşme
  - "Mükemmel Seri" - 20 ardışık doğru eşleşme
  - "Çaylak Değil" - 100 oyun oyna
  - "Bağımlısı" - Üst üste 7 gün giriş yap
- AsyncStorage ile başarımları sakla
- Başarım kazanıldığında toast notification göster
- Ana menüde başarımlar bölümü (trofiler)
- Kilitsiz/kilitli başarımları göster (progress bar ile)

### 4.3 Günlük Ödüller ve Görevler
**Amaç:** Günlük aktif kullanıcı sayısını artırmak (DAU)

**Günlük Ödüller:**
- Her gün giriş yapana bonus:
  - 1. gün: Küçük ödül (ileride eklenecek coin sistemi için)
  - 7. gün: Büyük ödül
  - 30. gün: Mega ödül
- Streak sistemi (ardışık gün takibi)
- Günlük ödül popup'ı (giriş yapınca göster)

**Günlük Görevler:**
- Her gün 3 basit görev:
  - "5 oyun oyna"
  - "25 puan kazan"
  - "10 doğru eşleşme yap"
- Görev tamamlandığında ödül
- Günlük görevleri ana menüde göster
- Gece yarısı görevleri sıfırla

### 4.4 İstatistikler ve Profil
**Yapılacaklar:**
- Kullanıcı istatistikleri:
  - Toplam oynanan oyun sayısı
  - Toplam puan
  - Ortalama puan
  - En yüksek skor
  - En uzun streak
  - Toplam oyun süresi
  - Toplam doğru/yanlış eşleşme
  - Başarı oranı
- İstatistikleri görsel olarak göster (chart/grafik)
- Ayarlar menüsünden erişilebilir

---

## Faz 5: Monetizasyon (2-3 Gün)

### 5.1 Google AdMob Entegrasyonu
**Amaç:** Reklam gelirleri elde etmek

**Yapılacaklar:**

**Hesap ve Kurulum:**
- Google AdMob hesabı oluştur (admob.google.com)
- Uygulama kaydı yap (Android ve iOS ayrı ayrı)
- App ID'leri al (her platform için)
- expo-ads-admob veya react-native-google-mobile-ads kütüphanesini yükle
- app.json'a AdMob App ID'lerini ekle

**Reklam Üniteleri Oluştur:**
- Banner Ad Unit (oyun ekranı altı)
- Interstitial Ad Unit (oyun arası tam ekran)
- Rewarded Video Ad Unit (ödüllü video)

**Banner Ads:**
- Oyun ekranının en altına banner koy (oyun alanını kaplamasın)
- Smart banner kullan (ekran boyutuna göre adaptif)
- Ana menüde banner gösterme (sadece oyun ekranında)

**Interstitial Ads:**
- Her 3-4 oyun sonunda göster (çok sık olmasın)
- Game Over ekranından menüye dönüşte göster
- Kullanıcı deneyimini bozmayacak timing'de göster
- Reklam yükleme hatalarını handle et

**Rewarded Video Ads:**
- "Devam Et" özelliği ekle:
  - Oyun bittiğinde "Video İzle ve Devam Et" butonu
  - Video izlenirse oyuna kaldığı yerden devam
  - Günde 3 kere kullanılabilir
- "Ekstra Güç" için video izletme seçeneği (ileride)

**Test Modu:**
- Geliştirme aşamasında test ad unit ID'leri kullan
- Gerçek reklamları sadece production'da aç
- AdMob politikalarına uy (kendi reklamına tıklama yasak!)

### 5.2 In-App Purchase (IAP) Sistemi
**Amaç:** Premium gelir kaynağı oluşturmak

**Yapılacaklar:**

**App Store Connect ve Google Play Console Kurulumu:**
- App Store Connect'te In-App Purchases bölümünden ürünler oluştur
- Google Play Console'da In-App Products bölümünden ürünler oluştur
- react-native-iap veya expo-in-app-purchases kütüphanesini yükle

**Satılacak Ürünler:**

1. **Reklamsız Versiyon** ($2.99 - Non-consumable)
   - Tüm reklamları kaldır (banner ve interstitial)
   - Rewarded video hariç (kullanıcı isteğiyle)
   - "Restore Purchase" özelliği ekle (cihaz değişiminde)

2. **Premium Skin Paketi** ($1.99 - Non-consumable)
   - 10 farklı top skini
   - 5 farklı background teması
   - Premium kullanıcı badge'i

3. **Power-Up Paketi** ($0.99 - Consumable)
   - 5 Slow Motion
   - 5 Shield
   - 5 Freeze
   - Tekrar satın alınabilir

4. **Coin Paketi** ($0.99 / $4.99 / $9.99 - Consumable)
   - Küçük paket: 100 coin
   - Orta paket: 600 coin
   - Büyük paket: 1500 coin
   - Coin ile skin/power-up satın alma sistemi

**IAP Ekranı:**
- Ana menüde "Market" veya "Mağaza" butonu
- Tüm ürünleri listele
- Satın alma butonları
- Fiyatları otomatik çek (IAP API'den)
- Satın alma başarı/hata mesajları
- Receipt validation (güvenlik için)

### 5.3 Coin Ekonomisi
**Amaç:** IAP ve engagement için sanal para sistemi

**Yapılacaklar:**
- Coin kazanma yolları:
  - Her oyun sonunda puana göre coin (1 puan = 1 coin)
  - Günlük ödüller (giriş bonusu)
  - Rewarded video izleme (25 coin)
  - Günlük görev tamamlama
  - Başarım kilidi açma
- Coin harcama yolları:
  - Skin satın alma (100-500 coin)
  - Power-up satın alma (50 coin)
  - Devam etme hakkı (100 coin veya video)
- UI'da coin miktarını göster (sağ üst köşe)
- AsyncStorage ile coin saklama

---

## Faz 6: Sosyal ve Rekabet (2 Gün)

### 6.1 Liderlik Tablosu (Leaderboard)
**Amaç:** Sosyal rekabet ve engagement artırma

**Yapılacaklar:**

**Seçenek 1: Google Play Games ve Game Center (Önerilen)**
- expo-game-services veya react-native-game-center kullan
- Platform native leaderboard'ları kullan (ücretsiz)
- Android için Google Play Games Services kurulumu
- iOS için Game Center kurulumu
- Skor otomatik olarak gönder
- Ana menüde "Liderlik Tablosu" butonu

**Seçenek 2: Kendi Backend'iniz**
- Firebase Realtime Database veya Firestore kullan
- Global leaderboard (en yüksek 100)
- Haftalık leaderboard (her hafta sıfırlanır)
- Aylık leaderboard
- Arkadaş leaderboard'u (ileride sosyal özellik eklenirse)
- Kullanıcı ismi/nickname sistemi
- Profil fotoğrafı (opsiyonel)

**Liderboard UI:**
- Top 10 göster
- Kullanıcının kendi sıralaması (highlight)
- Sayfa sistemi (daha fazlası için)
- Filtreler (günlük/haftalık/aylık/tüm zamanlar)

### 6.2 Arkadaşlarla Paylaşma
**Yapılacaklar:**
- expo-sharing kullan
- Game Over ekranında "Paylaş" butonu
- Paylaşılacak içerik:
  - "ColorDrop'ta X puan yaptım! Sen de dene!"
  - Skor bilgisi
  - App Store/Play Store linki
- Screenshot alma ve paylaşma (opsiyonel)
- Sosyal medya entegrasyonu (Twitter, Facebook)

---

## Faz 7: Performans ve Stabilite (2-3 Gün)

### 7.1 Crash Reporting ve Error Tracking
**Amaç:** Hataları gerçek zamanlı takip etmek ve çözmek

**Yapılacaklar:**
- Sentry hesabı oluştur (ücretsiz plan yeterli)
- @sentry/react-native kurulumu yap
- app.json'a Sentry DSN ekle
- Error boundary ekle (tüm uygulamayı saran)
- Try-catch blokları ekle (kritik işlemlerde)
- Custom error logging ekle (önemli olaylarda)
- Test crash oluştur ve Sentry'de göründüğünü kontrol et

### 7.2 Analytics Entegrasyonu
**Amaç:** Kullanıcı davranışlarını anlamak ve optimize etmek

**Yapılacaklar:**

**Firebase Analytics (Önerilen):**
- Firebase projesi oluştur
- Android ve iOS uygulamaları ekle
- @react-native-firebase/app ve @react-native-firebase/analytics yükle
- google-services.json (Android) ve GoogleService-Info.plist (iOS) ekle

**Takip Edilecek Eventler:**
- app_open (uygulama açılış)
- game_start (oyun başlangıç)
- game_over (oyun bitiş + skor)
- achievement_unlocked (başarım kilidi)
- ad_impression (reklam görüntülenme)
- ad_click (reklam tıklama)
- purchase (satın alma)
- tutorial_complete (tutorial tamamlama)
- share (paylaşım)
- settings_change (ayar değişimi)

**Takip Edilecek User Properties:**
- total_games_played
- highest_score
- has_purchased_noads
- tutorial_completed
- last_login_date

### 7.3 Performans Optimizasyonu
**Yapılacaklar:**
- Game loop'u optimize et (gereksiz re-render'ları engelle)
- useMemo ve useCallback kullan (pahalı hesaplamalar için)
- FlatList için performans optimizasyonları (leaderboard'da)
- Büyük resimleri optimize et (assets klasörü)
- Lazy loading ekle (gerektiğinde yükle)
- Bundle size'ı küçült (gereksiz kütüphaneleri kaldır)
- Hermes engine aktif mi kontrol et (daha hızlı çalışma)

### 7.4 Farklı Cihazlarda Test
**Yapılacaklar:**
- Farklı ekran boyutları test et:
  - Küçük ekran (iPhone SE, Android mini)
  - Orta ekran (iPhone 13, Pixel)
  - Büyük ekran (iPhone 14 Plus, tablet)
- Notch/Dynamic Island ile uyumluluğu kontrol et
- Safe area kullan (StatusBar altına kayma olmasın)
- Yatay mod desteği (opsiyonel, ama test et)
- Düşük performanslı cihazlarda test et
- iOS ve Android'de yan yana test

---

## Faz 8: Store Hazırlığı (2-3 Gün) ✅ TAMAMLANDI

### 8.1 App Store Connect Hazırlığı (iOS)
**Yapılacaklar:**

**Hesap ve Uygulama Oluşturma:**
- Apple Developer hesabı ($99/yıl)
- App Store Connect'e giriş yap
- Yeni uygulama oluştur (bundle ID ile eşleşmeli)
- SKU belirle (benzersiz ID)

**Uygulama Bilgileri:**
- Uygulama ismi (ColorDrop)
- Subtitle (30 karakter kısa açıklama)
- Description (4000 karakter, anahtar kelimelerle)
- Anahtar kelimeler (100 karakter, virgülle ayrılmış)
- Destek URL'i (web siteniz veya politika sayfası)
- Pazarlama URL'i (opsiyonel)
- Yaş sınırlaması (muhtemelen 4+)
- Kategori (Games > Puzzle veya Arcade)
- Alt kategori
- Fiyatlandırma (Ücretsiz)
- Uygulama içi satın almalar ekle (oluşturduğunuz IAP'ler)

**Ekran Görüntüleri ve Videolar:**
- 6.7" iPhone ekran görüntüleri (6-10 adet)
- 6.5" iPhone ekran görüntüleri
- 5.5" iPhone ekran görüntüleri
- iPad Pro ekran görüntüleri (eğer destekliyorsa)
- App Preview video (15-30 saniye, opsiyonel ama önerilen)

**Ekran Görüntüsü İçeriği:**
1. Gameplay (toplar düşerken)
2. Skor gösterimi
3. Menü ekranı
4. Başarımlar ekranı
5. Leaderboard ekranı
6. Özellikler ekranı (power-ups, skin'ler)

**Metinler:**
- Promotional text (170 karakter, güncellenebilir)
- Description'da şunları vurgula:
  - Oynanış mekaniği
  - Özellikler (power-ups, achievements, leaderboard)
  - Neden eğlenceli olduğu
  - Basit ama bağımlılık yapıcı

**App Review Bilgileri:**
- Demo hesabı (eğer login gerekliyse)
- Notlar (Apple'a ek bilgi)
- İletişim bilgileri (telefon dahil)

### 8.2 Google Play Console Hazırlığı (Android)
**Yapılacaklar:**

**Hesap ve Uygulama Oluşturma:**
- Google Play Console hesabı ($25 tek seferlik)
- Yeni uygulama oluştur
- Package name gir (app.json'dakiyle aynı)

**Store Listesi:**
- Uygulama ismi (ColorDrop - 50 karakter max)
- Kısa açıklama (80 karakter)
- Uzun açıklama (4000 karakter)
  - Başlık ve bullet point'lerle formatla
  - Anahtar kelimeleri tekrarla (SEO için)
  - Call-to-action ekle

**Grafik Varlıklar:**
- Uygulama ikonu (512x512 PNG)
- Özellik grafiği (1024x500 JPG/PNG) - Store'da üstte görünür
- Telefon ekran görüntüleri (6-8 adet, minimum 2)
- 7" tablet ekran görüntüleri (opsiyonel)
- 10" tablet ekran görüntüleri (opsiyonel)
- Promo video (YouTube linki, opsiyonel)

**Kategorileme:**
- Uygulama kategorisi (Games > Puzzle)
- Etiketler (casual, puzzle, color, reflex)

**Fiyatlandırma:**
- Ücretsiz
- Uygulama içi satın almalar tanımla
- Reklam içeriği var işaretle

**İçerik Derecelendirmesi:**
- IARC anketi doldur
- Şiddet, cinsellik, dil gibi içerikler (yok)
- PEGI, ESRB otomatik oluşturulur

**Veri Güvenliği Bölümü (ÖNEMLİ):**
- Hangi verileri topladığınızı bildirin:
  - Cihaz bilgisi
  - Kullanım verileri
  - Crash logları
- Verilerin şifrelenip şifrelenmediği
- Kullanıcı veri silebilir mi
- Gizlilik politikası linki

**Uygulamalar Arası İletişim:**
- Reklam içerir mi? (Evet)
- Hangi reklam ağları? (AdMob)

### 8.3 Ekran Görüntüleri ve Promo Materyalleri
**Yapılacaklar:**

**Ekran Görüntüsü Oluşturma:**
- Simulator/emulator'da oyunu çalıştır
- En güzel anları yakala (toplar düşerken, başarım açılırken)
- Veya tasarım araçları kullan (Figma, Sketch)
- Metin overlay ekle (özellik açıklamaları)
- Her görüntü bir özelliği vurgulamalı

**Promo Video (Önerilen):**
- 15-30 saniye gameplay kaydı
- Ekran kayıt aracı kullan (OBS, QuickTime)
- İlk 3 saniye en çekici olmalı
- Background müzik ekle (telif hakkı olmayan)
- Başta ve sonda text overlay ("ColorDrop" + "Download Now")
- YouTube'a unlisted olarak yükle
- Linki Play Console'a ekle

**Feature Graphic (Google Play için ÖNEMLİ):**
- 1024x500 boyutunda tasarla
- Oyun ismini büyük fontla ekle
- Oyundan görseller kullan
- Çekici ve renkli olmalı
- Metin az, görsel çok

### 8.4 App Store Optimization (ASO)
**Amaç:** Organik indirme sayısını artırmak

**Yapılacaklar:**

**Anahtar Kelime Araştırması:**
- Rakip analizi yap (benzer oyunlar)
- App Store ve Play Store'da arama yap
- Popüler anahtar kelimeleri belirle:
  - color game
  - puzzle game
  - reflex game
  - casual game
  - drop game
  - color match
  - brain game
  - quick game

**Title Optimization:**
- Ana başlık: ColorDrop
- Alt başlık: "Color Matching Puzzle Game" (Store'a göre değişir)

**Description Optimization:**
- İlk 2 cümle en önemli (kısa ve çekici)
- Anahtar kelimeleri doğal olarak yerleştir
- Özellik listesi (bullet points)
- Sosyal kanıt ekle (eğer varsa: "100K+ indirme")
- Call-to-action ("İndir ve en yüksek skoru yap!")

**Lokalizasyon (İleride):**
- İngilizce versiyonu ilk yayınla
- Daha sonra Türkçe, Almanca, Fransızca, İspanyolca ekle
- Her dil için anahtar kelime araştırması yap

---

## Faz 9: Build ve Yayın (1-2 Gün)

### 9.1 Production Build Hazırlığı
**Yapılacaklar:**

**Ortam Değişkenleri:**
- Development ve production ortamlarını ayır
- Production'da:
  - Test reklam ID'lerini gerçekleriyle değiştir
  - API key'lerini production'a göre ayarla
  - Debug modunu kapat
  - Console.log'ları kaldır veya disable et

**Code Signing:**
- iOS için Signing Certificate ve Provisioning Profile
- Android için Keystore oluştur (güvenli yerde sakla!)
- Keystore şifresini kaydet (kaybolursa güncelleme yapamazsın)

**app.json Son Kontroller:**
- Version ve build number doğru mu
- Bundle ID/Package name doğru mu
- Icon ve splash screen yolları doğru mu
- Orientation portrait olarak ayarlı mı
- Privacy/Terms URL'leri eklendi mi

### 9.2 iOS Build ve Yükleme
**Yapılacaklar:**

**EAS Build (Önerilen):**
- EAS hesabı oluştur (expo.dev)
- `eas build:configure` komutu çalıştır
- eas.json dosyasını düzenle (production profili)
- `eas build --platform ios --profile production` komutu
- Build tamamlanınca IPA dosyası indir
- Transporter uygulaması ile App Store Connect'e yükle

**Xcode ile Build (Alternatif):**
- `expo prebuild` komutu ile native kod üret
- Xcode'da projeyi aç
- Archive oluştur
- Organizer'dan App Store Connect'e yükle

**TestFlight Beta Test:**
- App Store Connect'te Internal Testing başlat
- 3-5 kişiye davet gönder
- 1-2 gün test ettir
- Kritik bug yoksa tam yayına geç

### 9.3 Android Build ve Yükleme
**Yapılacaklar:**

**EAS Build:**
- `eas build --platform android --profile production`
- AAB dosyası üretilecek (Android App Bundle)
- Play Console'a yükle

**Manuel Build (Alternatif):**
- `expo prebuild` komutu
- Android Studio'da projeyi aç
- Build > Generate Signed Bundle/APK
- AAB seç (APK değil)
- Keystore ile imzala
- Release build oluştur

**Internal Testing:**
- Play Console'da Internal Testing track'e yükle
- Test kullanıcıları ekle
- 1-2 gün test ettir
- Sorun yoksa Production'a taşı

### 9.4 Store Yayını
**Yapılacaklar:**

**iOS Yayın:**
- App Store Connect'te "Submit for Review" tıkla
- İnceleme süresi: 1-3 gün (ortalama 24 saat)
- Reddedilirse nedenleri oku ve düzelt
- Yeniden gönder

**Android Yayın:**
- Play Console'da "Send for Review" tıkla
- İnceleme süresi: Birkaç saat - 2 gün
- İlk yayında biraz uzun sürebilir
- Onaylandıktan sonra birkaç saat içinde Store'da görünür

**Yayın Sonrası:**
- Her iki Store'da uygulamanın görünür olduğunu kontrol et
- Farklı cihazlardan arama yap
- İndirme ve açılış test et
- İlk kullanıcı yorumlarını takip et

---