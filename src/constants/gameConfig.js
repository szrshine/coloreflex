// Oyun konfigürasyonu sabitleri
export const BALL_SIZE = 40;
export const INITIAL_SPEED = 2;
export const SPEED_INCREMENT = 0.5;

// Diğer oyun sabitleri
export const GAME_CONFIG = {
  ballSize: BALL_SIZE,
  initialSpeed: INITIAL_SPEED,
  speedIncrement: SPEED_INCREMENT,

  // Oyun deneyimi için ayarlanabilir değerler
  maxSpeed: 15, // Maksimum top hızı
  scorePerBall: 1, // Her doğru eşleşmede kazanılan puan
  speedIncreaseInterval: 5, // Kaç toptan sonra hız artacak
};
