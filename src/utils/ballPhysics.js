import { BALL_SIZE } from '../constants/gameConfig';

/**
 * Top fizik ve hareket hesaplamaları
 */

/**
 * Yeni top oluştur
 * @param {number} ballId - Top ID'si
 * @param {Array} skinColors - Seçili skin'in renkleri
 * @param {Array} gameColors - Oyun renk tanımları (COLORS)
 * @param {number} screenWidth - Ekran genişliği
 * @param {Animated} Animated - React Native Animated API
 * @returns {Object} Yeni top objesi
 */
export const createBall = (ballId, skinColors, gameColors, screenWidth, Animated) => {
  const randomColorIndex = Math.floor(Math.random() * gameColors.length);
  const skinColorIndex = randomColorIndex % skinColors.length;
  const randomColorHex = skinColors[skinColorIndex];
  const gameColor = gameColors[randomColorIndex];

  return {
    id: ballId,
    colorId: gameColor.id,
    colorIndex: randomColorIndex,
    color: randomColorHex,
    x: Math.random() * (screenWidth - BALL_SIZE),
    y: -BALL_SIZE,
    fadeAnim: new Animated.Value(1),
    scaleAnim: new Animated.Value(1),
    targetX: null,
    targetColorIndex: null,
    isDirected: false,
  };
};

/**
 * Top pozisyonunu güncelle
 * @param {Object} ball - Top objesi
 * @param {number} speed - Oyun hızı
 * @param {string} activePowerup - Aktif power-up (slowmotion, freeze, vb.)
 * @param {Array} allBalls - Tüm toplar
 * @returns {Object} Güncellenmiş top objesi
 */
export const updateBallPosition = (ball, speed, activePowerup, allBalls) => {
  let newX = ball.x;

  // Slow motion efekti - hızı yarıya düşür
  const currentSpeed = activePowerup === 'slowmotion' ? speed / 2 : speed;
  let newY = ball.y + currentSpeed;

  // Hedef X pozisyonuna doğru hareket et
  if (ball.isDirected && ball.targetX !== null) {
    const diff = ball.targetX - ball.x;
    const moveSpeed = 80;

    if (Math.abs(diff) > 1) {
      newX = ball.x + Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed);
    } else {
      newX = ball.targetX;
    }
  }

  // Diğer toplarla çarpışma önleme (minimum mesafe koru)
  const sortedBallsBelow = allBalls
    .filter((b) => b.id !== ball.id && b.y > ball.y)
    .sort((a, b) => a.y - b.y);

  if (sortedBallsBelow.length > 0) {
    const closestBallBelow = sortedBallsBelow[0];
    const minDistance = BALL_SIZE * 2;

    if (closestBallBelow.y - newY < minDistance) {
      newY = ball.y; // Hareket etme, mevcut pozisyonda kal
    }
  }

  return {
    ...ball,
    x: newX,
    y: newY,
  };
};

/**
 * Yeni top spawn edilebilir mi kontrol et
 * @param {Array} balls - Mevcut toplar
 * @returns {boolean} Spawn edilebilir mi?
 */
export const canSpawnBall = (balls) => {
  if (balls.length === 0) return true;

  const topMostBall = balls.reduce((highest, ball) =>
    ball.y < highest.y ? ball : highest
  , balls[0]);

  const minSpawnDistance = BALL_SIZE * 1.5;
  return topMostBall.y >= minSpawnDistance;
};

/**
 * Topu hedef pozisyona yönlendir
 * @param {Object} ball - Top objesi
 * @param {number} targetX - Hedef X pozisyonu
 * @param {number} targetColorIndex - Hedef renk index'i
 * @returns {Object} Güncellenmiş top objesi
 */
export const directBall = (ball, targetX, targetColorIndex) => {
  if (ball.isDirected) return ball; // Zaten yönlendirilmiş

  return {
    ...ball,
    targetX,
    targetColorIndex,
    isDirected: true,
  };
};

/**
 * Top ekrandan çıktı mı kontrol et
 * @param {Object} ball - Top objesi
 * @param {number} screenHeight - Ekran yüksekliği
 * @returns {boolean} Ekrandan çıktı mı?
 */
export const isBallOutOfBounds = (ball, screenHeight) => {
  return ball.y > screenHeight + BALL_SIZE;
};
