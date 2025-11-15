// Power-up tanımları
export const POWERUPS = [
  {
    id: 'slowmotion',
    name: 'Yavaş Çekim',
    description: 'Topları 10 saniye yavaşlatır',
    emoji: '⏱️',
    coinPrice: 50,
    duration: 10000,
    effect: 'slowmotion'
  },
  {
    id: 'shield',
    name: 'Kalkan',
    description: 'Bir yanlış eşleşmeyi affeder',
    emoji: '🛡️',
    coinPrice: 75,
    duration: null,
    effect: 'shield'
  },
  {
    id: 'freeze',
    name: 'Dondur',
    description: 'Topları 5 saniye dondurur',
    emoji: '❄️',
    coinPrice: 60,
    duration: 5000,
    effect: 'freeze'
  },
];
