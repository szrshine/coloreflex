import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKINS } from '../constants/skins';

/**
 * useSkins - Skin yönetimi hook'u
 *
 * Skin seçimi, satın alma, owned skins yönetimi
 */
const useSkins = ({ coins, spendCoins, triggerHaptic, playSound, clickSound, premiumSkinsOwned }) => {
  const [selectedSkin, setSelectedSkin] = useState('default');
  const [ownedSkins, setOwnedSkins] = useState(['default']);

  // Seçili skin'in renklerini al
  const getCurrentSkinColors = useCallback(() => {
    const skin = SKINS.find(s => s.id === selectedSkin);
    return skin ? skin.colors : SKINS[0].colors;
  }, [selectedSkin]);

  // Seçili skin'in temasını al
  const getCurrentSkinTheme = useCallback(() => {
    const skin = SKINS.find(s => s.id === selectedSkin);
    return skin ? skin.theme : SKINS[0].theme;
  }, [selectedSkin]);

  // Current theme - memoized
  const currentTheme = useMemo(() => getCurrentSkinTheme(), [getCurrentSkinTheme]);

  // Skin yükle
  const loadSelectedSkin = useCallback(async () => {
    try {
      const savedSkin = await AsyncStorage.getItem('selectedSkin');
      if (savedSkin) {
        setSelectedSkin(savedSkin);
      }
    } catch (error) {
      // Silent fail
    }
  }, []);

  // Owned skins yükle
  const loadOwnedSkins = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('ownedSkins');
      if (saved) {
        setOwnedSkins(JSON.parse(saved));
      }
    } catch (error) {
      // Silent fail
    }
  }, []);

  // Owned skins kaydet
  const saveOwnedSkins = useCallback(async (skins) => {
    try {
      await AsyncStorage.setItem('ownedSkins', JSON.stringify(skins));
      setOwnedSkins(skins);
    } catch (error) {
      // Silent fail
    }
  }, []);

  // Skin seç
  const selectSkin = useCallback(async (skinId) => {
    setSelectedSkin(skinId);
    try {
      await AsyncStorage.setItem('selectedSkin', skinId);
      triggerHaptic('light');
      playSound(clickSound);
    } catch (error) {
      // Silent fail
    }
  }, [triggerHaptic, playSound, clickSound]);

  // Skin satın al
  const buySkin = useCallback(async (skinId) => {
    const skin = SKINS.find(s => s.id === skinId);
    if (!skin) return false;

    // Premium skin kontrolü
    if (skin.isPremium && !premiumSkinsOwned) {
      return { success: false, message: 'Premium skin paketi gerekli' };
    }

    // Coin kontrolü
    if (coins < skin.coinPrice) {
      return { success: false, message: `${skin.coinPrice} coin gerekli` };
    }

    // Zaten sahip mi?
    if (ownedSkins.includes(skinId)) {
      return { success: false, message: 'Zaten sahipsiniz' };
    }

    // Satın al
    const spent = await spendCoins(skin.coinPrice);
    if (spent) {
      const newOwnedSkins = [...ownedSkins, skinId];
      await saveOwnedSkins(newOwnedSkins);
      await selectSkin(skinId);
      triggerHaptic('success');
      return { success: true, message: `${skin.name} satın alındı!` };
    }

    return { success: false, message: 'Satın alma başarısız' };
  }, [coins, ownedSkins, premiumSkinsOwned, spendCoins, saveOwnedSkins, selectSkin, triggerHaptic]);

  // Premium skinleri aç
  const unlockPremiumSkins = useCallback(async () => {
    const premiumSkins = SKINS.filter(s => s.isPremium).map(s => s.id);
    const newOwnedSkins = [...new Set([...ownedSkins, ...premiumSkins])];
    await saveOwnedSkins(newOwnedSkins);
  }, [ownedSkins, saveOwnedSkins]);

  return {
    // State
    selectedSkin,
    ownedSkins,
    currentTheme,
    // Functions
    getCurrentSkinColors,
    getCurrentSkinTheme,
    loadSelectedSkin,
    loadOwnedSkins,
    selectSkin,
    buySkin,
    unlockPremiumSkins,
  };
};

export default useSkins;
