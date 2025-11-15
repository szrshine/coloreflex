import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKINS } from '../constants/skins';

/**
 * useTheme - Tema/skin yönetimi hook'u
 *
 * Seçili skin'i yönetir, renkleri ve tema verilerini sağlar
 */
const useTheme = () => {
  const [selectedSkin, setSelectedSkin] = useState('default');

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

  // Skin seç ve kaydet
  const selectSkin = useCallback(async (skinId) => {
    setSelectedSkin(skinId);
    try {
      await AsyncStorage.setItem('selectedSkin', skinId);
    } catch (error) {
      console.error('Skin kaydedilemedi:', error);
    }
  }, []);

  // Skin'i yükle
  const loadSelectedSkin = useCallback(async () => {
    try {
      const savedSkin = await AsyncStorage.getItem('selectedSkin');
      if (savedSkin) {
        setSelectedSkin(savedSkin);
      }
    } catch (error) {
      console.error('Skin yüklenemedi:', error);
    }
  }, []);

  return {
    selectedSkin,
    setSelectedSkin,
    selectSkin,
    loadSelectedSkin,
    getCurrentSkinColors,
    getCurrentSkinTheme,
    currentTheme,
  };
};

export default useTheme;
