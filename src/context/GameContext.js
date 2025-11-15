import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_SPEED } from '../constants/gameConfig';

/**
 * Game Context - Merkezi state yönetimi
 *
 * Bu context oyun state'lerini kategorilere ayırarak yönetir:
 * - Game State: Oyun durumu, skor, toplar
 * - UI State: Modal'lar, popup'lar, ekran görünürlüğü
 * - Power-up State: Aktif power-up'lar ve envanter
 *
 * Not: Storage, achievements, daily rewards için ayrı hook'lar kullanılıyor
 */

const GameContext = createContext(null);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // ===========================
  // Game State
  // ===========================
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver, tutorial, achievements, stats, store, dailyTasks
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [particles, setParticles] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [boxContainerY, setBoxContainerY] = useState(null);

  // ===========================
  // UI State
  // ===========================
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [previousGameState, setPreviousGameState] = useState('menu');

  // ===========================
  // Power-up State
  // ===========================
  const [activePowerup, setActivePowerup] = useState(null);
  const [shieldActive, setShieldActive] = useState(false);
  const [powerupPurchasePopup, setPowerupPurchasePopup] = useState({
    visible: false,
    message: ''
  });

  // ===========================
  // Shop State
  // ===========================
  const [shopPurchasePopup, setShopPurchasePopup] = useState({
    visible: false,
    message: ''
  });

  // ===========================
  // IAP State
  // ===========================
  const [iapProducts, setIapProducts] = useState([]);
  const [iapLoading, setIapLoading] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [premiumSkinsOwned, setPremiumSkinsOwned] = useState(false);

  // ===========================
  // Ad State
  // ===========================
  const [gamesPlayedSinceAd, setGamesPlayedSinceAd] = useState(0);
  const [continueUsesToday, setContinueUsesToday] = useState(0);

  // ===========================
  // Game Actions
  // ===========================

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setBalls([]);
    setSpeed(INITIAL_SPEED);
    setParticles([]);
    setCurrentStreak(0);
    setCountdown(3);
    setActivePowerup(null);
    setShieldActive(false);
  }, []);

  const endGame = useCallback(() => {
    setGameState('gameOver');
  }, []);

  const resetGame = useCallback(() => {
    setGameState('menu');
    setScore(0);
    setBalls([]);
    setSpeed(INITIAL_SPEED);
    setParticles([]);
    setCurrentStreak(0);
    setCountdown(0);
    setActivePowerup(null);
    setShieldActive(false);
  }, []);

  const incrementScore = useCallback(() => {
    setScore(prev => prev + 1);
  }, []);

  const incrementStreak = useCallback(() => {
    setCurrentStreak(prev => prev + 1);
  }, []);

  const resetStreak = useCallback(() => {
    setCurrentStreak(0);
  }, []);

  // ===========================
  // UI Actions
  // ===========================

  const showModal = useCallback((title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalVisible(false);
    setModalTitle('');
    setModalContent('');
  }, []);

  const openSettings = useCallback(() => {
    setPreviousGameState(gameState);
    setSettingsVisible(true);
  }, [gameState]);

  const closeSettings = useCallback(() => {
    setSettingsVisible(false);
    setGameState(previousGameState);
  }, [previousGameState]);

  const showPowerupPopup = useCallback((message) => {
    setPowerupPurchasePopup({ visible: true, message });
    setTimeout(() => {
      setPowerupPurchasePopup({ visible: false, message: '' });
    }, 2000);
  }, []);

  const showShopPopup = useCallback((message) => {
    setShopPurchasePopup({ visible: true, message });
    setTimeout(() => {
      setShopPurchasePopup({ visible: false, message: '' });
    }, 2000);
  }, []);

  // ===========================
  // Power-up Actions
  // ===========================

  const activatePowerup = useCallback((powerupId) => {
    setActivePowerup(powerupId);
  }, []);

  const deactivatePowerup = useCallback(() => {
    setActivePowerup(null);
  }, []);

  const activateShield = useCallback(() => {
    setShieldActive(true);
  }, []);

  const deactivateShield = useCallback(() => {
    setShieldActive(false);
  }, []);

  // ===========================
  // Context Value
  // ===========================

  const value = {
    // Game State
    gameState,
    setGameState,
    score,
    setScore,
    balls,
    setBalls,
    speed,
    setSpeed,
    particles,
    setParticles,
    currentStreak,
    setCurrentStreak,
    countdown,
    setCountdown,
    boxContainerY,
    setBoxContainerY,

    // UI State
    modalVisible,
    modalContent,
    modalTitle,
    tutorialStep,
    setTutorialStep,
    showTutorial,
    setShowTutorial,
    settingsVisible,
    previousGameState,

    // Power-up State
    activePowerup,
    shieldActive,
    powerupPurchasePopup,
    shopPurchasePopup,

    // IAP State
    iapProducts,
    setIapProducts,
    iapLoading,
    setIapLoading,
    adsRemoved,
    setAdsRemoved,
    premiumSkinsOwned,
    setPremiumSkinsOwned,

    // Ad State
    gamesPlayedSinceAd,
    setGamesPlayedSinceAd,
    continueUsesToday,
    setContinueUsesToday,

    // Actions
    startGame,
    endGame,
    resetGame,
    incrementScore,
    incrementStreak,
    resetStreak,
    showModal,
    hideModal,
    openSettings,
    closeSettings,
    showPowerupPopup,
    showShopPopup,
    activatePowerup,
    deactivatePowerup,
    activateShield,
    deactivateShield,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
