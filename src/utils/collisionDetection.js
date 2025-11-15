import { BALL_SIZE } from '../constants/gameConfig';

/**
 * Çarpışma algılama ve eşleşme kontrolü
 */

/**
 * Top kutu container'ına ulaştı mı kontrol et
 * @param {Object} ball - Top objesi
 * @param {number} boxContainerY - Kutu container'ının Y pozisyonu
 * @returns {boolean} Container'a ulaştı mı?
 */
export const hasBallReachedContainer = (ball, boxContainerY) => {
  if (boxContainerY === null) return false;

  const ballBottom = ball.y + BALL_SIZE;
  return ballBottom >= boxContainerY;
};

/**
 * Top renk eşleşmesi doğru mu kontrol et
 * @param {Object} ball - Top objesi
 * @returns {boolean} Eşleşme doğru mu?
 */
export const isBallMatchCorrect = (ball) => {
  if (!ball.isDirected) return false;

  // Index bazlı eşleştirme (skinler için)
  return ball.colorIndex === ball.targetColorIndex;
};

/**
 * Çarpışma sonucu hesapla
 * @param {Object} ball - Top objesi
 * @param {boolean} isShieldActive - Shield aktif mi?
 * @returns {Object} Çarpışma sonucu
 * {
 *   type: 'match' | 'mismatch' | 'undirected' | 'shield_used',
 *   shouldRemoveBall: boolean,
 *   shouldEndGame: boolean,
 *   shouldUseShield: boolean
 * }
 */
export const calculateCollisionResult = (ball, isShieldActive) => {
  // Yönlendirilmiş top
  if (ball.isDirected) {
    const isMatch = isBallMatchCorrect(ball);

    if (isMatch) {
      // Doğru eşleşme
      return {
        type: 'match',
        shouldRemoveBall: true,
        shouldEndGame: false,
        shouldUseShield: false,
      };
    } else {
      // Yanlış eşleşme
      if (isShieldActive) {
        return {
          type: 'shield_used',
          shouldRemoveBall: true,
          shouldEndGame: false,
          shouldUseShield: true,
        };
      } else {
        return {
          type: 'mismatch',
          shouldRemoveBall: false,
          shouldEndGame: true,
          shouldUseShield: false,
        };
      }
    }
  } else {
    // Yönlendirilmemiş top kutuya ulaştı
    if (isShieldActive) {
      return {
        type: 'shield_used',
        shouldRemoveBall: true,
        shouldEndGame: false,
        shouldUseShield: true,
      };
    } else {
      return {
        type: 'undirected',
        shouldRemoveBall: false,
        shouldEndGame: true,
        shouldUseShield: false,
      };
    }
  }
};

/**
 * İki top arasındaki mesafe
 * @param {Object} ball1 - İlk top
 * @param {Object} ball2 - İkinci top
 * @returns {number} Mesafe
 */
export const getDistanceBetweenBalls = (ball1, ball2) => {
  const dx = ball1.x - ball2.x;
  const dy = ball1.y - ball2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * İki top çarpışıyor mu?
 * @param {Object} ball1 - İlk top
 * @param {Object} ball2 - İkinci top
 * @returns {boolean} Çarpışma var mı?
 */
export const areBallsColliding = (ball1, ball2) => {
  const distance = getDistanceBetweenBalls(ball1, ball2);
  return distance < BALL_SIZE * 2;
};
