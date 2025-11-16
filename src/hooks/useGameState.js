import { useState, useCallback } from 'react';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

/**
 * useGameState - Oyun durumu ve UI state yönetimi hook'u
 *
 * Game state, modal, tutorial, settings gibi UI state'lerini yönetir
 */
const useGameState = () => {
  const [gameState, setGameState] = useState('menu');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [previousGameState, setPreviousGameState] = useState('menu');
  const [countdown, setCountdown] = useState(0);
  // Initial value: Daha güvenli başlangıç değeri (reklam var varsayımı ile)
  // Banner (60) + Box container (120) = 180, ama güvenli olması için 200
  const [boxContainerY, setBoxContainerY] = useState(height - 180);

  // Ayarlar aç
  const openSettings = useCallback(() => {
    setPreviousGameState(gameState);
    setSettingsVisible(true);
  }, [gameState]);

  // Ayarlar kapat
  const closeSettings = useCallback(() => {
    setSettingsVisible(false);
    setGameState(previousGameState);
  }, [previousGameState]);

  // Tutorial'ı yeniden başlat
  const restartTutorial = useCallback(() => {
    setShowTutorial(false);
    setTutorialStep(0);
    setSettingsVisible(false);
    setGameState('tutorial');
  }, []);

  // Tutorial'ı tamamla
  const completeTutorial = useCallback(() => {
    setShowTutorial(true);
    setGameState('menu');
  }, []);

  // Tutorial adımını değiştir
  const nextTutorialStep = useCallback(() => {
    setTutorialStep(prev => prev + 1);
  }, []);

  const prevTutorialStep = useCallback(() => {
    setTutorialStep(prev => Math.max(0, prev - 1));
  }, []);

  // Modal göster
  const showModal = useCallback((title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    // State
    gameState,
    setGameState,
    modalVisible,
    modalContent,
    modalTitle,
    tutorialStep,
    showTutorial,
    setShowTutorial,
    settingsVisible,
    previousGameState,
    countdown,
    setCountdown,
    boxContainerY,
    setBoxContainerY,
    // Functions
    openSettings,
    closeSettings,
    restartTutorial,
    completeTutorial,
    nextTutorialStep,
    prevTutorialStep,
    showModal,
    closeModal,
    setModalVisible,
    setTutorialStep,
  };
};

export default useGameState;
