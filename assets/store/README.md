# ColorDrop Store Assets & Documentation

Bu klasör, ColorDrop oyununun App Store ve Google Play Store'a hazırlanması için gerekli tüm metadata, dokümanlar ve referans materyalleri içerir.

## 📁 Klasör İçeriği

### 📄 Metadata Dosyaları

**[app-store-metadata.json](./app-store-metadata.json)**
- Apple App Store için tüm metadata
- Uygulama açıklamaları, keywords, kategori bilgileri
- Screenshot gereksinimleri
- In-app purchase planları
- JSON formatında, kopyala-yapıştır için hazır

**[play-store-metadata.json](./play-store-metadata.json)**
- Google Play Store için tüm metadata
- Store listing bilgileri
- Content rating detayları
- Data safety bilgileri
- Grafik asset gereksinimleri

### 📚 Dokümanlar

**[FAZ_8_TODO_PRODUCTION.md](../references/FAZ_8_TODO_PRODUCTION.md)**
- Faz 8 için detaylı TODO listesi
- Store hesapları kurulum adımları
- Her platformun gereksinimleri
- ASO stratejisi
- Post-launch monitoring

**[screenshot-guide.md](./screenshot-guide.md)**
- Screenshot çekme rehberi
- 8 screenshot planı (her biri için detaylı açıklama)
- Overlay tasarım guidelines
- Feature graphic tasarım önerileri
- Promo video rehberi
- Araç ve kaynak linkleri

**[store-submission-checklist.md](./store-submission-checklist.md)**
- Kapsamlı submission checklist
- iOS ve Android için ayrı bölümler
- Yasal gereksinimler
- Teknik gereksinimler
- Test checklist
- Post-launch adımlar
- Başarı metrikleri

**[aso-keywords.json](./aso-keywords.json)**
- App Store Optimization için keyword araştırması
- Primary, medium ve long-tail keywords
- Competitor keywords
- Keyword density targets
- Localization planı
- ASO stratejisi (3 aşamalı)

---

## 🚀 Hızlı Başlangıç

### 1. Store Hesapları Oluşturma

**Apple Developer:**
1. https://developer.apple.com/programs/ adresine git
2. $99/yıl ödeme yap
3. App Store Connect'e giriş yap
4. Yeni uygulama oluştur

**Google Play Console:**
1. https://play.google.com/console adresine git
2. $25 tek seferlik ödeme yap
3. Developer hesabı oluştur
4. Yeni uygulama oluştur

### 2. Metadata'yı Kopyala

**iOS:**
```bash
# app-store-metadata.json dosyasını aç
# İlgili bölümleri App Store Connect'e kopyala:
# - Description
# - Keywords
# - Promotional Text
# - What's New
```

**Android:**
```bash
# play-store-metadata.json dosyasını aç
# İlgili bölümleri Play Console'a kopyala:
# - Short description
# - Full description
# - Release notes
```

### 3. Screenshots Oluştur

1. [screenshot-guide.md](./screenshot-guide.md) dosyasını oku
2. Simulator/Emulator'da oyunu çalıştır
3. 8 planlanan screenshot'ı çek:
   - Main Menu
   - Gameplay
   - Combo/Streak
   - Leaderboard
   - Achievements
   - Power-ups
   - Customization
   - Game Over
4. Overlay text ekle (opsiyonel ama önerilen)
5. Doğru boyutlara resize et

### 4. Submission Checklist'i Kullan

1. [store-submission-checklist.md](./store-submission-checklist.md) dosyasını aç
2. Her maddeyi sırayla kontrol et
3. Tüm checkboxlar tamamlanınca submit et

---

## 📊 Asset Gereksinimleri

### iOS (App Store)

**Screenshots:**
- 6.7" iPhone: 1290 x 2796 px (6-10 adet)
- 6.5" iPhone: 1242 x 2688 px (6-10 adet)
- 5.5" iPhone: 1242 x 2208 px (6-10 adet)
- iPad Pro: 2048 x 2732 px (optional)

**App Icon:**
- 1024 x 1024 px PNG (no transparency)

**App Preview Video (Optional):**
- 15-30 seconds
- MP4, M4V, or MOV

### Android (Google Play)

**Screenshots:**
- Phone: Min 320px, Max 3840px (2-8 adet)
- 16:9 to 2:1 aspect ratio
- JPEG or 24-bit PNG

**Feature Graphic:**
- 1024 x 500 px
- JPEG or 24-bit PNG (no alpha)
- ⭐ VERY IMPORTANT - Top of store listing

**App Icon:**
- 512 x 512 px
- 32-bit PNG with alpha

**Promo Video (Optional):**
- YouTube URL
- Max 2 minutes

---

## 📝 Store Listing Özeti

### App Name
- **iOS**: ColorDrop
- **Android**: ColorDrop - Color Match Game

### Short Description (80 chars)
```
Fast-paced color matching puzzle game. Match drops and beat your high score!
```

### Categories
- **Primary**: Games > Puzzle
- **Secondary**: Games > Arcade

### Age Rating
- **Rating**: 4+ / Everyone / PEGI 3

### Keywords (Top 5)
1. color match
2. puzzle game
3. color game
4. casual game
5. reflex game

### Pricing
- **Free** with optional in-app purchases
- Contains ads (removable via IAP)

---

## 🎯 ASO Stratejisi

### Aşama 1: Launch (İlk Ay)
**Focus**: Low-competition long-tail keywords
- color matching puzzle
- addictive color game
- quick casual game
- color drop game

**Hedef**: İlk rankings, organik momentum

### Aşama 2: Growth (2-3. Ay)
**Focus**: Medium-competition keywords
- reflex game
- drop game
- match game
- quick game

**Hedef**: Genişleme, daha fazla kategori

### Aşama 3: Scale (4+ Ay)
**Focus**: High-competition keywords
- color match
- color game
- puzzle game
- casual game

**Hedef**: Top rankings, mainstream visibility

---

## 📈 Başarı Metrikleri

### İlk Hafta Hedefleri
- ✅ 100+ downloads
- ✅ >4.0 rating
- ✅ 99%+ crash-free users
- ✅ Positive reviews
- ✅ Top 50 in Puzzle category (local)

### İlk Ay Hedefleri
- ✅ 1,000+ downloads
- ✅ >4.2 rating
- ✅ Day 1 retention >40%
- ✅ Day 7 retention >20%
- ✅ Top 20 in Puzzle category

### 3 Ay Hedefleri
- ✅ 10,000+ downloads
- ✅ >4.4 rating
- ✅ Featured in "New Games We Love" (aspiration)
- ✅ Monetization: $100+ monthly revenue

---

## 🛠️ Araçlar ve Kaynaklar

### Design Tools (Ücretsiz)
- **Canva**: https://www.canva.com/ (Feature graphic)
- **Figma**: https://www.figma.com/ (UI design)
- **GIMP**: https://www.gimp.org/ (Photo editing)
- **Inkscape**: https://inkscape.org/ (Vector graphics)

### Screenshot Tools
- **Screenshot Builder**: https://www.screenshotbuilder.com/
- **Mockuphone**: https://mockuphone.com/
- **PlaceIt**: https://placeit.net/

### ASO Tools
- **App Store Connect** (iOS search data)
- **Google Play Console** (Android search terms)
- **Sensor Tower**: https://sensortower.com/ (free tier)
- **App Annie (data.ai)**: https://www.data.ai/

### Video Tools
- **OBS Studio**: https://obsproject.com/ (Screen recording)
- **DaVinci Resolve**: https://www.blackmagicdesign.com/products/davinciresolve/ (Editing)
- **iMovie**: Pre-installed on Mac
- **Kapwing**: https://www.kapwing.com/ (Online editing)

### Stock Resources
- **Unsplash**: https://unsplash.com/ (Photos)
- **Pexels**: https://www.pexels.com/ (Photos/Videos)
- **Flaticon**: https://www.flaticon.com/ (Icons)
- **YouTube Audio Library**: Free music

---

## 📞 Destek ve İletişim

### Store Hesapları
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Google Play Console**: https://play.google.com/console

### Geliştirici Bilgileri
- **Email**: support@szrgame.com
- **Developer**: SZR Game Studios
- **Website**: https://github.com/szrshine/ColorDrop

### Yasal Dökümanlar
- **Privacy Policy**: https://github.com/szrshine/ColorDrop/blob/main/assets/legal/privacy-policy.md
- **Terms of Service**: https://github.com/szrshine/ColorDrop/blob/main/assets/legal/terms-of-service.md

---

## 🎉 Sonraki Adımlar

1. ✅ Faz 8 dokümanlarını oku
2. ⏳ Screenshot'ları oluştur
3. ⏳ Feature graphic tasarla
4. ⏳ Store hesaplarını kur
5. ⏳ Metadata'yı gir
6. ⏳ Production build hazırla (Faz 9)
7. ⏳ Submit for review
8. ⏳ Launch! 🚀

---

## 💡 Pro Tips

1. **Screenshots are #1**: En önemli conversion faktörü
2. **First 3 matter most**: İlk 3 screenshot visible without scroll
3. **Feature graphic matters** (Android): Top of store listing
4. **Keywords in title**: En yüksek SEO weight
5. **Update regularly**: Active apps rank better
6. **Respond to reviews**: Shows you care
7. **A/B test**: Try different screenshots after launch
8. **Localize eventually**: Based on user demographics

---

## 📅 Timeline

**Faz 8 (Store Hazırlığı):** 2-3 gün
- Day 1: Hesap kurulumu, metadata hazırlama
- Day 2: Screenshots ve graphics oluşturma
- Day 3: Review ve final touches

**Faz 9 (Build & Submit):** 1-2 gün
- Production builds
- Upload ve submission
- TestFlight/Internal testing

**Faz 10 (Launch):** Review süresi
- iOS: 1-3 gün review
- Android: Birkaç saat - 2 gün review

**Total:** ~1 hafta store'da yayında! 🎊

---

**Başarılar! ColorDrop'u store'larda görmek için sabırsızlanıyoruz! 🌟**
