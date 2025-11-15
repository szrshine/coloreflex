import { BALL_SIZE } from '../constants/gameConfig';

/**
 * Particle sistem yönetimi
 */

/**
 * Particle'lar oluştur
 * @param {number} x - Başlangıç X pozisyonu
 * @param {number} y - Başlangıç Y pozisyonu
 * @param {string} color - Particle rengi
 * @param {boolean} isSuccess - Başarı particle'ı mı?
 * @param {number} particleIdCounter - Particle ID sayacı
 * @param {Animated} Animated - React Native Animated API
 * @returns {Array} Particle dizisi
 */
export const createParticles = (x, y, color, isSuccess, particleIdCounter, Animated) => {
  const particleCount = isSuccess ? 16 : 12;
  const newParticles = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = isSuccess ? 8 : 5;

    const particle = {
      id: particleIdCounter,
      x: x + BALL_SIZE / 2,
      y: y + BALL_SIZE / 2,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      color: isSuccess ? color : '#FF3B30',
      opacity: new Animated.Value(1),
      size: isSuccess ? 12 : 10,
    };

    newParticles.push(particle);

    // Parçacığı kaybet
    Animated.timing(particle.opacity, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }

  return newParticles;
};

/**
 * Particle pozisyonunu güncelle (yerçekimi ile)
 * @param {Object} particle - Particle objesi
 * @returns {Object} Güncellenmiş particle objesi
 */
export const updateParticlePosition = (particle) => {
  return {
    ...particle,
    x: particle.x + particle.vx,
    y: particle.y + particle.vy,
    vy: particle.vy + 0.3, // Yerçekimi
  };
};

/**
 * Particle'ların pozisyonlarını toplu güncelle
 * @param {Array} particles - Particle dizisi
 * @returns {Array} Güncellenmiş particle dizisi
 */
export const updateAllParticles = (particles) => {
  return particles.map(updateParticlePosition);
};

/**
 * Belirli ID'li particle'ları temizle
 * @param {Array} allParticles - Tüm particle'lar
 * @param {Array} particlesToRemove - Temizlenecek particle'lar
 * @returns {Array} Filtrelenmiş particle dizisi
 */
export const removeParticles = (allParticles, particlesToRemove) => {
  return allParticles.filter(p => !particlesToRemove.find(np => np.id === p.id));
};

/**
 * Particle ekrandan çıktı mı?
 * @param {Object} particle - Particle objesi
 * @param {number} screenWidth - Ekran genişliği
 * @param {number} screenHeight - Ekran yüksekliği
 * @returns {boolean} Ekrandan çıktı mı?
 */
export const isParticleOutOfBounds = (particle, screenWidth, screenHeight) => {
  return (
    particle.x < -50 ||
    particle.x > screenWidth + 50 ||
    particle.y < -50 ||
    particle.y > screenHeight + 50
  );
};
