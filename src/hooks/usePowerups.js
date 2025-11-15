import { useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POWERUPS } from '../constants/powerups';

/**
 * usePowerups - Power-up yönetimi hook'u
 *
 * Power-up envanteri, satın alma, kullanma işlemlerini yönetir
 */
const usePowerups = ({ coins, spendCoins, triggerHaptic, playSound, clickSound, showShopPopup }) => {
  const [powerupInventory, setPowerupInventory] = useState({
    slowmotion: 0,
    shield: 0,
    freeze: 0,
  });
  const [activePowerup, setActivePowerup] = useState(null);
  const [shieldActive, setShieldActive] = useState(false);
  const [powerupPurchasePopup, setPowerupPurchasePopup] = useState({ visible: false, message: '' });

  const shieldActiveRef = useRef(false);
  const shieldUsedBallsRef = useRef(new Set());
  const powerupTimeoutRef = useRef(null);
  const powerupPopupTimeoutRef = useRef(null);

  // Power-up envanterini yükle
  const loadPowerupInventory = useCallback(async () => {
    try {
      const savedInventory = await AsyncStorage.getItem('powerupInventory');
      if (savedInventory) {
        setPowerupInventory(JSON.parse(savedInventory));
      }
    } catch (error) {
      // Silent fail
    }
  }, []);

  // Power-up envanterini kaydet
  const savePowerupInventory = useCallback(async (inventory) => {
    try {
      await AsyncStorage.setItem('powerupInventory', JSON.stringify(inventory));
      setPowerupInventory(inventory);
    } catch (error) {
      // Silent fail
    }
  }, []);

  // Power-up satın al
  const buyPowerup = useCallback(async (powerupId) => {
    const powerup = POWERUPS.find(p => p.id === powerupId);
    if (!powerup) return;

    if (coins < powerup.coinPrice) {
      showShopPopup(`${powerup.coinPrice} coin gerekli`);
      return;
    }

    const spent = await spendCoins(powerup.coinPrice);
    if (spent) {
      const newInventory = {
        ...powerupInventory,
        [powerupId]: (powerupInventory[powerupId] || 0) + 1
      };
      await savePowerupInventory(newInventory);

      triggerHaptic('success');
      playSound(clickSound);

      // Custom popup göster
      setPowerupPurchasePopup({ visible: true, message: `${powerup.name} satın alındı!` });

      if (powerupPopupTimeoutRef.current) {
        clearTimeout(powerupPopupTimeoutRef.current);
      }

      powerupPopupTimeoutRef.current = setTimeout(() => {
        setPowerupPurchasePopup({ visible: false, message: '' });
      }, 1000);
    }
  }, [coins, powerupInventory, spendCoins, savePowerupInventory, triggerHaptic, playSound, clickSound, showShopPopup]);

  // Power-up kullan
  const usePowerup = useCallback(async (powerupId) => {
    const powerup = POWERUPS.find(p => p.id === powerupId);
    if (!powerup) return;

    if (powerupInventory[powerupId] <= 0) {
      showShopPopup('Envanterde yok');
      return;
    }

    // Shield için activePowerup kontrolü yapma
    if (powerup.effect !== 'shield' && activePowerup !== null) {
      showShopPopup('Zaten bir power-up aktif');
      return;
    }

    // Envanterden düş
    const newInventory = {
      ...powerupInventory,
      [powerupId]: powerupInventory[powerupId] - 1
    };
    await savePowerupInventory(newInventory);

    // Efekti aktif et
    if (powerup.effect === 'slowmotion') {
      setActivePowerup('slowmotion');
      triggerHaptic('medium');
      playSound(clickSound);

      if (powerupTimeoutRef.current) {
        clearTimeout(powerupTimeoutRef.current);
      }
      powerupTimeoutRef.current = setTimeout(() => {
        setActivePowerup(null);
      }, powerup.duration);
    } else if (powerup.effect === 'shield') {
      setShieldActive(true);
      shieldActiveRef.current = true;
      triggerHaptic('medium');
      playSound(clickSound);
    } else if (powerup.effect === 'freeze') {
      setActivePowerup('freeze');
      triggerHaptic('medium');
      playSound(clickSound);

      if (powerupTimeoutRef.current) {
        clearTimeout(powerupTimeoutRef.current);
      }
      powerupTimeoutRef.current = setTimeout(() => {
        setActivePowerup(null);
      }, powerup.duration);
    }
  }, [powerupInventory, activePowerup, savePowerupInventory, triggerHaptic, playSound, clickSound, showShopPopup]);

  // Power-up paketi ekle (IAP'tan)
  const addPowerupPack = useCallback(async () => {
    const newInventory = {
      ...powerupInventory,
      slowmotion: (powerupInventory.slowmotion || 0) + 5,
      shield: (powerupInventory.shield || 0) + 5,
      freeze: (powerupInventory.freeze || 0) + 5,
    };
    await savePowerupInventory(newInventory);
  }, [powerupInventory, savePowerupInventory]);

  return {
    // State
    powerupInventory,
    activePowerup,
    shieldActive,
    setShieldActive,
    powerupPurchasePopup,
    setPowerupPurchasePopup,
    // Refs
    shieldActiveRef,
    shieldUsedBallsRef,
    powerupTimeoutRef,
    // Functions
    loadPowerupInventory,
    savePowerupInventory,
    buyPowerup,
    usePowerup,
    addPowerupPack,
  };
};

export default usePowerups;
