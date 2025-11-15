import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { BALL_SIZE, INITIAL_SPEED, SPEED_INCREMENT } from '../constants/gameConfig';

/**
 * useGameLogic - Oyun mantığı ve akışını yöneten hook
 *
 * Game loop, ball spawning, collision detection, game state management
 */
const useGameLogic = ({
  gameState,
  setGameState,
  adsRemoved,
  shieldActive,
  setShieldActive,
  freezeActive,
  countdown,
  currentTheme,
  boxContainerY,
  gamesPlayedSinceAd,
  setGamesPlayedSinceAd,
  // Callbacks
  triggerHaptic,
  playSound,
  saveHighScore,
  addCoins,
  checkAndUnlockAchievement,
  updateDailyTask,
  isInterstitialReady,
  showInterstitialAd,
  // Sounds
  clickSound,
  wrongSound,
  successSound,
  // Stats
  totalGamesPlayed,
  setTotalGamesPlayed,
  totalScore,
  setTotalScore,
  totalWrongMatches,
  setTotalWrongMatches,
  totalCorrectMatches,
  setTotalCorrectMatches,
  currentStreak,
  setCurrentStreak,
  longestStreak,
  setLongestStreak,
}) => {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [particles, setParticles] = useState([]);

  const gameLoop = useRef(null);
  const ballIdCounter = useRef(0);
  const shieldActiveRef = useRef(false);
  const shieldUsedBallsRef = useRef(new Set());

  // Shield state'i ref ile senkronize et
  useEffect(() => {
    shieldActiveRef.current = shieldActive;
  }, [shieldActive]);

  // Parçacık efekti oluştur
  const createParticles = (x, y, color, isSuccess = true) => {
    const particleCount = isSuccess ? 8 : 12;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = isSuccess ? 3 + Math.random() * 2 : 4 + Math.random() * 3;

      newParticles.push({
        id: Date.now() + Math.random(),
        x,
        y,
        color,
        angle,
        velocity,
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    newParticles.forEach((particle) => {
      Animated.parallel([
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: isSuccess ? 600 : 800,
          useNativeDriver: true,
        }),
        Animated.timing(particle.scale, {
          toValue: 0,
          duration: isSuccess ? 600 : 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      });
    });
  };

  // Yeni top oluştur
  const spawnBall = () => {
    const skinColors = currentTheme.colors;
    const newBallColor = skinColors[Math.floor(Math.random() * skinColors.length)];
    const randomX = Math.random() * (400 - BALL_SIZE * 2) + BALL_SIZE;

    const newBall = {
      id: ballIdCounter.current++,
      x: randomX,
      y: -BALL_SIZE,
      color: newBallColor,
      colorId: skinColors.indexOf(newBallColor),
      targetColorId: null,
      targetBoxIndex: null,
      directed: false,
      fadeAnim: new Animated.Value(1),
    };

    setBalls((prev) => [...prev, newBall]);
  };

  // Topu yönlendir
  const directBall = (ballId, targetColorId, boxIndex) => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) => {
        if (ball.id === ballId && !ball.directed) {
          return {
            ...ball,
            targetColorId,
            targetBoxIndex,
            directed: true,
          };
        }
        return ball;
      })
    );
  };

  // Top hedefe ulaştı mı kontrol et
  const checkBallReached = (ball) => {
    if (ball.y >= boxContainerY - BALL_SIZE / 2) {
      if (ball.directed) {
        // Renk eşleşmesi kontrol et
        if (ball.colorId === ball.targetColorId) {
          // Doğru eşleşme
          triggerHaptic('light');
          playSound(successSound);
          createParticles(ball.x, ball.y, ball.color, true);

          // Fade out animasyonu
          Animated.timing(ball.fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            setBalls((prev) => prev.filter((b) => b.id !== ball.id));
          }, 200);

          // Skoru artır
          setScore((prevScore) => {
            const newScore = prevScore + 1;

            if (newScore % 5 === 0) {
              setSpeed((prevSpeed) => prevSpeed + SPEED_INCREMENT);
            }

            return newScore;
          });

          // Stats güncelle
          setTotalCorrectMatches((prev) => prev + 1);
          setCurrentStreak((prev) => prev + 1);

          return true;
        } else {
          // Yanlış eşleşme - Game Over
          // Shield kontrolü
          if (shieldActiveRef.current) {
            // Shield kullanıldı, oyun bitmesin, topu kaldır
            setShieldActive(false);
            shieldActiveRef.current = false;
            shieldUsedBallsRef.current.add(ball.id);
            triggerHaptic('warning');
            playSound(clickSound);

            Animated.timing(ball.fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();

            setTimeout(() => {
              setBalls((prev) => prev.filter((b) => b.id !== ball.id));
              shieldUsedBallsRef.current.delete(ball.id);
            }, 200);

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
          shieldUsedBallsRef.current.add(ball.id);
          triggerHaptic('warning');
          playSound(clickSound);

          Animated.timing(ball.fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            setBalls((prev) => prev.filter((b) => b.id !== ball.id));
            shieldUsedBallsRef.current.delete(ball.id);
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

  // Oyunu başlat
  const startGame = () => {
    setScore(0);
    setBalls([]);
    setSpeed(INITIAL_SPEED);
    setParticles([]);
    setGameState('playing');
    setCurrentStreak(0);
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

    // Başarımları kontrol et
    await checkAndUnlockAchievement('first_game', newTotalGames);
    await checkAndUnlockAchievement('century', newTotalGames);
    await checkAndUnlockAchievement('beginner', score);
    await checkAndUnlockAchievement('expert', score);
    await checkAndUnlockAchievement('master', score);
    await checkAndUnlockAchievement('legend', score);

    // Günlük görevleri güncelle
    updateDailyTask('play_5', newTotalGames % 1000);
    if (score >= 25) {
      updateDailyTask('score_25', 25);
    }

    // Coin kazandır
    await addCoins(score);

    // Interstitial reklam göster
    const newGamesCount = gamesPlayedSinceAd + 1;
    setGamesPlayedSinceAd(newGamesCount);

    if (!adsRemoved && newGamesCount >= 3) {
      setTimeout(() => {
        if (isInterstitialReady()) {
          showInterstitialAd();
          setGamesPlayedSinceAd(0);
        }
      }, 1000);
    }
  };

  // Game loop effect
  useEffect(() => {
    if (gameState === 'playing' && gameLoop.current) {
      clearInterval(gameLoop.current);
    }

    if (gameState === 'playing') {
      const currentSpeed = freezeActive ? speed * 0.3 : speed;

      gameLoop.current = setInterval(() => {
        setBalls((prevBalls) => {
          const updatedBalls = prevBalls.map((ball) => ({
            ...ball,
            y: ball.y + currentSpeed,
          }));

          // Collision detection
          updatedBalls.forEach((ball) => {
            checkBallReached(ball);
          });

          return updatedBalls;
        });
      }, 16); // ~60 FPS

      return () => {
        if (gameLoop.current) {
          clearInterval(gameLoop.current);
        }
      };
    }
  }, [gameState, speed, freezeActive, boxContainerY]);

  // Ball spawning effect
  useEffect(() => {
    if (gameState === 'playing' && !freezeActive && countdown === 0) {
      const spawnInterval = setInterval(() => {
        spawnBall();
      }, 1500);

      return () => clearInterval(spawnInterval);
    }
  }, [gameState, freezeActive, countdown, currentTheme]);

  return {
    // State
    score,
    balls,
    speed,
    particles,
    // Functions
    startGame,
    endGame,
    spawnBall,
    directBall,
    checkBallReached,
    createParticles,
    setBalls,
    setParticles,
  };
};

export default useGameLogic;
