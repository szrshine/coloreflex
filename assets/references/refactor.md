Merhaba! ColorDrop isimli React Native oyunumda kapsamlı bir refactoring yapmak istiyorum. Şu anda tüm oyun tek bir App.js dosyasında (~4,700 satır) ve bunu modern, modüler bir yapıya dönüştürmek istiyorum.

## Mevcut Durum
- **Ana dosya:** App.js (4,703 satır)
- **Platform:** React Native (Expo)
- **Oyun türü:** Color matching oyunu (toplar düşüyor, kullanıcı doğru renkli kutuya yönlendiriyor)
- **Özellikler:** 
  - Oyun mekaniği (top fiziği, collision detection, scoring)
  - Power-up sistemi (shield, slow motion, rainbow, double points)
  - Skin sistemi (30+ tema)
  - Achievement sistemi
  - Daily tasks ve rewards
  - In-App Purchase (IAP) entegrasyonu
  - AdMob reklam entegrasyonu
  - Ses/müzik/haptic feedback
  - AsyncStorage ile persistence
  - 8 farklı ekran (menu, game, gameOver, tutorial, achievements, skins, powerups, store, dailyTasks)

## Hedef Yapı

Aşağıdaki klasör yapısına geçmek istiyorum:

ColorDrop/ ├── App.js (sadece ana orchestrator, ~200-300 satır) ├── src/ │ ├── components/ │ │ ├── game/ │ │ │ ├── Ball.js │ │ │ ├── Particle.js │ │ │ ├── ColorBox.js │ │ │ └── PowerupButton.js │ │ ├── ui/ │ │ │ ├── Button.js │ │ │ ├── Modal.js │ │ │ ├── Toast.js │ │ │ └── Card.js │ │ └── shared/ │ │ └── AdBanner.js │ ├── screens/ │ │ ├── MenuScreen.js │ │ ├── GameScreen.js │ │ ├── GameOverScreen.js │ │ ├── TutorialScreen.js │ │ ├── AchievementsScreen.js │ │ ├── SkinsScreen.js │ │ ├── PowerupsScreen.js │ │ ├── StoreScreen.js │ │ └── DailyTasksScreen.js │ ├── hooks/ │ │ ├── useGameLogic.js │ │ ├── useGamePhysics.js │ │ ├── useAudio.js │ │ ├── useAchievements.js │ │ ├── useStorage.js │ │ ├── useDailyRewards.js │ │ ├── useGameStats.js │ │ └── useTheme.js │ ├── services/ │ │ ├── storage/ │ │ │ ├── index.js (generic storage utils) │ │ │ └── keys.js (storage key constants) │ │ ├── achievements/ │ │ │ └── index.js │ │ ├── monetization/ │ │ │ ├── iap.js │ │ │ └── ads.js │ │ └── audio/ │ │ └── index.js │ ├── constants/ │ │ ├── colors.js │ │ ├── skins.js │ │ ├── powerups.js │ │ ├── achievements.js │ │ ├── gameConfig.js │ │ ├── iapProducts.js │ │ └── legalText.js │ ├── utils/ │ │ ├── ballPhysics.js │ │ ├── collisionDetection.js │ │ ├── dateUtils.js │ │ └── particleSystem.js │ ├── context/ │ │ └── GameContext.js (or use Redux/Zustand if preferred) │ └── styles/ │ ├── theme.js │ ├── commonStyles.js │ └── screens/ │ ├── menuStyles.js │ ├── gameStyles.js │ └── ... (her ekran için) └── assets/ ├── sounds/ └── references/

## Refactoring Adımları (Öncelik Sırasına Göre)

### Faz 1: Hazırlık ve Sabitler (En Kolay, 2-3 saat)
1. `src/constants/` klasörü oluştur ve tüm sabitleri ayır:
   - SKINS dizisini (App.js satır 210-369) → `constants/skins.js`
   - POWERUPS dizisini (satır 372-400) → `constants/powerups.js`
   - ACHIEVEMENTS_LIST'i (satır 407-418) → `constants/achievements.js`
   - Privacy policy/terms (satır 43-208) → `constants/legalText.js`
   - IAP_PRODUCT_IDS (satır 27-31) → `constants/iapProducts.js`
   - Magic number'ları → `constants/gameConfig.js`
   - Renk değerlerini → `constants/colors.js`

2. App.js'de import et ve çalıştığını doğrula

### Faz 2: Storage Katmanı (Orta, 2-3 saat)
3. `src/services/storage/index.js` oluştur
   - Generic `saveData`, `loadData`, `removeData` fonksiyonları
   - Type-safe wrappers (saveCoins, loadCoins, etc.)
   - Tüm AsyncStorage operasyonlarını buraya taşı (satır 683-804 arası duplicate kodlar)

4. Storage keys'leri `src/services/storage/keys.js`'e taşı

5. App.js'deki tüm storage çağrılarını yeni servisle değiştir

### Faz 3: Custom Hooks (Orta-Zor, 4-6 saat)
6. `src/hooks/useStorage.js` oluştur
   - Tüm load/save fonksiyonlarını hook'a taşı
   - State management ile entegre et

7. `src/hooks/useAudio.js` oluştur
   - Sound loading (satır 546-623)
   - Play/stop fonksiyonları
   - Music/sound enable/disable logic

8. `src/hooks/useAchievements.js` oluştur
   - Achievement checking logic (satır 1174-1254)
   - Unlock ve notification logic

9. `src/hooks/useGameStats.js` oluştur
   - Statistics update fonksiyonları
   - High score tracking

10. `src/hooks/useDailyRewards.js` oluştur
    - Daily login logic
    - Streak calculation
    - Daily tasks

### Faz 4: Utilities ve Helpers (Orta, 3-4 saat)
11. `src/utils/ballPhysics.js` oluştur
    - Ball movement calculation
    - Speed calculations
    - Position updates

12. `src/utils/collisionDetection.js` oluştur
    - `checkBallReached` fonksiyonunu böl (satır 1683-1810)
    - Collision detection logic
    - Match validation

13. `src/utils/particleSystem.js` oluştur
    - Particle generation
    - Particle physics

14. `src/utils/dateUtils.js` oluştur
    - Date comparison
    - Streak calculation helpers

### Faz 5: Services (Orta, 3-4 saat)
15. `src/services/monetization/iap.js` oluştur
    - IAP initialization
    - Purchase handling (satır 998-1045'i refactor et)
    - Restore purchases

16. `src/services/monetization/ads.js` oluştur
    - Ad loading/showing
    - Reward handling

17. `src/services/achievements/index.js` oluştur
    - Achievement service
    - Progress tracking

### Faz 6: State Management (Zor, 4-6 saat)
18. useReducer veya Context API ile state'i gruplandır:
    - Game state (score, balls, particles, speed)
    - Settings state (sound, music, haptic)
    - User state (coins, adsRemoved, owned items)
    - UI state (modals, popups, current screen)

19. `src/context/GameContext.js` veya reducer'lar oluştur

### Faz 7: Komponentler (Orta, 4-5 saat)
20. Küçük UI komponentleri oluştur:
    - `src/components/ui/Button.js`
    - `src/components/ui/Modal.js`
    - `src/components/ui/Toast.js`
    - `src/components/ui/Card.js`

21. Game komponentleri:
    - `src/components/game/Ball.js` (React.memo ile)
    - `src/components/game/Particle.js` (React.memo ile)
    - `src/components/game/ColorBox.js`
    - `src/components/game/PowerupButton.js`

### Faz 8: Ekranları Ayırma (Zor, 6-8 saat)
22. Her ekranı ayrı dosyaya taşı:
    - MenuScreen (satır 2779-2937)
    - GameScreen (oyun loop'u içeren ana kısım)
    - GameOverScreen (satır 2940-3018)
    - TutorialScreen (satır 2696-2776)
    - AchievementsScreen (satır 2289-2361)
    - SkinsScreen (satır 2079-2177)
    - PowerupsScreen (satır 2181-2286)
    - StoreScreen (satır 2444-2692)
    - DailyTasksScreen (satır 2365-2440)

23. Her ekran kendi prop'larını alsın, context'ten state kullansın

### Faz 9: Stiller (Kolay, 2-3 saat)
24. Stilleri modülerleştir:
    - `src/styles/theme.js` (renkler, spacing, typography)
    - `src/styles/commonStyles.js` (ortak stiller)
    - Her ekran için ayrı style dosyası

### Faz 10: Ana Dosyayı Temizleme (Orta, 2-3 saat)
25. App.js'i sadece orchestrator yap:
    - Context provider'lar
    - Screen routing
    - Global effects (ads, IAP init)
    - Minimal logic

### Faz 11: Optimizasyon (Orta-Zor, 3-4 saat)
26. Performance optimizations:
    - React.memo ekle
    - useMemo/useCallback optimize et
    - requestAnimationFrame kullan (satır 1557-1634 game loop)
    - Inline style objelerini düzelt

27. Code review ve cleanup:
    - Unused imports temizle
    - Console.log'ları kaldır
    - PropTypes veya TypeScript ekle (opsiyonel)

## Önemli Notlar

### Refactoring Sırasında Dikkat Edilecekler:
- ✅ Her adımdan sonra oyunun çalıştığından emin ol
- ✅ Bir seferde bir faz üzerinde çalış
- ✅ Git commit'leri düzenli at (her fazdan sonra)
- ✅ Mevcut fonksiyoneliteyi bozmamaya özen göster
- ✅ Test et: oyun akışı, IAP, achievements, storage, ads

### Korunması Gereken Kritik Fonksiyonlar:
- Game loop (satır 1555-1642)
- checkBallReached collision detection (satır 1683-1810)
- directBall user input handling (satır 1645-1680)
- IAP purchase flow (satır 998-1045)
- Achievement unlocking (satır 1174-1254)
- Daily rewards (satır 1258-1354)

### Özel Dikkat Gereken Yerler:
- Game loop performansı kritik (60 FPS korunmalı)
- Storage operasyonları async, race condition olmamalı
- IAP restore purchases düzgün çalışmalı
- Achievement notification sistemi bozulmamalı
- Ad timing'leri korunmalı (her 3 oyunda bir)

## Beklediğim Çıktılar

1. **Modüler yapı:** Her dosya tek bir sorumluluğa sahip
2. **Temiz kod:** Duplicate kod yok, her fonksiyon <50 satır
3. **Performans:** Aynı veya daha iyi FPS
4. **Maintainability:** Yeni özellik eklemek kolay
5. **Test edilebilirlik:** Birim testler yazılabilir halde

## Nasıl İlerleyelim?

Lütfen şu şekilde ilerleyelim:
1. **Her fazı adım adım yapalım** - Bir fazı tamamlayıp test ettikten sonra bir sonrakine geçelim
2. **TodoWrite kullan** - Her fazın alt görevlerini todo olarak takip et
3. **Git commit'leri** - Her anlamlı değişiklikten sonra commit at
4. **Test et** - Her adımdan sonra oyunu çalıştır ve doğrula

