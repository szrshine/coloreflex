import { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Gizlilik Politikası Metni
const privacyPolicyText = `GİZLİLİK POLİTİKASI

Son Güncelleme: 11 Kasım 2025

ColorDrop'a hoş geldiniz. Bu Gizlilik Politikası, mobil oyun uygulamamızı kullandığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı, ifşa ettiğimızı ve koruduğumuzu açıklar.

TOPLANAN BİLGİLER

Otomatik Olarak Toplanan Bilgiler:
• Cihaz bilgileri (model, işletim sistemi sürümü)
• Benzersiz cihaz tanımlayıcıları
• Oyun verileri (skorlar, başarımlar, istatistikler)
• Kullanım verileri (oturum süreleri)
• Hata raporları ve çökme günlükleri

Sağladığınız Bilgiler:
• Kullanıcı profili veya takma ad
• Liderlik tablosu katılımı
• Geri bildirimler

BİLGİLERİN KULLANIMI

Topladığımız bilgileri şu amaçlarla kullanırız:
• Oyunu sağlamak, işletmek ve sürdürmek
• Oyun deneyiminizi iyileştirmek ve kişiselleştirmek
• Oyun istatistiklerini ve başarımları izlemek
• Liderlik tablolarını görüntülemek ve yönetmek
• Kullanım kalıplarını analiz etmek
• Teknik sorunları gidermek ve düzeltmek

VERİ DEPOLAMA

Oyun verileriniz cihazınızda yerel olarak AsyncStorage kullanılarak saklanır. Bazı veriler bulut hizmetlerine senkronize edilebilir.

ÜÇÜNCÜ TARAF HİZMETLER

ColorDrop aşağıdaki üçüncü taraf hizmetlerini kullanabilir:
• Google AdMob - Reklamlar
• Firebase Analytics - Uygulama kullanımı analizi
• Sentry - Hata takibi
• Google Play Games / Apple Game Center - Liderlik tabloları

ÇOCUKLARIN GİZLİLİĞİ

ColorDrop tüm yaşlar için uygundur (3+). 13 yaşın altındaki çocuklardan ebeveyn izni olmadan bilerek kişisel bilgi toplamıyoruz.

HAKLARINIZ

Şunları yapma hakkınız vardır:
• Hakkınızda tuttuğumuz kişisel bilgilere erişim
• Yanlış bilgilerin düzeltilmesini talep
• Bilgilerinizin silinmesini talep
• Veri toplamayı reddetme
• İzninizi geri çekme

VERİ GÜVENLİĞİ

Bilgilerinizi yetkisiz erişim, değiştirme, ifşa veya imhadan korumak için makul güvenlik önlemleri uyguluyoruz.

İLETİŞİM

Bu Gizlilik Politikası hakkında sorularınız varsa lütfen bizimle iletişime geçin:

E-posta: support@szrgame.com
Geliştirici: SZR Game Studios
Adres: Istanbul, Turkey

UYUMLULUK

Bu Gizlilik Politikası şunlara uygundur:
• Genel Veri Koruma Yönetmeliği (GDPR)
• California Tüketici Gizlilik Yasası (CCPA)
• Çocukların Çevrimiçi Gizlilik Koruma Yasası (COPPA)
• Apple App Store Yönergeleri
• Google Play Store Politikaları`;

// Kullanım Şartları Metni
const termsOfServiceText = `KULLANIM ŞARTLARI

Son Güncelleme: 11 Kasım 2025

HİZMET AÇIKLAMASI

ColorDrop, düşen renkli damlaları doğru renk platformlarıyla eşleştirdiğiniz hızlı tempolu bir renk eşleştirme bulmaca oyunudur.

UYGUNLUK

ColorDrop'u kullanarak şunları beyan edersiniz:
• En az 13 yaşındasınız veya 13 yaşın altındaysanız ebeveyn/vasi izniniz var
• Bu Şartları kabul etme yasal kapasitesine sahipsiniz
• Oyunu yürürlükteki yasalar kapsamında kullanmanız yasak değildir

KULLANICI HESABI VE VERİLERİ

Oyun ilerlemeniz, skorlarınız ve istatistikleriniz cihazınızda yerel olarak saklanır. Cihazınızın güvenliğini sağlamak sizin sorumluluğunuzdur.

KABULEDİLEBİLİR KULLANIM

ŞU DAVRANIŞLARDA BULUNMAMAYI kabul edersiniz:
• Oyunu değiştirmek, tersine mühendislik yapmak veya kaynak kodunu çıkarmak
• Hile, istismar, otomasyon yazılımı, botlar veya hack kullanmak
• Liderlik tablolarını veya başarımları haksız yere manipüle etmek
• Sahte hesaplar oluşturmak veya başkasının kimliğine bürünmek
• Oyunu yasadışı amaçlarla kullanmak
• Oyunun sunucularına veya ağlarına müdahale etmek

FİKRİ MÜLKİYET HAKLARI

ColorDrop ve tüm içeriği, özellikleri ve işlevselliği SZR Game Studios'a aittir ve uluslararası telif hakkı, ticari marka ve diğer fikri mülkiyet yasalarıyla korunmaktadır.

UYGULAMA İÇİ SATIN ALMALAR

Mevcut olduğunda, ColorDrop şunları sunabilir:
• Premium özellikler
• Kozmetik öğeler (görünümler, temalar)
• Güçlendirmeler
• Sanal para (coinler)
• Reklam kaldırma

Önemli: Tüm satın almalar kesindir ve iade edilemez (yasa gereği haller hariç).

GARANTİ REDDİ

OYUN "OLDUĞU GİBİ" VE "MEVCUT OLDUĞU ŞEKLİYLE" sağlanır. Şunları garanti etmiyoruz:
• Oyunun gereksinimlerinizi karşılayacağı
• Oyunun her zaman kullanılabilir olacağı
• Hataların veya bugların düzeltileceği
• Oyunun virüslerden arınmış olduğu

SORUMLULUK SINIRLAMASI

Yasaların izin verdiği azami ölçüde:
• Dolaylı, arızi, özel veya cezai zararlardan sorumlu değiliz
• Toplam sorumluluğumuz son 12 ayda bize ödediğiniz tutarı aşmayacaktır
• Veri, kâr veya iyi niyet kaybından sorumlu değiliz

HİZMET DEĞİŞİKLİKLERİ

Şunları yapma hakkını saklı tutarız:
• Oyunu istediğimiz zaman değiştirmek veya durdurmak
• Özellikleri, içeriği veya mekaniği güncellemek
• Uygulama içi satın almaları değiştirmek veya kaldırmak
• Fiyatlandırmayı ayarlamak

SONLANDIRMA

Erişiminizi şu durumlarda sonlandırabiliriz:
• Bu Şartların ihlali
• Hileli, kötüye kullanılan veya yasadışı faaliyetler
• Herhangi bir nedenle, kendi takdirimize bağlı olarak

YÖNETİM HUKUKU

Bu Şartlar Türkiye yasalarına tabidir. Anlaşmazlıklar İstanbul mahkemelerinde çözülecektir.

İLETİŞİM

Bu Şartlar hakkında sorular için lütfen bizimle iletişime geçin:

E-posta: support@szrgame.com
Geliştirici: SZR Game Studios
Konum: Istanbul, Turkey

ONAY

COLORDROP'U İNDİREREK, YÜKLEYEREK VEYA KULLANARAK, BU KULLANIM ŞARTLARINI OKUDUĞUNUZU, ANLADIĞINIZI VE BUNLARA BAĞLI OLMAYI KABUL ETTİĞİNİZİ BEYAN EDERSİNİZ.`;

const COLORS = [
  { id: 'red', color: '#FF3B30', name: 'Kırmızı' },
  { id: 'blue', color: '#007AFF', name: 'Mavi' },
  { id: 'green', color: '#34C759', name: 'Yeşil' },
  { id: 'yellow', color: '#FFCC00', name: 'Sarı' },
];

const BALL_SIZE = 40;
const INITIAL_SPEED = 2;
const SPEED_INCREMENT = 0.5;

// Başarımlar (Achievements) tanımları
const ACHIEVEMENTS_LIST = [
  { id: 'first_game', title: '🎮 İlk Adım', description: 'İlk oyununu tamamla', requirement: 1, type: 'games' },
  { id: 'beginner', title: '⭐ Başlangıç Seviyesi', description: '10 puan kazan', requirement: 10, type: 'score' },
  { id: 'expert', title: '🏆 Uzman', description: '25 puan kazan', requirement: 25, type: 'score' },
  { id: 'master', title: '👑 Usta', description: '50 puan kazan', requirement: 50, type: 'score' },
  { id: 'legend', title: '💎 Efsane', description: '100 puan kazan', requirement: 100, type: 'score' },
  { id: 'perfect_10', title: '✨ Mükemmel 10', description: '10 ardışık doğru eşleşme', requirement: 10, type: 'streak' },
  { id: 'perfect_20', title: '🔥 Mükemmel 20', description: '20 ardışık doğru eşleşme', requirement: 20, type: 'streak' },
  { id: 'century', title: '💯 Yüzlük', description: '100 oyun oyna', requirement: 100, type: 'games' },
  { id: 'dedicated', title: '📅 Bağımlısı', description: 'Üst üste 7 gün giriş yap', requirement: 7, type: 'daily_streak' },
  { id: 'speed_demon', title: '⚡ Hız Canavarı', description: 'En yüksek hızda 5 doğru eşleşme', requirement: 5, type: 'speed' },
];

export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver, tutorial, achievements, stats
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [balls, setBalls] = useState([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [particles, setParticles] = useState([]); // Parçacık efektleri için
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

  // Günlük görevler ve ödüller
  const [dailyLoginStreak, setDailyLoginStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState('');
  const [dailyTasks, setDailyTasks] = useState([]);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

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
  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.log('Ayar kaydedilirken hata:', error);
    }
  };

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

  // Başarım bildirimi göster
  const showAchievementToast = (achievement) => {
    // Eğer aynı başarım zaten gösteriliyorsa, tekrar ekleme
    setUnlockedAchievements(prev => {
      const alreadyShowing = prev.find(a => a.id === achievement.id);
      if (alreadyShowing) return prev;

      // Maksimum 2 bildirim göster (ekranı çok kaplamayalım)
      const newList = prev.length >= 2 ? [prev[1], achievement] : [...prev, achievement];
      return newList;
    });

    setTimeout(() => {
      setUnlockedAchievements(prev => prev.filter(a => a.id !== achievement.id));
    }, 2500); // 3 saniye yerine 2.5 saniye
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
  const restartTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
    setSettingsVisible(false); // Ayarları kapat
    setGameState('tutorial');
  };

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
  const closeSettings = () => {
    setSettingsVisible(false);
    triggerHaptic('light');

    // Eğer önceki state playing ise, oyunu devam ettir (resume)
    if (previousGameState === 'playing') {
      // Game loop'u yeniden başlatmak için gameState'i tetikle
      setGameState('playing');
    }
  };

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

      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const newBall = {
        id: ballIdCounter.current++,
        colorId: randomColor.id,
        color: randomColor.color,
        x: Math.random() * (width - BALL_SIZE),
        y: -BALL_SIZE,
        fadeAnim: new Animated.Value(1),
        scaleAnim: new Animated.Value(1),
        targetX: null,
        isDirected: false,
      };

      return [...prevBalls, newBall];
    });
  };

  // Ana oyun döngüsü
  useEffect(() => {
    if (gameState === 'playing' && !settingsVisible) {
      gameLoop.current = setInterval(() => {
        setBalls((prevBalls) => {
          const updatedBalls = prevBalls.map((ball) => {
            let newX = ball.x;
            let newY = ball.y + speed;

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
            if (ball.y > height - 120 && ball.isDirected) {
              return !checkBallReached(ball);
            }

            if (ball.y > height - 100 && !ball.isDirected) {
              endGame();
              return false;
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
  }, [gameState, speed, settingsVisible]);

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
          };
        }
        return ball;
      });
    });
  };

  // Topu kutuya ulaştığında kontrol et
  const checkBallReached = (ball) => {
    if (ball.y > height - 120 && ball.isDirected) {
      if (ball.colorId === ball.targetColorId) {
        // Doğru eşleşme!
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
        // Yanlış renk
        triggerHaptic('error');
        playSound(wrongSound);
        createParticles(ball.x, ball.y, ball.color, false);
        endGame();
        return true;
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
  };

  // Yasal belgeleri göster
  const showPrivacyPolicy = () => {
    setModalTitle('Gizlilik Politikası');
    setModalContent('privacy');
    setModalVisible(true);
  };

  const showTermsOfService = () => {
    setModalTitle('Kullanım Şartları');
    setModalContent('terms');
    setModalVisible(true);
  };

  // Link açma fonksiyonu
  const openLink = async (url) => {
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
  };

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

  // Ayarlar Modal
  const SettingsModal = () => (
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
                onValueChange={(value) => {
                  setSoundEnabled(value);
                  saveSetting('soundEnabled', value);
                  if (hapticEnabled) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
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
                onValueChange={(value) => {
                  setMusicEnabled(value);
                  saveSetting('musicEnabled', value);
                  if (hapticEnabled) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
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
                onValueChange={(value) => {
                  setHapticEnabled(value);
                  saveSetting('hapticEnabled', value);
                  if (value) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                }}
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
  );

  // Menü ekranı
  if (gameState === 'menu') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />

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
        <SettingsModal />

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
        <SettingsModal />

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
      </View>
    );
  }

  // Oyun ekranı
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Ayarlar Modal */}
      <SettingsModal />

      {/* Skor göstergesi */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreItemsContainer}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>SKOR</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>REKOR</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
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

      {/* Oyun alanı */}
      <View style={styles.gameArea}>
        {balls.map((ball) => (
          <Ball key={ball.id} ball={ball} />
        ))}
        {particles.map((particle) => (
          <Particle key={particle.id} particle={particle} />
        ))}
      </View>

      {/* Renkli kutular */}
      <View style={styles.boxContainer}>
        {COLORS.map((color, index) => (
          <TouchableOpacity
            key={color.id}
            style={[styles.colorBox, { backgroundColor: color.color }]}
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
            <Text style={styles.boxLabel}>{color.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Başarım bildirimleri */}
      {unlockedAchievements.map((achievement, index) => (
        <View
          key={`${achievement.id}-${Date.now()}-${index}`}
          style={[styles.achievementToast, { top: 80 + index * 70 }]}
        >
          <Text style={styles.achievementToastTitle}>🎉 {achievement.title}</Text>
          <Text style={styles.achievementToastDescription}>{achievement.description}</Text>
        </View>
      ))}
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
  gameOverContainer: {
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    minHeight: 95, // Sabit yükseklik
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
    backgroundColor: '#16213e',
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    elevation: 5,
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
    elevation: 3,
  },
  boxContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    elevation: 10,
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
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  menuSecondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 5,
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
});
