import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import {
  initializeAdMob,
  loadInterstitialAd,
  showInterstitialAd,
  isInterstitialReady,
  loadRewardedAd,
  showRewardedAd,
  isRewardedAdReady,
  initializeIAP,
  loadProducts,
  purchaseProduct,
  restorePurchases,
  hasRemovedAds,
  hasPremiumSkins,
  getAvailableProducts,
  AdMobBanner,
  BannerAdSize,
  AD_UNIT_IDS,
  IAP_PRODUCT_IDS,
} from './monetization';
import { COLORS } from './src/constants/colors';
import { SKINS } from './src/constants/skins';
import { POWERUPS } from './src/constants/powerups';
import { ACHIEVEMENTS_LIST } from './src/constants/achievements';
import { privacyPolicyText, termsOfServiceText } from './src/constants/legalText';
import { BALL_SIZE, INITIAL_SPEED, SPEED_INCREMENT } from './src/constants/gameConfig';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver, tutorial, achievements, stats, store, dailyTasks
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [balls, setBalls] = useState([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [particles, setParticles] = useState([]); // Parçacık efektleri için
  // İlk değer: Manuel hesaplama (toplar için), sonra onLayout ile gerçek değer güncellenecek
  const [boxContainerY, setBoxContainerY] = useState(height - 160 - 95); // scoreBar(95) çıkarılmış
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false); // Ayarlar modal
  const [previousGameState, setPreviousGameState] = useState('menu'); // Ayarlar öncesi state

  // Ayarlar state'leri
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // İstatistikler state'leri
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalCorrectMatches, setTotalCorrectMatches] = useState(0);
  const [totalWrongMatches, setTotalWrongMatches] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Başarımlar state'leri
  const [achievements, setAchievements] = useState({});
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [sessionAchievements, setSessionAchievements] = useState([]); // Bu oyun oturumunda kazanılan başarımlar

  // Günlük görevler ve ödüller
  const [dailyLoginStreak, setDailyLoginStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState('');
  const [dailyTasks, setDailyTasks] = useState([]);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

  // Monetizasyon state'leri
  const [coins, setCoins] = useState(0);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [premiumSkinsOwned, setPremiumSkinsOwned] = useState(false);
  const [iapProducts, setIapProducts] = useState([]);
  const [iapLoading, setIapLoading] = useState(false);
  const [gamesPlayedSinceAd, setGamesPlayedSinceAd] = useState(0);
  const [continueUsesToday, setContinueUsesToday] = useState(0);
  const [countdown, setCountdown] = useState(0); // Devam etmeden önce geri sayım

  // Skin state'leri
  const [selectedSkin, setSelectedSkin] = useState('default');
  const [ownedSkins, setOwnedSkins] = useState(['default']);

  // Power-up state'leri
  const [powerupInventory, setPowerupInventory] = useState({
    slowmotion: 0,
    shield: 0,
    freeze: 0,
  });
  const [activePowerup, setActivePowerup] = useState(null);
  const [shieldActive, setShieldActive] = useState(false);
  const shieldActiveRef = useRef(false); // Shield'ın gerçek zamanlı durumu
  const shieldUsedBallsRef = useRef(new Set()); // Shield ile kaldırılan topların ID'lerini sakla
  const powerupTimeoutRef = useRef(null);
  const [powerupPurchasePopup, setPowerupPurchasePopup] = useState({ visible: false, message: '' });
  const powerupPopupTimeoutRef = useRef(null);
  const [shopPurchasePopup, setShopPurchasePopup] = useState({ visible: false, message: '' });
  const shopPopupTimeoutRef = useRef(null);

  const gameLoop = useRef(null);
  const ballIdCounter = useRef(0);
  const spawnTimer = useRef(0);
  const particleIdCounter = useRef(0);

  // Ses efektleri refs
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const clickSound = useRef(null);
  const backgroundMusic = useRef(null);

  // İlk yükleme - yüksek skor ve ayarları yükle
  useEffect(() => {
    loadHighScore();
    loadSettings();
    loadStats();
    loadAchievements();
    checkFirstLaunch();
    checkDailyLogin();
    loadSounds();
    initializeMonetization();
    loadCoins();
    loadSkins();
    loadPowerups();

    return () => {
      // Cleanup: ses dosyalarını unload et
      if (correctSound.current) correctSound.current.unloadAsync();
      if (wrongSound.current) wrongSound.current.unloadAsync();
      if (clickSound.current) clickSound.current.unloadAsync();
      if (backgroundMusic.current) backgroundMusic.current.unloadAsync();
    };
  }, []);

  // Başarımlar ekranına her girişte başarımları yeniden yükle
  useEffect(() => {
    if (gameState === 'achievements') {
      loadAchievements();
    }
  }, [gameState]);

  // İlk açılış kontrolü
  const checkFirstLaunch = async () => {
    try {
      const hasSeenTutorial = await AsyncStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        setGameState('tutorial');
      }
    } catch (error) {
      console.log('Tutorial kontrolü hatası:', error);
    }
  };

  // Ses dosyalarını yükle
  const loadSounds = async () => {
    try {
      const { sound: correct } = await Audio.Sound.createAsync(
        require('./assets/sounds/correct.mp3')
      );
      correctSound.current = correct;
      console.log('✅ Correct sound loaded');

      const { sound: wrong } = await Audio.Sound.createAsync(
        require('./assets/sounds/wrong.mp3')
      );
      wrongSound.current = wrong;
      console.log('✅ Wrong sound loaded');

      // Click sesi opsiyonel - yoksa hata vermesin
      try {
        const { sound: click } = await Audio.Sound.createAsync(
          require('./assets/sounds/click.mp3')
        );
        clickSound.current = click;
        console.log('✅ Click sound loaded');
      } catch (e) {
        console.log('⚠️ Click sound not found, using haptic only');
      }

      const { sound: music } = await Audio.Sound.createAsync(
        require('./assets/sounds/background.mp3'),
        { isLooping: true, shouldPlay: false, volume: 0.6 }
      );
      backgroundMusic.current = music;
      console.log('✅ Background music loaded');

    } catch (error) {
      console.log('❌ Ses yükleme hatası:', error);
    }
  };

  // Ses çal fonksiyonu
  const playSound = async (soundRef) => {
    if (!soundEnabled || !soundRef.current) return;

    try {
      await soundRef.current.replayAsync();
    } catch (error) {
      console.log('Ses çalma hatası:', error);
    }
  };

  // Müzik kontrol
  useEffect(() => {
    const controlMusic = async () => {
      if (!backgroundMusic.current) return;

      try {
        if (musicEnabled && gameState === 'playing' && !settingsVisible) {
          const status = await backgroundMusic.current.getStatusAsync();
          if (!status.isLoaded) {
            console.log('⚠️ Music not loaded yet');
            return;
          }
          if (!status.isPlaying) {
            console.log('🎵 Starting background music');
            await backgroundMusic.current.playAsync();
          }
        } else {
          const status = await backgroundMusic.current.getStatusAsync();
          if (status.isLoaded && status.isPlaying) {
            console.log('⏸️ Pausing background music');
            await backgroundMusic.current.pauseAsync();
          }
        }
      } catch (error) {
        console.log('❌ Müzik kontrolü hatası:', error);
      }
    };

    controlMusic();
  }, [musicEnabled, gameState, settingsVisible]);

  // Haptic feedback fonksiyonu
  const triggerHaptic = (type = 'light') => {
    if (!hapticEnabled) return;

    try {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.log('Haptic feedback hatası:', error);
    }
  };

  // Ayarları yükle
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.multiGet([
        'soundEnabled',
        'musicEnabled',
        'hapticEnabled'
      ]);

      settings.forEach(([key, value]) => {
        if (value !== null) {
          const boolValue = value === 'true';
          if (key === 'soundEnabled') setSoundEnabled(boolValue);
          if (key === 'musicEnabled') setMusicEnabled(boolValue);
          if (key === 'hapticEnabled') setHapticEnabled(boolValue);
        }
      });
    } catch (error) {
      console.log('Ayarlar yüklenirken hata:', error);
    }
  };

  // Ayarları kaydet
  const saveSetting = useCallback(async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.log('Ayar kaydedilirken hata:', error);
    }
  }, []);

  const loadHighScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem('highScore');
      if (savedHighScore !== null) {
        setHighScore(parseInt(savedHighScore));
      }
    } catch (error) {
      console.log('Yüksek skor yüklenirken hata:', error);
    }
  };

  const saveHighScore = async (newScore) => {
    try {
      if (newScore > highScore) {
        await AsyncStorage.setItem('highScore', newScore.toString());
        setHighScore(newScore);
        // Yeni rekor haptic ve ses efekti
        triggerHaptic('success');
        playSound(correctSound);
      }
    } catch (error) {
      console.log('Yüksek skor kaydedilirken hata:', error);
    }
  };

  // ============ MONETİZASYON FONKSİYONLARI ============

  // Coin sistemi
  const loadCoins = async () => {
    try {
      const savedCoins = await AsyncStorage.getItem('coins');
      if (savedCoins !== null) {
        setCoins(parseInt(savedCoins));
      }
    } catch (error) {
      console.log('Coin yüklenirken hata:', error);
    }
  };

  const saveCoins = async (newCoins) => {
    try {
      await AsyncStorage.setItem('coins', newCoins.toString());
      setCoins(newCoins);
    } catch (error) {
      console.log('Coin kaydedilirken hata:', error);
    }
  };

  const addCoins = async (amount) => {
    try {
      // Mevcut coin değerini AsyncStorage'dan al (en güncel değer)
      const savedCoins = await AsyncStorage.getItem('coins');
      const currentCoins = savedCoins ? parseInt(savedCoins) : 0;
      const newCoins = currentCoins + amount;
      await saveCoins(newCoins);
    } catch (error) {
      console.log('Coin eklenirken hata:', error);
    }
  };

  const spendCoins = async (amount) => {
    if (coins >= amount) {
      const newCoins = coins - amount;
      await saveCoins(newCoins);
      return true;
    }
    return false;
  };

  // Skin yükleme ve kaydetme
  const loadSkins = async () => {
    try {
      const savedSkin = await AsyncStorage.getItem('selectedSkin');
      if (savedSkin) setSelectedSkin(savedSkin);

      const savedOwnedSkins = await AsyncStorage.getItem('ownedSkins');
      if (savedOwnedSkins) {
        setOwnedSkins(JSON.parse(savedOwnedSkins));
      }
    } catch (error) {
      console.log('Skin yüklenirken hata:', error);
    }
  };

  const saveSkinSelection = async (skinId) => {
    try {
      await AsyncStorage.setItem('selectedSkin', skinId);
      setSelectedSkin(skinId);
    } catch (error) {
      console.log('Skin kaydedilirken hata:', error);
    }
  };

  const saveOwnedSkinsToStorage = async (skins) => {
    try {
      await AsyncStorage.setItem('ownedSkins', JSON.stringify(skins));
      setOwnedSkins(skins);
    } catch (error) {
      console.log('Sahip olunan skinler kaydedilirken hata:', error);
    }
  };

  // Power-up yükleme ve kaydetme
  const loadPowerups = async () => {
    try {
      const savedInventory = await AsyncStorage.getItem('powerupInventory');
      if (savedInventory) {
        setPowerupInventory(JSON.parse(savedInventory));
      }
    } catch (error) {
      console.log('Power-up yüklenirken hata:', error);
    }
  };

  const savePowerupInventory = async (inventory) => {
    try {
      await AsyncStorage.setItem('powerupInventory', JSON.stringify(inventory));
      setPowerupInventory(inventory);
    } catch (error) {
      console.log('Power-up envanteri kaydedilirken hata:', error);
    }
  };

  // Popup gösterme helper fonksiyonu (1 saniye sonra otomatik kapanır)
  const showShopPopup = (message) => {
    setShopPurchasePopup({ visible: true, message });

    // Önceki timer'ı temizle
    if (shopPopupTimeoutRef.current) {
      clearTimeout(shopPopupTimeoutRef.current);
    }

    // 1 saniye sonra otomatik kapat
    shopPopupTimeoutRef.current = setTimeout(() => {
      setShopPurchasePopup({ visible: false, message: '' });
    }, 1000);
  };

  // Skin satın alma fonksiyonu
  const buySkin = async (skinId) => {
    const skin = SKINS.find(s => s.id === skinId);
    if (!skin) return;

    // Zaten sahipse
    if (ownedSkins.includes(skinId)) {
      showShopPopup('Bu skine zaten sahipsin');
      return;
    }

    // Premium kontrol
    if (skin.isPremium && !premiumSkinsOwned) {
      showShopPopup('Premium Skin Paketi gerekli');
      return;
    }

    // Coin kontrol
    if (coins < skin.coinPrice) {
      showShopPopup(`${skin.coinPrice} coin gerekli`);
      return;
    }

    // Satın al
    const spent = await spendCoins(skin.coinPrice);
    if (spent) {
      const newOwnedSkins = [...ownedSkins, skinId];
      await saveOwnedSkinsToStorage(newOwnedSkins);

      // Otomatik seç
      await saveSkinSelection(skinId);

      triggerHaptic('success');
      playSound(clickSound);
      showShopPopup(`${skin.name} satın alındı! ✅`);
    }
  };

  // Skin seçme fonksiyonu
  const selectSkin = async (skinId) => {
    if (!ownedSkins.includes(skinId)) {
      showShopPopup('Bu skine sahip değilsin');
      return;
    }

    await saveSkinSelection(skinId);
    triggerHaptic('light');
    playSound(clickSound);
  };

  // Power-up satın alma fonksiyonu
  const buyPowerup = async (powerupId) => {
    const powerup = POWERUPS.find(p => p.id === powerupId);
    if (!powerup) return;

    if (coins < powerup.coinPrice) {
      showShopPopup(`${powerup.coinPrice} coin gerekli`);
      return;
    }

    const spent = await spendCoins(powerup.coinPrice);
    if (spent) {
      const newInventory = {
        ...powerupInventory,
        [powerupId]: (powerupInventory[powerupId] || 0) + 1
      };
      await savePowerupInventory(newInventory);

      triggerHaptic('success');
      playSound(clickSound);

      // Custom popup göster - 1 saniye sonra otomatik kapat
      setPowerupPurchasePopup({ visible: true, message: `${powerup.name} satın alındı!` });

      // Önceki timer'ı temizle
      if (powerupPopupTimeoutRef.current) {
        clearTimeout(powerupPopupTimeoutRef.current);
      }

      // 1 saniye sonra otomatik kapat
      powerupPopupTimeoutRef.current = setTimeout(() => {
        setPowerupPurchasePopup({ visible: false, message: '' });
      }, 1000);
    }
  };

  // Power-up kullanma fonksiyonu
  const usePowerup = async (powerupId) => {
    const powerup = POWERUPS.find(p => p.id === powerupId);
    if (!powerup) return;

    if (powerupInventory[powerupId] <= 0) {
      showShopPopup('Envanterde yok');
      return;
    }

    // Shield için activePowerup kontrolü yapma (çünkü shield sürekli aktif değil)
    if (powerup.effect !== 'shield' && activePowerup !== null) {
      showShopPopup('Zaten bir power-up aktif');
      return;
    }

    // Envanterden düş
    const newInventory = {
      ...powerupInventory,
      [powerupId]: powerupInventory[powerupId] - 1
    };
    await savePowerupInventory(newInventory);

    // Efekti aktif et
    if (powerup.effect === 'slowmotion') {
      setActivePowerup('slowmotion');
      triggerHaptic('medium');
      playSound(clickSound);

      if (powerupTimeoutRef.current) {
        clearTimeout(powerupTimeoutRef.current);
      }
      powerupTimeoutRef.current = setTimeout(() => {
        setActivePowerup(null);
      }, powerup.duration);
    } else if (powerup.effect === 'shield') {
      setShieldActive(true);
      shieldActiveRef.current = true; // Ref'i de set et
      triggerHaptic('medium');
      playSound(clickSound);
    } else if (powerup.effect === 'freeze') {
      setActivePowerup('freeze');
      triggerHaptic('medium');
      playSound(clickSound);

      if (powerupTimeoutRef.current) {
        clearTimeout(powerupTimeoutRef.current);
      }
      powerupTimeoutRef.current = setTimeout(() => {
        setActivePowerup(null);
      }, powerup.duration);
    }
  };

  // Seçili skin'in renklerini al
  const getCurrentSkinColors = () => {
    const skin = SKINS.find(s => s.id === selectedSkin);
    return skin ? skin.colors : SKINS[0].colors;
  };

  // Seçili skin'in temasını al
  const getCurrentSkinTheme = () => {
    const skin = SKINS.find(s => s.id === selectedSkin);
    return skin ? skin.theme : SKINS[0].theme;
  };

  // Monetizasyon başlatma
  const initializeMonetization = async () => {
    // AdMob başlat
    const adMobInitialized = await initializeAdMob();
    if (adMobInitialized) {
      loadInterstitialAd();
      loadRewardedAd();
    }

    // IAP başlat
    const iapCleanup = await initializeIAP();
    if (iapCleanup) {
      // IAP başarıyla başlatıldı
      const products = await loadProducts();
      setIapProducts(products);

      // Satın alınmış ürünleri kontrol et
      const removedAds = hasRemovedAds();
      const premiumSkins = hasPremiumSkins();
      setAdsRemoved(removedAds);
      setPremiumSkinsOwned(premiumSkins);
    }
  };

  // IAP fonksiyonları
  const handlePurchase = async (productId) => {
    try {
      setIapLoading(true);
      await purchaseProduct(productId);

      // Satın alma başarılı
      if (productId === IAP_PRODUCT_IDS.removeAds) {
        setAdsRemoved(true);
        showShopPopup('Reklamlar kaldırıldı! 🎉');
      } else if (productId === IAP_PRODUCT_IDS.premiumSkins) {
        setPremiumSkinsOwned(true);

        // Tüm premium skinleri aç
        const premiumSkinIds = SKINS.filter(s => s.isPremium).map(s => s.id);
        const newOwnedSkins = [...new Set([...ownedSkins, ...premiumSkinIds])];
        await saveOwnedSkinsToStorage(newOwnedSkins);

        showShopPopup('Premium skin paketi açıldı! 🎨');
      } else if (productId === IAP_PRODUCT_IDS.powerUpPack) {
        // Power-up paketi: 5 Slow Motion + 5 Shield + 5 Freeze
        const newInventory = {
          ...powerupInventory,
          slowmotion: (powerupInventory.slowmotion || 0) + 5,
          shield: (powerupInventory.shield || 0) + 5,
          freeze: (powerupInventory.freeze || 0) + 5,
        };
        await savePowerupInventory(newInventory);
        showShopPopup('Power-up paketi açıldı! ⚡');
      } else if (productId === IAP_PRODUCT_IDS.coinPackSmall) {
        await addCoins(100);
        showShopPopup('100 coin kazandınız! 💰');
      } else if (productId === IAP_PRODUCT_IDS.coinPackMedium) {
        await addCoins(600);
        showShopPopup('600 coin kazandınız! 💰');
      } else if (productId === IAP_PRODUCT_IDS.coinPackLarge) {
        await addCoins(1500);
        showShopPopup('1500 coin kazandınız! 💰');
      }

      triggerHaptic('success');
      playSound(correctSound);
    } catch (error) {
      showShopPopup('Satın alma başarısız');
      console.error('Purchase error:', error);
    } finally {
      setIapLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIapLoading(true);
      const purchases = await restorePurchases();

      if (purchases.length > 0) {
        // Satın alınanları kontrol et ve ayarla
        const removedAds = hasRemovedAds();
        const premiumSkins = hasPremiumSkins();
        setAdsRemoved(removedAds);
        setPremiumSkinsOwned(premiumSkins);

        // Premium skinler satın alındıysa, tüm premium skinleri aç
        if (premiumSkins) {
          const premiumSkinIds = SKINS.filter(s => s.isPremium).map(s => s.id);
          const newOwnedSkins = [...new Set([...ownedSkins, ...premiumSkinIds])];
          await saveOwnedSkinsToStorage(newOwnedSkins);
        }

        showShopPopup('Satın almalar geri yüklendi! ✅');
        triggerHaptic('success');
      } else {
        showShopPopup('Geri yüklenecek satın alma yok');
      }
    } catch (error) {
      showShopPopup('Geri yükleme başarısız');
      console.error('Restore error:', error);
    } finally {
      setIapLoading(false);
    }
  };

  // Rewarded video ile devam etme
  const handleContinueWithAd = () => {
    if (continueUsesToday >= 3) {
      showShopPopup('Günlük limit aşıldı 🕐');
      return;
    }

    if (!isRewardedAdReady()) {
      showShopPopup('Reklam hazır değil...');
      return;
    }

    const success = showRewardedAd((earnedReward) => {
      if (earnedReward) {
        // Oyuna devam et
        setContinueUsesToday(continueUsesToday + 1);
        // 3 saniye geri sayım başlat
        setCountdown(3);
        setGameState('playing');
        triggerHaptic('success');
      } else {
        showShopPopup('Reklam izlenmedi');
      }
    });

    if (!success) {
      showShopPopup('Reklam gösterilemedi');
    }
  };

  // Rewarded video ile coin kazanma
  const handleWatchAdForCoins = () => {
    if (!isRewardedAdReady()) {
      showShopPopup('Reklam hazır değil...');
      return;
    }

    const success = showRewardedAd((earnedReward) => {
      if (earnedReward) {
        addCoins(25);
        triggerHaptic('success');
        playSound(correctSound);
        showShopPopup('25 coin kazandınız! 💰');
      }
    });

    if (!success) {
      showShopPopup('Reklam gösterilemedi');
    }
  };

  // ============ MONETİZASYON FONKSİYONLARI BİTİŞ ============

  // İstatistikleri yükle
  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.multiGet([
        'totalGamesPlayed',
        'totalScore',
        'totalCorrectMatches',
        'totalWrongMatches',
        'longestStreak',
      ]);

      stats.forEach(([key, value]) => {
        if (value !== null) {
          const numValue = parseInt(value);
          if (key === 'totalGamesPlayed') setTotalGamesPlayed(numValue);
          if (key === 'totalScore') setTotalScore(numValue);
          if (key === 'totalCorrectMatches') setTotalCorrectMatches(numValue);
          if (key === 'totalWrongMatches') setTotalWrongMatches(numValue);
          if (key === 'longestStreak') setLongestStreak(numValue);
        }
      });
    } catch (error) {
      console.log('İstatistikler yüklenirken hata:', error);
    }
  };

  // İstatistikleri kaydet
  const saveStats = async () => {
    try {
      await AsyncStorage.multiSet([
        ['totalGamesPlayed', totalGamesPlayed.toString()],
        ['totalScore', totalScore.toString()],
        ['totalCorrectMatches', totalCorrectMatches.toString()],
        ['totalWrongMatches', totalWrongMatches.toString()],
        ['longestStreak', longestStreak.toString()],
      ]);
    } catch (error) {
      console.log('İstatistikler kaydedilirken hata:', error);
    }
  };

  // Başarımları yükle
  const loadAchievements = async () => {
    try {
      console.log('📥 loadAchievements çağrıldı');
      const savedAchievements = await AsyncStorage.getItem('achievements');
      console.log('💾 AsyncStorage\'dan gelen veri:', savedAchievements);

      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        console.log('✅ Parse edilmiş başarımlar:', parsed);
        setAchievements(parsed);
      } else {
        // İlk yükleme - tüm başarımları kilitle
        console.log('⚠️ AsyncStorage boş, başarımlar ilk defa oluşturuluyor');
        const initialAchievements = {};
        ACHIEVEMENTS_LIST.forEach(achievement => {
          initialAchievements[achievement.id] = { unlocked: false, progress: 0 };
        });
        setAchievements(initialAchievements);
      }
    } catch (error) {
      console.log('❌ Başarımlar yüklenirken hata:', error);
    }
  };

  // Başarım kontrolü ve kilidi aç
  const checkAndUnlockAchievement = async (achievementId, currentProgress) => {
    console.log('🎯 checkAndUnlockAchievement çağrıldı:', achievementId, 'Progress:', currentProgress);

    const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
    if (!achievement) {
      console.log('❌ Başarım bulunamadı:', achievementId);
      return;
    }

    console.log('✅ Başarım bulundu:', achievement.title, 'Gereksinim:', achievement.requirement);

    // AsyncStorage'dan güncel veriyi oku (race condition önlemek için)
    const savedAchievements = await AsyncStorage.getItem('achievements');
    const currentAchievements = savedAchievements ? JSON.parse(savedAchievements) : {};

    const currentState = currentAchievements[achievementId];
    console.log('📊 Mevcut durum:', currentState);

    if (currentState && currentState.unlocked) {
      console.log('⏭️ Zaten açılmış, atlanıyor');
      return; // Zaten açılmış
    }

    const newProgress = Math.min(currentProgress, achievement.requirement);
    const unlocked = newProgress >= achievement.requirement;

    console.log('📈 Progress:', newProgress, 'Unlocked:', unlocked);

    const updatedAchievements = {
      ...currentAchievements,
      [achievementId]: { unlocked, progress: newProgress }
    };

    setAchievements(updatedAchievements);
    await AsyncStorage.setItem('achievements', JSON.stringify(updatedAchievements));

    if (unlocked && (!currentState || !currentState.unlocked)) {
      // Yeni başarım açıldı!
      console.log('🎉 YENİ BAŞARIM AÇILDI:', achievement.title);
      triggerHaptic('success');
      playSound(correctSound);
      showAchievementToast(achievement);
    }
  };

  // Başarım bildirimi göster (Artık sadece session'a ekliyor, oyun sırasında bildirim göstermiyor)
  const showAchievementToast = (achievement) => {
    // Bu oyun oturumunda kazanılan başarımları sakla
    setSessionAchievements(prev => {
      const alreadyAdded = prev.find(a => a.id === achievement.id);
      if (alreadyAdded) return prev;
      return [...prev, achievement];
    });
  };

  // Günlük giriş kontrolü
  const checkDailyLogin = async () => {
    try {
      const today = new Date().toDateString();
      const lastLogin = await AsyncStorage.getItem('lastLoginDate');
      const streak = await AsyncStorage.getItem('dailyLoginStreak');

      if (lastLogin !== today) {
        // Yeni gün girişi
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = 1;
        if (lastLogin === yesterdayStr) {
          // Ardışık gün
          newStreak = (streak ? parseInt(streak) : 0) + 1;
        }

        setDailyLoginStreak(newStreak);
        setLastLoginDate(today);
        setDailyRewardClaimed(false);

        await AsyncStorage.multiSet([
          ['lastLoginDate', today],
          ['dailyLoginStreak', newStreak.toString()],
          ['dailyRewardClaimed', 'false'],
        ]);

        // Günlük streak başarımlarını kontrol et
        checkAndUnlockAchievement('dedicated', newStreak);

        // Günlük görevleri oluştur
        generateDailyTasks();
      } else {
        // Aynı gün
        setDailyLoginStreak(streak ? parseInt(streak) : 1);
        setLastLoginDate(lastLogin);
        const claimed = await AsyncStorage.getItem('dailyRewardClaimed');
        setDailyRewardClaimed(claimed === 'true');
        loadDailyTasks();
      }
    } catch (error) {
      console.log('Günlük giriş kontrolü hatası:', error);
    }
  };

  // Günlük görevler oluştur
  const generateDailyTasks = () => {
    const tasks = [
      { id: 'play_5', title: '5 oyun oyna', target: 5, progress: 0, completed: false },
      { id: 'score_25', title: '25 puan kazan (tek oyunda)', target: 25, progress: 0, completed: false },
      { id: 'match_10', title: '10 doğru eşleşme yap', target: 10, progress: 0, completed: false },
    ];
    setDailyTasks(tasks);
    AsyncStorage.setItem('dailyTasks', JSON.stringify(tasks));
  };

  // Günlük görevleri yükle
  const loadDailyTasks = async () => {
    try {
      const tasks = await AsyncStorage.getItem('dailyTasks');
      if (tasks) {
        setDailyTasks(JSON.parse(tasks));
      } else {
        generateDailyTasks();
      }
    } catch (error) {
      console.log('Günlük görevler yüklenirken hata:', error);
    }
  };

  // Günlük görev güncelle
  const updateDailyTask = async (taskId, progress) => {
    const updatedTasks = dailyTasks.map(task => {
      if (task.id === taskId) {
        const newProgress = Math.min(progress, task.target);
        const completed = newProgress >= task.target;
        return { ...task, progress: newProgress, completed };
      }
      return task;
    });

    setDailyTasks(updatedTasks);
    await AsyncStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
  };

  // Skorları sıfırla
  const resetAllScores = async () => {
    try {
      await AsyncStorage.multiRemove([
        'highScore',
        'totalGamesPlayed',
        'totalScore',
        'totalCorrectMatches',
        'totalWrongMatches',
        'longestStreak',
        'achievements',
        'dailyLoginStreak',
        'lastLoginDate',
        'dailyTasks',
        'dailyRewardClaimed',
      ]);

      setHighScore(0);
      setTotalGamesPlayed(0);
      setTotalScore(0);
      setTotalCorrectMatches(0);
      setTotalWrongMatches(0);
      setLongestStreak(0);
      setCurrentStreak(0);

      const initialAchievements = {};
      ACHIEVEMENTS_LIST.forEach(achievement => {
        initialAchievements[achievement.id] = { unlocked: false, progress: 0 };
      });
      setAchievements(initialAchievements);

      setDailyLoginStreak(0);
      setDailyTasks([]);

      triggerHaptic('success');
      alert('Tüm skorlar ve başarımlar sıfırlandı!');
    } catch (error) {
      console.log('Skorlar sıfırlanırken hata:', error);
    }
  };

  // Tutorial'ı tamamla
  const completeTutorial = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTutorial', 'true');
      setShowTutorial(false);
      setGameState('menu');
      setTutorialStep(0);
    } catch (error) {
      console.log('Tutorial tamamlanırken hata:', error);
    }
  };

  // Tutorial'ı tekrar göster
  const restartTutorial = useCallback(() => {
    setTutorialStep(0);
    setShowTutorial(true);
    setSettingsVisible(false); // Ayarları kapat
    setGameState('tutorial');
  }, []);

  // Ayarlar menüsünü aç
  const openSettings = () => {
    setPreviousGameState(gameState); // Mevcut state'i kaydet
    setSettingsVisible(true);
    triggerHaptic('light');

    // Eğer oyun oynuyorsa, oyun loop'unu durdur (pause)
    if (gameState === 'playing' && gameLoop.current) {
      clearInterval(gameLoop.current);
      gameLoop.current = null;
    }
  };

  // Ayarlar menüsünü kapat
  const closeSettings = useCallback(() => {
    setSettingsVisible(false);
    triggerHaptic('light');

    // Eğer önceki state playing ise, oyunu devam ettir (resume)
    if (previousGameState === 'playing') {
      // Game loop'u yeniden başlatmak için gameState'i tetikle
      setGameState('playing');
    }
  }, [previousGameState]);

  // Switch handler'ları - useCallback ile optimize edilmiş
  const handleSoundToggle = useCallback((value) => {
    setSoundEnabled(value);
    saveSetting('soundEnabled', value);
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [hapticEnabled, saveSetting]);

  const handleMusicToggle = useCallback((value) => {
    setMusicEnabled(value);
    saveSetting('musicEnabled', value);
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [hapticEnabled, saveSetting]);

  const handleHapticToggle = useCallback((value) => {
    setHapticEnabled(value);
    saveSetting('hapticEnabled', value);
    if (value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [saveSetting]);

  // Oyunu başlat
  const startGame = () => {
    triggerHaptic('medium');
    playSound(clickSound);
    setGameState('playing');
    setScore(0);
    setBalls([]);
    setParticles([]);
    setSpeed(INITIAL_SPEED);
    ballIdCounter.current = 0;
    spawnTimer.current = 0;
    shieldUsedBallsRef.current.clear(); // Shield referansını temizle
    setShieldActive(false); // Shield'ı deaktif et
    shieldActiveRef.current = false; // Shield ref'ini de sıfırla
    setSessionAchievements([]); // Yeni oyun başladığında başarımları temizle
    spawnBall();
  };

  // Parçacık efekti oluştur
  const createParticles = (x, y, color, isSuccess = true) => {
    const particleCount = isSuccess ? 16 : 12; // Daha fazla parçacık
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = isSuccess ? 8 : 5; // Daha hızlı
      const particle = {
        id: particleIdCounter.current++,
        x: x + BALL_SIZE / 2,
        y: y + BALL_SIZE / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: isSuccess ? color : '#FF3B30',
        opacity: new Animated.Value(1),
        size: isSuccess ? 12 : 10, // Daha büyük parçacıklar
      };
      newParticles.push(particle);

      // Parçacığı kaybet
      Animated.timing(particle.opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Parçacıkları temizle
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 900);
  };

  // Yeni top oluştur
  const spawnBall = () => {
    setBalls((prevBalls) => {
      const topMostBall = prevBalls.length > 0
        ? prevBalls.reduce((top, ball) => ball.y < top.y ? ball : top, prevBalls[0])
        : null;

      const minSpawnDistance = BALL_SIZE * 1.5;
      if (topMostBall && topMostBall.y < minSpawnDistance) {
        return prevBalls;
      }

      // Seçili skin'in renklerini kullan
      const skinColors = getCurrentSkinColors();
      const randomColorIndex = Math.floor(Math.random() * COLORS.length);
      const skinColorIndex = randomColorIndex % skinColors.length;
      const randomColorHex = skinColors[skinColorIndex];
      const gameColor = COLORS[randomColorIndex];

      const newBall = {
        id: ballIdCounter.current++,
        colorId: gameColor.id,
        colorIndex: randomColorIndex, // Index ekle
        color: randomColorHex,
        x: Math.random() * (width - BALL_SIZE),
        y: -BALL_SIZE,
        fadeAnim: new Animated.Value(1),
        scaleAnim: new Animated.Value(1),
        targetX: null,
        targetColorIndex: null, // Index için hedef ekle
        isDirected: false,
      };

      return [...prevBalls, newBall];
    });
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        triggerHaptic('light');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Ana oyun döngüsü
  useEffect(() => {
    if (gameState === 'playing' && !settingsVisible && countdown === 0) {
      gameLoop.current = setInterval(() => {
        // Freeze efekti aktifse topları dondur
        if (activePowerup === 'freeze') {
          return;
        }

        setBalls((prevBalls) => {
          const updatedBalls = prevBalls.map((ball) => {
            let newX = ball.x;
            // Slow motion efekti - hızı yarıya düşür
            const currentSpeed = activePowerup === 'slowmotion' ? speed / 2 : speed;
            let newY = ball.y + currentSpeed;

            if (ball.isDirected && ball.targetX !== null) {
              const diff = ball.targetX - ball.x;
              const moveSpeed = 80;

              if (Math.abs(diff) > 1) {
                newX = ball.x + Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed);
              } else {
                newX = ball.targetX;
              }
            }

            const sortedBalls = prevBalls
              .filter((b) => b.id !== ball.id && b.y > ball.y)
              .sort((a, b) => a.y - b.y);

            if (sortedBalls.length > 0) {
              const closestBallBelow = sortedBalls[0];
              const minDistance = BALL_SIZE * 2;

              if (closestBallBelow.y - newY < minDistance) {
                newY = ball.y;
              }
            }

            return {
              ...ball,
              x: newX,
              y: newY,
            };
          });

          const activeBalls = updatedBalls.filter((ball) => {
            // onLayout ile ölçülmüş GERÇEK pozisyonu kullan
            if (boxContainerY === null) {
              return true; // Henüz ölçülmemişse topları tut
            }

            // Topun alt hizasını hesapla
            const ballBottom = ball.y + BALL_SIZE;

            // Çarpışma kontrolü: Top container'a ulaştı mı?
            if (ballBottom >= boxContainerY) {
              return !checkBallReached(ball);
            }

            return true;
          });

          return activeBalls;
        });

        // Parçacık animasyonu
        setParticles(prev => prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3, // Yerçekimi
        })));

        spawnTimer.current++;
        if (spawnTimer.current >= 40) {
          spawnTimer.current = 0;
          spawnBall();
        }
      }, 16);

      return () => {
        if (gameLoop.current) {
          clearInterval(gameLoop.current);
        }
      };
    }
  }, [gameState, speed, settingsVisible, countdown, activePowerup]);

  // Top yakalama ve yönlendirme
  const directBall = (ballId, targetColorId, boxIndex) => {
    triggerHaptic('light');
    playSound(clickSound);

    setBalls((prevBalls) => {
      return prevBalls.map((ball) => {
        if (ball.id === ballId && !ball.isDirected) {
          const boxWidth = width / 4;
          const targetX = boxIndex * boxWidth + (boxWidth / 2) - (BALL_SIZE / 2);

          // Top yakalandığında hafif bir büyüme animasyonu
          Animated.sequence([
            Animated.timing(ball.scaleAnim, {
              toValue: 1.2,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(ball.scaleAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();

          return {
            ...ball,
            targetX: targetX,
            isDirected: true,
            targetColorId: targetColorId,
            targetColorIndex: boxIndex, // Index'i de kaydet
          };
        }
        return ball;
      });
    });
  };

  // Topu kutuya ulaştığında kontrol et
  const checkBallReached = (ball) => {
    // onLayout ile ölçülmüş GERÇEK pozisyonu kullan
    if (boxContainerY === null) return false;

    // Shield ile zaten işaretlenmiş bir top mu kontrol et
    if (shieldUsedBallsRef.current.has(ball.id)) {
      return false; // Bu topu tekrar kontrol etme
    }

    // Topun alt hizasını hesapla
    const ballBottom = ball.y + BALL_SIZE;

    // Çarpışma kontrolü
    if (ballBottom >= boxContainerY) {
      // Sadece yönlendirilmiş topları kontrol et
      if (ball.isDirected) {
        // Index bazlı eşleştirme (skinler için)
        const isMatch = ball.colorIndex === ball.targetColorIndex;
        if (isMatch) {
          // Doğru eşleşme - topu kaybet (kutuya girsin)
          triggerHaptic('success');
          playSound(correctSound);
          createParticles(ball.x, ball.y, ball.color, true);

          Animated.timing(ball.fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            setBalls((prev) => prev.filter((b) => b.id !== ball.id));
          }, 200);

          // Streak güncelle
          const newStreak = currentStreak + 1;
          setCurrentStreak(newStreak);

          // İstatistikleri güncelle
          const newCorrectMatches = totalCorrectMatches + 1;
          setTotalCorrectMatches(newCorrectMatches);
          AsyncStorage.setItem('totalCorrectMatches', newCorrectMatches.toString());

          // Streak başarımlarını kontrol et
          checkAndUnlockAchievement('perfect_10', newStreak);
          checkAndUnlockAchievement('perfect_20', newStreak);

          // Günlük görev güncelle
          updateDailyTask('match_10', newCorrectMatches % 1000);

          setScore((prevScore) => {
            const newScore = prevScore + 1;

            if (newScore % 5 === 0) {
              setSpeed((prevSpeed) => prevSpeed + SPEED_INCREMENT);
            }

            return newScore;
          });

          return true;
        } else {
          // Yanlış eşleşme - Game Over
          // Shield kontrolü
          if (shieldActiveRef.current) {
            // Shield kullanıldı, oyun bitmesin, topu kaldır
            setShieldActive(false);
            shieldActiveRef.current = false;
            shieldUsedBallsRef.current.add(ball.id); // Bu topu işaretle
            triggerHaptic('warning');
            playSound(clickSound);

            // Topu kaldır
            Animated.timing(ball.fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();

            setTimeout(() => {
              setBalls((prev) => prev.filter((b) => b.id !== ball.id));
              shieldUsedBallsRef.current.delete(ball.id); // Temizle
            }, 200);

            // Shield kullanıldı - ekranda gösterge zaten var
            return true;
          } else {
            // Eşleşme yok - Game Over
            triggerHaptic('error');
            playSound(wrongSound);
            createParticles(ball.x, ball.y, ball.color, false);
            endGame();
            return true;
          }
        }
      } else {
        // Yönlendirilmemiş top kutuya ulaştı - Game Over
        if (shieldActiveRef.current) {
          // Shield kullanıldı
          setShieldActive(false);
          shieldActiveRef.current = false;
          shieldUsedBallsRef.current.add(ball.id); // Bu topu işaretle
          triggerHaptic('warning');
          playSound(clickSound);

          Animated.timing(ball.fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            setBalls((prev) => prev.filter((b) => b.id !== ball.id));
            shieldUsedBallsRef.current.delete(ball.id); // Temizle
          }, 200);

          return true;
        } else {
          // Yönlendirilmemiş top - Game Over
          triggerHaptic('error');
          playSound(wrongSound);
          endGame();
          return true;
        }
      }
    }
    return false;
  };

  // Oyunu bitir
  const endGame = async () => {
    setGameState('gameOver');
    saveHighScore(score);

    if (gameLoop.current) {
      clearInterval(gameLoop.current);
    }

    // İstatistikleri güncelle
    const newTotalGames = totalGamesPlayed + 1;
    const newTotalScore = totalScore + score;
    const newTotalWrong = totalWrongMatches + 1;

    setTotalGamesPlayed(newTotalGames);
    setTotalScore(newTotalScore);
    setTotalWrongMatches(newTotalWrong);

    // Streak kontrolü
    if (currentStreak > longestStreak) {
      setLongestStreak(currentStreak);
    }
    setCurrentStreak(0);

    // İstatistikleri kaydet
    await AsyncStorage.multiSet([
      ['totalGamesPlayed', newTotalGames.toString()],
      ['totalScore', newTotalScore.toString()],
      ['totalWrongMatches', newTotalWrong.toString()],
      ['longestStreak', Math.max(currentStreak, longestStreak).toString()],
    ]);

    // Başarımları kontrol et (sırayla - race condition önlemek için)
    await checkAndUnlockAchievement('first_game', newTotalGames);
    await checkAndUnlockAchievement('century', newTotalGames);
    await checkAndUnlockAchievement('beginner', score);
    await checkAndUnlockAchievement('expert', score);
    await checkAndUnlockAchievement('master', score);
    await checkAndUnlockAchievement('legend', score);

    // Günlük görevleri güncelle
    updateDailyTask('play_5', newTotalGames % 1000); // Bugünkü oyun sayısı
    if (score >= 25) {
      updateDailyTask('score_25', 25);
    }

    // Coin kazandır (puana göre)
    await addCoins(score);

    // Interstitial reklam göster (her 3-4 oyunda bir, reklamsız değilse)
    const newGamesCount = gamesPlayedSinceAd + 1;
    setGamesPlayedSinceAd(newGamesCount);

    if (!adsRemoved && newGamesCount >= 3) {
      // Reklam göster
      setTimeout(() => {
        if (isInterstitialReady()) {
          showInterstitialAd();
          setGamesPlayedSinceAd(0);
        }
      }, 1000); // 1 saniye gecikme (Game Over ekranı görünsün)
    }
  };

  // Yasal belgeleri göster
  const showPrivacyPolicy = useCallback(() => {
    setModalTitle('Gizlilik Politikası');
    setModalContent('privacy');
    setModalVisible(true);
  }, []);

  const showTermsOfService = useCallback(() => {
    setModalTitle('Kullanım Şartları');
    setModalContent('terms');
    setModalVisible(true);
  }, []);

  // Link açma fonksiyonu
  const openLink = useCallback(async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("URL açılamıyor: " + url);
      }
    } catch (error) {
      console.log('Link açılırken hata:', error);
    }
  }, []);

  // Ayarlar Modal - useMemo ile optimize edilmiş
  const SettingsModal = useMemo(() => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={settingsVisible}
      onRequestClose={closeSettings}
    >
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>⚙️ Ayarlar</Text>
            <TouchableOpacity
              style={styles.settingsCloseButton}
              onPress={closeSettings}
            >
              <Text style={styles.settingsCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.settingsContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🔊 Ses Efektleri</Text>
                <Text style={styles.settingDescription}>Oyun seslerini aç/kapat</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🎵 Müzik</Text>
                <Text style={styles.settingDescription}>Arka plan müziğini aç/kapat</Text>
              </View>
              <Switch
                value={musicEnabled}
                onValueChange={handleMusicToggle}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>📳 Titreşim</Text>
                <Text style={styles.settingDescription}>Haptic feedback aç/kapat</Text>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={handleHapticToggle}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={restartTutorial}
            >
              <Text style={styles.settingButtonText}>📖 Tutorial'ı Tekrar Göster</Text>
            </TouchableOpacity>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
              <View style={styles.settingsStats}>
                <Text style={styles.statsText}>En Yüksek Skor: {highScore}</Text>
                <Text style={styles.statsText}>Toplam Oyun: {totalGamesPlayed}</Text>
                <Text style={styles.statsText}>Toplam Puan: {totalScore}</Text>
                <Text style={styles.statsText}>Doğru Eşleşme: {totalCorrectMatches}</Text>
                <Text style={styles.statsText}>En Uzun Seri: {longestStreak}</Text>
                <Text style={styles.statsText}>Günlük Giriş Serisi: {dailyLoginStreak} gün</Text>
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>📜 Yasal</Text>
              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => {
                  closeSettings();
                  showPrivacyPolicy();
                }}
              >
                <Text style={styles.settingButtonText}>🔒 Gizlilik Politikası</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => {
                  closeSettings();
                  showTermsOfService();
                }}
              >
                <Text style={styles.settingButtonText}>📋 Kullanım Şartları</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => openLink('mailto:support@szrgame.com')}
              >
                <Text style={styles.settingButtonText}>📧 İletişim</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>ℹ️ Hakkında</Text>
              <View style={styles.aboutSection}>
                <Text style={styles.aboutText}>ColorDrop v1.0.0</Text>
                <Text style={styles.aboutText}>SZR Game Studios</Text>
                <Text style={styles.aboutTextSmall}>Renkli topları eşleştir, rekoru kır!</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.settingButton, styles.dangerButton]}
              onPress={() => {
                if (confirm('Tüm skorları, başarımları ve istatistikleri sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
                  resetAllScores();
                }
              }}
            >
              <Text style={[styles.settingButtonText, styles.dangerButtonText]}>🗑️ Skorları Sıfırla</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  ), [settingsVisible, soundEnabled, musicEnabled, hapticEnabled, highScore, totalGamesPlayed, totalScore, totalCorrectMatches, longestStreak, dailyLoginStreak, handleSoundToggle, handleMusicToggle, handleHapticToggle, closeSettings, restartTutorial, showPrivacyPolicy, showTermsOfService, openLink]);

  // Top bileşeni
  const Ball = ({ ball }) => {
    return (
      <Animated.View
        style={[
          styles.ball,
          {
            backgroundColor: ball.color,
            left: ball.x,
            top: ball.y,
            opacity: ball.fadeAnim,
            transform: [{ scale: ball.scaleAnim }],
          },
        ]}
      />
    );
  };

  // Parçacık bileşeni
  const Particle = ({ particle }) => {
    return (
      <Animated.View
        style={[
          styles.particle,
          {
            backgroundColor: particle.color,
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          },
        ]}
      />
    );
  };

  // Skinler ekranı
  if (gameState === 'skins') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.skinContainer}>
          <View style={styles.skinHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerHaptic('light');
                playSound(clickSound);
                setGameState('menu');
              }}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            <Text style={styles.skinTitle}>🎨 Skinler</Text>
            <View style={styles.coinIndicatorSmall}>
              <Text style={styles.coinIcon}>💰</Text>
              <Text style={styles.coinTextSmall}>{coins}</Text>
            </View>
          </View>

          <ScrollView
            style={styles.skinScrollView}
            contentContainerStyle={styles.skinScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {SKINS.map((skin) => {
              const isOwned = ownedSkins.includes(skin.id);
              const isSelected = selectedSkin === skin.id;
              const isLocked = !isOwned;
              const isPremiumLocked = skin.isPremium && !premiumSkinsOwned && !isOwned;

              return (
                <View key={skin.id} style={styles.skinCard}>
                  <View style={styles.skinCardLeft}>
                    <Text style={styles.skinEmoji}>{skin.emoji}</Text>
                    <View style={styles.skinInfo}>
                      <Text style={styles.skinName}>{skin.name}</Text>
                      <View style={styles.skinPreview}>
                        {skin.colors.slice(0, 4).map((color, index) => (
                          <View
                            key={index}
                            style={[styles.colorDot, { backgroundColor: color }]}
                          />
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={styles.skinCardRight}>
                    {isSelected ? (
                      <View style={styles.skinSelectedBadge}>
                        <Text style={styles.skinSelectedText}>✓ Kullanılıyor</Text>
                      </View>
                    ) : isOwned ? (
                      <TouchableOpacity
                        style={styles.skinSelectButton}
                        onPress={() => selectSkin(skin.id)}
                      >
                        <Text style={styles.skinSelectText}>Kullan</Text>
                      </TouchableOpacity>
                    ) : isPremiumLocked ? (
                      <View style={styles.skinLockedBadge}>
                        <Text style={styles.skinLockedText}>🔒 Premium</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.skinBuyButton}
                        onPress={() => buySkin(skin.id)}
                      >
                        <Text style={styles.skinBuyText}>{skin.coinPrice} 💰</Text>
                        <Text style={styles.skinBuyLabel}>Satın Al</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

            {!premiumSkinsOwned && (
              <View style={styles.premiumPromoBanner}>
                <Text style={styles.premiumPromoTitle}>🌟 Premium Skin Paketi</Text>
                <Text style={styles.premiumPromoText}>
                  Tüm premium skinleri aç!
                </Text>
                <TouchableOpacity
                  style={styles.premiumPromoButton}
                  onPress={() => setGameState('store')}
                >
                  <Text style={styles.premiumPromoButtonText}>Mağazaya Git</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Power-ups ekranı
  if (gameState === 'powerups') {
    const currentTheme = getCurrentSkinTheme();

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.powerupContainer}>
          <View style={styles.powerupHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerHaptic('light');
                playSound(clickSound);
                setGameState('menu');
              }}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            <Text style={styles.powerupTitle}>⚡ Power-Ups</Text>
            <View style={styles.coinIndicatorSmall}>
              <Text style={styles.coinIcon}>💰</Text>
              <Text style={styles.coinTextSmall}>{coins}</Text>
            </View>
          </View>

          <ScrollView
            style={styles.powerupScrollView}
            contentContainerStyle={styles.powerupScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {POWERUPS.map((powerup) => {
              const inventory = powerupInventory[powerup.id] || 0;

              return (
                <View key={powerup.id} style={styles.powerupCard}>
                  <View style={styles.powerupCardLeft}>
                    <Text style={styles.powerupEmoji}>{powerup.emoji}</Text>
                    <View style={styles.powerupInfo}>
                      <Text style={styles.powerupName}>{powerup.name}</Text>
                      <Text style={styles.powerupDescription}>{powerup.description}</Text>
                      <Text style={styles.powerupInventory}>
                        Envanter: {inventory} adet
                      </Text>
                    </View>
                  </View>

                  <View style={styles.powerupCardRight}>
                    <TouchableOpacity
                      style={styles.powerupBuyButton}
                      onPress={() => buyPowerup(powerup.id)}
                    >
                      <Text style={styles.powerupBuyPrice}>{powerup.coinPrice} 💰</Text>
                      <Text style={styles.powerupBuyLabel}>Satın Al</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View style={styles.powerupPromoBanner}>
              <Text style={styles.powerupPromoTitle}>⚡ Power-Up Paketi</Text>
              <Text style={styles.powerupPromoText}>
                5 Yavaş Çekim + 5 Kalkan + 5 Dondur
              </Text>
              <TouchableOpacity
                style={styles.powerupPromoButton}
                onPress={() => setGameState('store')}
              >
                <Text style={styles.powerupPromoButtonText}>Mağazaya Git</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.powerupGuideContainer}>
              <Text style={styles.powerupGuideTitle}>📖 Nasıl Kullanılır?</Text>
              <Text style={styles.powerupGuideText}>
                • Power-up'ları satın aldıktan sonra oyun ekranında kullanabilirsiniz
              </Text>
              <Text style={styles.powerupGuideText}>
                • Oyun sırasında üstte bulunan power-up butonlarına basın
              </Text>
              <Text style={styles.powerupGuideText}>
                • Her power-up tek kullanımlıktır, dikkatli kullanın!
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Power-up Satın Alma Popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={powerupPurchasePopup.visible}
          onRequestClose={() => setPowerupPurchasePopup({ visible: false, message: '' })}
        >
          <View style={styles.popupOverlay}>
            <View style={[styles.popupContainer, { backgroundColor: currentTheme.accentColor }]}>
              <Text style={styles.popupIcon}>✅</Text>
              <Text style={[styles.popupMessage, { color: currentTheme.scoreColor }]}>
                {powerupPurchasePopup.message}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Başarımlar ekranı
  if (gameState === 'achievements') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementsHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerHaptic('light');
                setGameState('menu');
              }}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            <Text style={styles.achievementsTitle}>🏆 Başarımlar</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.achievementsList} showsVerticalScrollIndicator={false}>
            {ACHIEVEMENTS_LIST.map((achievement) => {
              const state = achievements[achievement.id] || { unlocked: false, progress: 0 };
              const percentage = Math.min(100, (state.progress / achievement.requirement) * 100);

              return (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    state.unlocked && styles.achievementCardUnlocked
                  ]}
                >
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementIconText}>
                      {state.unlocked ? achievement.title.split(' ')[0] : '🔒'}
                    </Text>
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[
                      styles.achievementTitle,
                      !state.unlocked && styles.achievementTitleLocked
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    {!state.unlocked && (
                      <View style={styles.achievementProgress}>
                        <View style={styles.achievementProgressBar}>
                          <View
                            style={[
                              styles.achievementProgressFill,
                              { width: `${percentage}%` }
                            ]}
                          />
                        </View>
                        <Text style={styles.achievementProgressText}>
                          {state.progress} / {achievement.requirement}
                        </Text>
                      </View>
                    )}
                    {state.unlocked && (
                      <Text style={styles.achievementUnlockedText}>✓ Tamamlandı</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Günlük Görevler ekranı
  if (gameState === 'dailyTasks') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.dailyTasksContainer}>
          <View style={styles.dailyTasksHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerHaptic('light');
                setGameState('menu');
              }}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            <Text style={styles.dailyTasksTitle}>📋 Günlük Görevler</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.dailyStreakCard}>
            <Text style={styles.dailyStreakTitle}>🔥 Günlük Giriş Serisi</Text>
            <Text style={styles.dailyStreakValue}>{dailyLoginStreak} Gün</Text>
            <Text style={styles.dailyStreakDescription}>
              Her gün giriş yaparak serinizi artırın!
            </Text>
          </View>

          <ScrollView style={styles.dailyTasksList} showsVerticalScrollIndicator={false}>
            <Text style={styles.tasksHeader}>Bugünün Görevleri</Text>
            {dailyTasks.length === 0 ? (
              <View style={styles.noTasksCard}>
                <Text style={styles.noTasksText}>Henüz görev yok</Text>
                <Text style={styles.noTasksDescription}>Yarın yeni görevler gelecek!</Text>
              </View>
            ) : (
              dailyTasks.map((task) => (
                <View
                  key={task.id}
                  style={[
                    styles.taskCard,
                    task.completed && styles.taskCardCompleted
                  ]}
                >
                  <View style={styles.taskIcon}>
                    <Text style={styles.taskIconText}>
                      {task.completed ? '✓' : '○'}
                    </Text>
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleCompleted
                    ]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskProgress}>
                      <View style={styles.taskProgressBar}>
                        <View
                          style={[
                            styles.taskProgressFill,
                            { width: `${Math.min(100, (task.progress / task.target) * 100)}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.taskProgressText}>
                        {task.progress} / {task.target}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Mağaza ekranı
  if (gameState === 'store') {
    const currentTheme = getCurrentSkinTheme();

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.storeContainer}>
          <View style={styles.storeHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerHaptic('light');
                setGameState('menu');
              }}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            <Text style={styles.storeTitle}>🛒 Mağaza</Text>
            <View style={styles.coinIndicatorSmall}>
              <Text style={styles.coinIconSmall}>💰</Text>
              <Text style={styles.coinTextSmall}>{coins}</Text>
            </View>
          </View>

          <ScrollView style={styles.storeList} showsVerticalScrollIndicator={false}>
            {/* Reklam İzle - Coin Kazan */}
            <View style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Text style={styles.storeCardIcon}>📺</Text>
                <View style={styles.storeCardInfo}>
                  <Text style={styles.storeCardTitle}>Reklam İzle</Text>
                  <Text style={styles.storeCardDescription}>25 coin kazan</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.storeWatchAdButton}
                onPress={() => {
                  triggerHaptic('medium');
                  handleWatchAdForCoins();
                }}
              >
                <Text style={styles.storeWatchAdButtonText}>İZLE</Text>
              </TouchableOpacity>
            </View>

            {/* Reklamsız Versiyon */}
            <View style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Text style={styles.storeCardIcon}>🚫</Text>
                <View style={styles.storeCardInfo}>
                  <Text style={styles.storeCardTitle}>Reklamsız Versiyon</Text>
                  <Text style={styles.storeCardDescription}>
                    Tüm reklamları kaldır
                  </Text>
                </View>
              </View>
              {adsRemoved ? (
                <View style={styles.storePurchasedBadge}>
                  <Text style={styles.storePurchasedText}>✓ Satın Alındı</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.storeBuyButton}
                  onPress={() => {
                    triggerHaptic('medium');
                    handlePurchase(IAP_PRODUCT_IDS.removeAds);
                  }}
                  disabled={iapLoading}
                >
                  {iapLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.storeBuyButtonText}>$2.99</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Premium Skin Paketi */}
            <View style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Text style={styles.storeCardIcon}>🎨</Text>
                <View style={styles.storeCardInfo}>
                  <Text style={styles.storeCardTitle}>Premium Skin Paketi</Text>
                  <Text style={styles.storeCardDescription}>
                    Tüm premium skinleri aç
                  </Text>
                </View>
              </View>
              {premiumSkinsOwned ? (
                <View style={styles.storePurchasedBadge}>
                  <Text style={styles.storePurchasedText}>✓ Satın Alındı</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.storeBuyButton}
                  onPress={() => {
                    triggerHaptic('medium');
                    handlePurchase(IAP_PRODUCT_IDS.premiumSkins);
                  }}
                  disabled={iapLoading}
                >
                  {iapLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.storeBuyButtonText}>$1.99</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Power-Up Paketi */}
            <View style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Text style={styles.storeCardIcon}>⚡</Text>
                <View style={styles.storeCardInfo}>
                  <Text style={styles.storeCardTitle}>Power-Up Paketi</Text>
                  <Text style={styles.storeCardDescription}>
                    5 Yavaş Çekim + 5 Kalkan + 5 Dondur
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.storeBuyButton}
                onPress={() => {
                  triggerHaptic('medium');
                  handlePurchase(IAP_PRODUCT_IDS.powerUpPack);
                }}
                disabled={iapLoading}
              >
                {iapLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.storeBuyButtonText}>$0.99</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Coin Paketleri */}
            <Text style={styles.storeSectionTitle}>💰 Coin Paketleri</Text>

            <View style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Text style={styles.storeCardIcon}>💵</Text>
                <View style={styles.storeCardInfo}>
                  <Text style={styles.storeCardTitle}>Küçük Paket</Text>
                  <Text style={styles.storeCardDescription}>100 coin</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.storeBuyButton}
                onPress={() => {
                  triggerHaptic('medium');
                  handlePurchase(IAP_PRODUCT_IDS.coinPackSmall);
                }}
                disabled={iapLoading}
              >
                {iapLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.storeBuyButtonText}>$0.99</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Text style={styles.storeCardIcon}>💴</Text>
                <View style={styles.storeCardInfo}>
                  <Text style={styles.storeCardTitle}>Orta Paket</Text>
                  <Text style={styles.storeCardDescription}>600 coin</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.storeBuyButton}
                onPress={() => {
                  triggerHaptic('medium');
                  handlePurchase(IAP_PRODUCT_IDS.coinPackMedium);
                }}
                disabled={iapLoading}
              >
                {iapLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.storeBuyButtonText}>$4.99</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Text style={styles.storeCardIcon}>💸</Text>
                <View style={styles.storeCardInfo}>
                  <Text style={styles.storeCardTitle}>Büyük Paket</Text>
                  <Text style={styles.storeCardDescription}>1500 coin</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.storeBuyButton}
                onPress={() => {
                  triggerHaptic('medium');
                  handlePurchase(IAP_PRODUCT_IDS.coinPackLarge);
                }}
                disabled={iapLoading}
              >
                {iapLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.storeBuyButtonText}>$9.99</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Satın Almaları Geri Yükle */}
            <TouchableOpacity
              style={styles.restorePurchasesButton}
              onPress={() => {
                triggerHaptic('light');
                handleRestorePurchases();
              }}
              disabled={iapLoading}
            >
              <Text style={styles.restorePurchasesText}>
                🔄 Satın Almaları Geri Yükle
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>

        {/* Mağaza Popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={shopPurchasePopup.visible}
          onRequestClose={() => setShopPurchasePopup({ visible: false, message: '' })}
        >
          <View style={styles.popupOverlay}>
            <View style={[styles.popupContainer, { backgroundColor: currentTheme.accentColor }]}>
              <Text style={styles.popupIcon}>✅</Text>
              <Text style={[styles.popupMessage, { color: currentTheme.scoreColor }]}>
                {shopPurchasePopup.message}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Tutorial ekranı
  if (gameState === 'tutorial') {
    const tutorialSteps = [
      {
        title: '🎨 Hoş Geldin!',
        description: 'ColorDrop\'a hoş geldin! Renkli topları doğru kutuyla eşleştireceğin eğlenceli bir oyun.',
      },
      {
        title: '🎯 Nasıl Oynanır?',
        description: 'Toplar yukarıdan düşer. Bir kutuya dokunarak en alttaki topu o kutuya yönlendir.',
      },
      {
        title: '✅ Doğru Eşleştir',
        description: 'Top ile kutu rengi aynı olmalı! Her doğru eşleşme 1 puan kazandırır ve oyun hızlanır.',
      },
      {
        title: '❌ Dikkat Et!',
        description: 'Yanlış renk seçersen veya bir topu kaçırırsan oyun biter. Yüksek skor için dikkatli ol!',
      },
    ];

    const currentStep = tutorialSteps[tutorialStep];

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.tutorialContainer}>
          <View style={styles.tutorialContent}>
            <Text style={styles.tutorialEmoji}>
              {tutorialStep === 0 && '🎨'}
              {tutorialStep === 1 && '🎯'}
              {tutorialStep === 2 && '✅'}
              {tutorialStep === 3 && '❌'}
            </Text>
            <Text style={styles.tutorialTitle}>{currentStep.title}</Text>
            <Text style={styles.tutorialDescription}>{currentStep.description}</Text>

            <View style={styles.tutorialIndicators}>
              {tutorialSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.tutorialIndicator,
                    index === tutorialStep && styles.tutorialIndicatorActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.tutorialButtons}>
            {tutorialStep < tutorialSteps.length - 1 ? (
              <>
                <TouchableOpacity
                  style={styles.tutorialSkipButton}
                  onPress={completeTutorial}
                >
                  <Text style={styles.tutorialSkipText}>Atla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.tutorialNextButton}
                  onPress={() => {
                    triggerHaptic('light');
                    setTutorialStep(tutorialStep + 1);
                  }}
                >
                  <Text style={styles.tutorialNextText}>İleri</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.tutorialStartButton}
                onPress={completeTutorial}
              >
                <Text style={styles.tutorialStartText}>Başla!</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Menü ekranı
  if (gameState === 'menu') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Coin göstergesi - sol üst köşe */}
        <View style={styles.coinIndicator}>
          <Text style={styles.coinIcon}>💰</Text>
          <Text style={styles.coinText}>{coins}</Text>
        </View>

        {/* Ayarlar butonu - sağ üst köşe */}
        <TouchableOpacity
          style={styles.settingsIconButton}
          onPress={openSettings}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.menuScrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.title}>🎨 ColorDrop</Text>
            <Text style={styles.subtitle}>Topları doğru renge yönlendir!</Text>

            <View style={styles.highScoreContainer}>
              <Text style={styles.highScoreLabel}>En Yüksek Skor</Text>
              <Text style={styles.highScoreValue}>{highScore}</Text>
            </View>

            <TouchableOpacity style={styles.playButton} onPress={startGame}>
              <Text style={styles.playButtonText}>OYNA</Text>
            </TouchableOpacity>

            <View style={styles.menuButtons}>
              <TouchableOpacity
                style={styles.menuSecondaryButton}
                onPress={() => {
                  triggerHaptic('light');
                  playSound(clickSound);
                  setGameState('skins');
                }}
              >
                <Text style={styles.menuSecondaryButtonText}>🎨 Skinler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuSecondaryButton}
                onPress={() => {
                  triggerHaptic('light');
                  playSound(clickSound);
                  setGameState('powerups');
                }}
              >
                <Text style={styles.menuSecondaryButtonText}>⚡ Power-Ups</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuSecondaryButton}
                onPress={() => {
                  triggerHaptic('light');
                  setGameState('achievements');
                }}
              >
                <Text style={styles.menuSecondaryButtonText}>🏆 Başarımlar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuSecondaryButton}
                onPress={() => {
                  triggerHaptic('light');
                  setGameState('dailyTasks');
                }}
              >
                <Text style={styles.menuSecondaryButtonText}>📋 Günlük Görevler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuSecondaryButton}
                onPress={() => {
                  triggerHaptic('light');
                  setGameState('store');
                }}
              >
                <Text style={styles.menuSecondaryButtonText}>🛒 Mağaza</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.instructions}>
              <Text style={styles.instructionText}>📌 Nasıl Oynanır:</Text>
              <Text style={styles.instructionDetail}>• Toplar yukarıdan düşer</Text>
              <Text style={styles.instructionDetail}>• Ekrana dokun ve topu doğru kutuya yönlendir</Text>
              <Text style={styles.instructionDetail}>• Her doğru eşleşme = 1 puan</Text>
              <Text style={styles.instructionDetail}>• Yanlış renk veya kaçırma = oyun biter</Text>
              <Text style={styles.instructionDetail}>• Hız giderek artar!</Text>
            </View>

            <View style={styles.legalLinks}>
              <TouchableOpacity onPress={showPrivacyPolicy}>
                <Text style={styles.legalLinkText}>Gizlilik Politikası</Text>
              </TouchableOpacity>
              <Text style={styles.legalDivider}>•</Text>
              <TouchableOpacity onPress={showTermsOfService}>
                <Text style={styles.legalLinkText}>Kullanım Şartları</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.supportLink}
              onPress={() => openLink('mailto:support@szrgame.com')}
            >
              <Text style={styles.supportLinkText}>📧 Destek: support@szrgame.com</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Ayarlar Modal */}
        {SettingsModal}

        {/* Yasal Belgeler Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {modalContent === 'privacy' ? (
                <View>
                  <Text style={styles.modalText}>
                    {privacyPolicyText}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.modalText}>
                    {termsOfServiceText}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }

  // Oyun bitti ekranı
  if (gameState === 'gameOver') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Ayarlar Modal */}
        {SettingsModal}

        <ScrollView
          style={styles.gameOverScrollView}
          contentContainerStyle={styles.gameOverScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>Oyun Bitti!</Text>

            <View style={styles.scoreCard}>
              <Text style={styles.finalScoreLabel}>Skorun</Text>
              <Text style={styles.finalScoreValue}>{score}</Text>

              {score >= highScore && score > 0 && (
                <Text style={styles.newRecordText}>🎉 YENİ REKOR!</Text>
              )}

              <View style={styles.divider} />

              <Text style={styles.bestScoreLabel}>En İyi Skorun</Text>
              <Text style={styles.bestScoreValue}>{highScore}</Text>
            </View>

            {/* Coin kazanma bilgisi */}
            <View style={styles.coinEarnedInfo}>
              <Text style={styles.coinEarnedText}>💰 +{score} coin kazandınız!</Text>
            </View>

            {/* Kazanılan Başarımlar */}
            {sessionAchievements.length > 0 && (
              <View style={styles.achievementsEarnedContainer}>
                <Text style={styles.achievementsEarnedTitle}>🏆 Kazanılan Başarımlar</Text>
                {sessionAchievements.map((achievement, index) => (
                  <View key={`${achievement.id}-${index}`} style={styles.achievementEarnedItem}>
                    <Text style={styles.achievementEarnedIcon}>{achievement.title.split(' ')[0]}</Text>
                    <View style={styles.achievementEarnedInfo}>
                      <Text style={styles.achievementEarnedTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementEarnedDesc}>{achievement.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Rewarded Video - Devam Et */}
            {continueUsesToday < 3 && isRewardedAdReady() && (
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueWithAd}
              >
                <Text style={styles.continueButtonText}>📺 Reklam İzle ve Devam Et</Text>
                <Text style={styles.continueButtonSubtext}>({3 - continueUsesToday} hak kaldı)</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.restartButton} onPress={startGame}>
              <Text style={styles.restartButtonText}>🔄 Tekrar Oyna</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                triggerHaptic('light');
                setGameState('menu');
              }}
            >
              <Text style={styles.menuButtonText}>Ana Menü</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Oyun ekranı
  const currentTheme = getCurrentSkinTheme();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar style="light" />

      {/* Ayarlar Modal */}
      {SettingsModal}

      {/* Skor göstergesi */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreItemsContainer}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: currentTheme.scoreColor }]}>SKOR</Text>
            <Text style={[styles.scoreValue, { color: currentTheme.accentColor }]}>{score}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: currentTheme.scoreColor }]}>REKOR</Text>
            <Text style={[styles.scoreValue, { color: currentTheme.accentColor }]}>{highScore}</Text>
          </View>
        </View>

        {/* Ayarlar butonu - oyun ekranında */}
        <TouchableOpacity
          style={styles.gameSettingsButton}
          onPress={openSettings}
        >
          <Text style={styles.gameSettingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Power-up butonları */}
      <View style={styles.powerupButtonsContainer}>
        {POWERUPS.map((powerup) => {
          const inventory = powerupInventory[powerup.id] || 0;
          // Shield için activePowerup kontrolü yapma, diğerleri için yap
          const isDisabled = inventory === 0 ||
            (powerup.effect !== 'shield' && activePowerup !== null);

          return (
            <TouchableOpacity
              key={powerup.id}
              style={[
                styles.powerupGameButton,
                { backgroundColor: isDisabled ? currentTheme.boxBackground : currentTheme.accentColor },
                isDisabled && styles.powerupGameButtonDisabled
              ]}
              onPress={() => usePowerup(powerup.id)}
              disabled={isDisabled}
            >
              <Text style={styles.powerupGameEmoji}>{powerup.emoji}</Text>
              <Text style={[styles.powerupGameCount, { color: currentTheme.scoreColor }]}>{inventory}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Oyun alanı */}
      <View style={[styles.gameArea, { backgroundColor: currentTheme.background }]}>
        {balls.map((ball) => (
          <Ball key={ball.id} ball={ball} />
        ))}
        {particles.map((particle) => (
          <Particle key={particle.id} particle={particle} />
        ))}

        {/* Countdown overlay */}
        {countdown > 0 && (
          <View style={styles.countdownOverlay}>
            <Text style={[styles.countdownText, { color: currentTheme.accentColor }]}>{countdown}</Text>
            <Text style={[styles.countdownSubtext, { color: currentTheme.scoreColor }]}>Hazırlan!</Text>
          </View>
        )}
      </View>

      {/* Banner Reklam - En altta, sadece reklamsız değilse göster */}
      {!adsRemoved && (
        <View style={styles.bannerAdContainer}>
          <AdMobBanner
            unitId={AD_UNIT_IDS.banner}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}

      {/* Renkli kutular - Banner varsa onun üzerinde, yoksa en altta */}
      <View
        style={[
          styles.boxContainer,
          !adsRemoved && styles.boxContainerAboveBanner,
          { backgroundColor: currentTheme.boxBackground }
        ]}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          // scoreBar absolute (95px) olduğu için gameArea koordinatlarına çevir
          // 50px daha yukarıda çarpışma için
          const adjustedY = y - 95 - 50;
          setBoxContainerY(adjustedY);
        }}
      >
        {COLORS.map((color, index) => {
          // Seçili skin'in renklerini al
          const skinColors = getCurrentSkinColors();
          const boxColor = skinColors[index % skinColors.length];

          return (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorBox,
                {
                  backgroundColor: boxColor,
                  borderWidth: 2,
                  borderColor: currentTheme.boxBorder
                }
              ]}
              activeOpacity={0.7}
              onPress={() => {
                const closestBall = balls
                  .filter((b) => !b.isDirected && b.y > 0 && b.y < height - 150)
                  .sort((a, b) => b.y - a.y)[0];

                if (closestBall) {
                  directBall(closestBall.id, color.id, index);
                }
              }}
            >
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Power-up Satın Alma Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={powerupPurchasePopup.visible}
        onRequestClose={() => setPowerupPurchasePopup({ visible: false, message: '' })}
      >
        <View style={styles.popupOverlay}>
          <View style={[styles.popupContainer, { backgroundColor: currentTheme.accentColor }]}>
            <Text style={styles.popupIcon}>✅</Text>
            <Text style={[styles.popupMessage, { color: currentTheme.scoreColor }]}>
              {powerupPurchasePopup.message}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Şeffaf Overlay - Power-up Göstergeleri için */}
      {(activePowerup || shieldActive) && (
        <View style={styles.powerupIndicatorOverlay} pointerEvents="none">
          <View style={styles.powerupIndicatorContainer}>
            {activePowerup && (
              <View style={[styles.powerupIndicator, { backgroundColor: currentTheme.accentColor }]}>
                <Text style={[styles.powerupIndicatorText, { color: currentTheme.scoreColor }]}>
                  {POWERUPS.find(p => p.effect === activePowerup)?.emoji} AKTİF
                </Text>
              </View>
            )}
            {shieldActive && (
              <View style={[styles.powerupIndicator, { backgroundColor: currentTheme.accentColor }]}>
                <Text style={[styles.powerupIndicatorText, { color: currentTheme.scoreColor }]}>🛡️ Kalkan Aktif</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  menuScrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: height - 40,
  },
  settingsIconButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  settingsIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: Math.min(56, width * 0.14),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(18, width * 0.045),
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  highScoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    minWidth: Math.min(200, width * 0.5),
  },
  highScoreLabel: {
    fontSize: Math.min(14, width * 0.035),
    color: '#aaa',
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: Math.min(48, width * 0.12),
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  playButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: Math.min(60, width * 0.15),
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    maxWidth: Math.min(350, width * 0.9),
    width: '100%',
  },
  instructionText: {
    fontSize: Math.min(16, width * 0.04),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionDetail: {
    fontSize: Math.min(14, width * 0.035),
    color: '#aaa',
    marginBottom: 4,
    paddingLeft: 10,
  },
  tutorialContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
    paddingTop: 80,
    paddingBottom: 50,
  },
  tutorialContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  tutorialTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  tutorialDescription: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  tutorialIndicators: {
    flexDirection: 'row',
    marginTop: 40,
  },
  tutorialIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  tutorialIndicatorActive: {
    backgroundColor: '#FF3B30',
    width: 30,
  },
  tutorialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tutorialSkipButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    alignItems: 'center',
  },
  tutorialSkipText: {
    color: '#aaa',
    fontSize: 16,
  },
  tutorialNextButton: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    alignItems: 'center',
  },
  tutorialNextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tutorialStartButton: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: '#34C759',
    borderRadius: 25,
    alignItems: 'center',
  },
  tutorialStartText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  settingsCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCloseText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsContent: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  settingButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  gameOverScrollView: {
    flex: 1,
  },
  gameOverScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  gameOverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    minWidth: 280,
  },
  finalScoreLabel: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  finalScoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  newRecordText: {
    fontSize: 18,
    color: '#FFCC00',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 20,
  },
  bestScoreLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  bestScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  restartButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scoreBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    minHeight: 95, // Sabit yükseklik
    zIndex: 1100,
    elevation: 1100,
  },
  scoreItemsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scoreItem: {
    alignItems: 'center',
    minWidth: 80, // Minimum genişlik
  },
  gameSettingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  gameSettingsIcon: {
    fontSize: 20,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 5,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 40, // Minimum genişlik sayı için
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  countdownSubtext: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    zIndex: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  particle: {
    position: 'absolute',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 600,
    elevation: 600,
  },
  boxContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 500,
    elevation: 500,
  },
  boxContainerAboveBanner: {
    bottom: 50, // Banner yüksekliği kadar (yaklaşık 50px)
  },
  colorBox: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  boxLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  legalLinkText: {
    color: '#888',
    fontSize: Math.min(12, width * 0.03),
    textDecorationLine: 'underline',
  },
  legalDivider: {
    color: '#666',
    fontSize: Math.min(12, width * 0.03),
    marginHorizontal: 8,
  },
  supportLink: {
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  supportLinkText: {
    color: '#888',
    fontSize: Math.min(12, width * 0.03),
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 22,
    marginBottom: 20,
  },
  // Yeni menü butonları
  menuButtons: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
    width: '90%',
  },
  menuSecondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  menuSecondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Başarımlar ekranı
  achievementsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    minWidth: 60,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  achievementsList: {
    flex: 1,
    padding: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementCardUnlocked: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderColor: '#34C759',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  achievementTitleLocked: {
    color: '#888',
  },
  achievementDescription: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 8,
  },
  achievementProgress: {
    marginTop: 5,
  },
  achievementProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 11,
    color: '#888',
  },
  achievementUnlockedText: {
    fontSize: 13,
    color: '#34C759',
    fontWeight: 'bold',
    marginTop: 5,
  },
  achievementToast: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(52, 199, 89, 0.92)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  achievementToastTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  achievementToastText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  achievementToastDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  // Günlük görevler ekranı
  dailyTasksContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  dailyTasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dailyTasksTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dailyStreakCard: {
    margin: 15,
    padding: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FF9800',
    alignItems: 'center',
  },
  dailyStreakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  dailyStreakValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 5,
  },
  dailyStreakDescription: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
  },
  dailyTasksList: {
    flex: 1,
    padding: 15,
  },
  tasksHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  taskCardCompleted: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderColor: '#34C759',
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskIconText: {
    fontSize: 20,
    color: '#fff',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  taskTitleCompleted: {
    color: '#34C759',
  },
  taskProgress: {
    marginTop: 5,
  },
  taskProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  taskProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  taskProgressText: {
    fontSize: 11,
    color: '#888',
  },
  noTasksCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 5,
  },
  noTasksDescription: {
    fontSize: 14,
    color: '#666',
  },
  // Ayarlar yeni stiller
  settingsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginLeft: 5,
  },
  aboutSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  aboutTextSmall: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 5,
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  dangerButtonText: {
    color: '#FF3B30',
  },
  // Monetizasyon stilleri
  coinIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    zIndex: 1000,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  coinText: {
    color: '#FFCC00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinIndicatorSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  coinIconSmall: {
    fontSize: 16,
    marginRight: 4,
  },
  coinTextSmall: {
    color: '#FFCC00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerAdContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1000,
    elevation: 1000, // Android için
  },
  coinEarnedInfo: {
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  coinEarnedText: {
    color: '#FFCC00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementsEarnedContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    maxHeight: 250,
  },
  achievementsEarnedTitle: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  achievementEarnedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  achievementEarnedIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  achievementEarnedInfo: {
    flex: 1,
  },
  achievementEarnedTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievementEarnedDesc: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButtonSubtext: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
  // Mağaza stilleri
  storeContainer: {
    flex: 1,
    paddingTop: 50,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  storeList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  storeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeCardIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  storeCardInfo: {
    flex: 1,
  },
  storeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  storeCardDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  storeBuyButton: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  storeBuyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeWatchAdButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  storeWatchAdButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storePurchasedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  storePurchasedText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: 'bold',
  },
  storeSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 15,
  },
  restorePurchasesButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  restorePurchasesText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Skin ekranı stilleri
  skinContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  skinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#16213E',
  },
  skinTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  coinIndicatorSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  coinTextSmall: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  skinScrollView: {
    flex: 1,
  },
  skinScrollContent: {
    padding: 20,
  },
  skinCard: {
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skinCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skinEmoji: {
    fontSize: 36,
    marginRight: 15,
  },
  skinInfo: {
    flex: 1,
  },
  skinName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  skinPreview: {
    flexDirection: 'row',
    gap: 5,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  skinCardRight: {
    marginLeft: 10,
  },
  skinSelectedBadge: {
    backgroundColor: '#2ECC71',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  skinSelectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skinSelectButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  skinSelectText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skinBuyButton: {
    backgroundColor: '#F39C12',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  skinBuyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skinBuyLabel: {
    color: '#fff',
    fontSize: 10,
  },
  skinLockedBadge: {
    backgroundColor: '#95A5A6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  skinLockedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  premiumPromoBanner: {
    backgroundColor: '#8E44AD',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  premiumPromoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  premiumPromoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  premiumPromoButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  premiumPromoButtonText: {
    color: '#8E44AD',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Power-up ekranı stilleri
  powerupContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  powerupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#16213E',
  },
  powerupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  powerupScrollView: {
    flex: 1,
  },
  powerupScrollContent: {
    padding: 20,
  },
  powerupCard: {
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  powerupCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  powerupInfo: {
    flex: 1,
  },
  powerupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  powerupDescription: {
    fontSize: 13,
    color: '#BDC3C7',
    marginBottom: 5,
  },
  powerupInventory: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  powerupCardRight: {
    marginLeft: 10,
  },
  powerupBuyButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  powerupBuyPrice: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  powerupBuyLabel: {
    color: '#fff',
    fontSize: 10,
  },
  powerupPromoBanner: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  powerupPromoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  powerupPromoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  powerupPromoButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  powerupPromoButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  powerupGuideContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  powerupGuideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  powerupGuideText: {
    fontSize: 13,
    color: '#BDC3C7',
    marginBottom: 5,
  },
  // Oyun içi power-up butonları
  powerupButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 125, // scoreBar yüksekliği kadar boşluk + biraz daha
    backgroundColor: 'transparent', // Şeffaf yaptık ki hem butonlar hem aktif göstergeler görünsün
    zIndex: 1050, // scoreBar'ın altında ama topların üstünde
    elevation: 1050,
    overflow: 'visible', // Göstergelerin container dışında da görünmesine izin ver
  },
  powerupGameButton: {
    backgroundColor: '#3498DB',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  powerupGameButtonDisabled: {
    backgroundColor: '#95A5A6',
    opacity: 0.5,
    borderColor: '#7F8C8D',
  },
  powerupGameEmoji: {
    fontSize: 24,
  },
  powerupGameCount: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#E74C3C',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  powerupIndicatorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1100, // powerupButtonsContainer'dan (1050) daha yüksek olmalı
    elevation: 1100,
    backgroundColor: 'transparent',
  },
  powerupIndicatorContainer: {
    marginTop: 230,
    alignItems: 'center',
    gap: 10, // Birden fazla power-up aktif olduğunda aralarında boşluk olsun
  },
  powerupIndicator: {
    backgroundColor: 'rgba(243, 156, 18, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  powerupIndicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: 'rgba(243, 156, 18, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  popupIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  popupMessage: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
