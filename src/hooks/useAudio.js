import { useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

/**
 * Custom hook for managing audio (sounds, music) and haptic feedback
 * Bu hook tüm ses, müzik ve haptic işlemlerini yönetir
 */
export const useAudio = ({ soundEnabled, musicEnabled, hapticEnabled, gameState, settingsVisible }) => {
  // Sound refs
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const clickSound = useRef(null);
  const backgroundMusic = useRef(null);

  // ===========================
  // Load Sounds
  // ===========================

  const loadSounds = useCallback(async () => {
    try {
      const { sound: correct } = await Audio.Sound.createAsync(
        require('../../assets/sounds/correct.mp3')
      );
      correctSound.current = correct;
      console.log('✅ Correct sound loaded');

      const { sound: wrong } = await Audio.Sound.createAsync(
        require('../../assets/sounds/wrong.mp3')
      );
      wrongSound.current = wrong;
      console.log('✅ Wrong sound loaded');

      // Click sesi opsiyonel - yoksa hata vermesin
      try {
        const { sound: click } = await Audio.Sound.createAsync(
          require('../../assets/sounds/click.mp3')
        );
        clickSound.current = click;
        console.log('✅ Click sound loaded');
      } catch (e) {
        console.log('⚠️ Click sound not found, using haptic only');
      }

      const { sound: music } = await Audio.Sound.createAsync(
        require('../../assets/sounds/background.mp3'),
        { isLooping: true, shouldPlay: false, volume: 0.6 }
      );
      backgroundMusic.current = music;
      console.log('✅ Background music loaded');

    } catch (error) {
      console.log('❌ Ses yükleme hatası:', error);
    }
  }, []);

  // Load sounds on mount
  useEffect(() => {
    loadSounds();

    // Cleanup on unmount
    return () => {
      correctSound.current?.unloadAsync();
      wrongSound.current?.unloadAsync();
      clickSound.current?.unloadAsync();
      backgroundMusic.current?.unloadAsync();
    };
  }, [loadSounds]);

  // ===========================
  // Play Sound
  // ===========================

  const playSound = useCallback(async (soundRef) => {
    if (!soundEnabled || !soundRef.current) return;

    try {
      await soundRef.current.replayAsync();
    } catch (error) {
      console.log('Ses çalma hatası:', error);
    }
  }, [soundEnabled]);

  // Named sound functions for easy use
  const playCorrectSound = useCallback(() => playSound(correctSound), [playSound]);
  const playWrongSound = useCallback(() => playSound(wrongSound), [playSound]);
  const playClickSound = useCallback(() => playSound(clickSound), [playSound]);

  // ===========================
  // Music Control
  // ===========================

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

  // ===========================
  // Haptic Feedback
  // ===========================

  const triggerHaptic = useCallback((type = 'light') => {
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
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('Haptic hatası:', error);
    }
  }, [hapticEnabled]);

  // ===========================
  // Return
  // ===========================

  return {
    // Sound refs (if needed externally)
    correctSound,
    wrongSound,
    clickSound,
    backgroundMusic,

    // Functions
    playCorrectSound,
    playWrongSound,
    playClickSound,
    triggerHaptic,
    loadSounds,
  };
};
