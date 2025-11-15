// Başarımlar (Achievements) tanımları
export const ACHIEVEMENTS_LIST = [
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
