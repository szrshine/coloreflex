import { useState, useEffect, useCallback } from 'react';
import {
  initializeAdMob,
  loadInterstitialAd,
  showInterstitialAd,
  isInterstitialReady,
  loadRewardedAd,
  showRewardedAd,
  isRewardedAdReady,
  initializeIAP,
  loadProducts,
  purchaseProduct,
  restorePurchases as restorePurchasesService,
  hasRemovedAds,
  hasPremiumSkins,
  getAvailableProducts,
  IAP_PRODUCT_IDS,
} from '../../monetization';

/**
 * useMonetization - Reklam ve IAP yönetimi hook'u
 *
 * AdMob ve In-App Purchase işlemlerini yönetir
 */
const useMonetization = ({ addCoins }) => {
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [premiumSkinsOwned, setPremiumSkinsOwned] = useState(false);
  const [iapProducts, setIapProducts] = useState([]);
  const [iapLoading, setIapLoading] = useState(false);
  const [gamesPlayedSinceAd, setGamesPlayedSinceAd] = useState(0);
  const [continueUsesToday, setContinueUsesToday] = useState(0);
  const [shopPurchasePopup, setShopPurchasePopup] = useState({ visible: false, message: '' });

  // Monetizasyon başlatma
  const initializeMonetization = useCallback(async () => {
    // AdMob başlat
    const adMobInitialized = await initializeAdMob();
    if (adMobInitialized) {
      loadInterstitialAd();
      loadRewardedAd();
    }

    // IAP başlat
    const iapInitialized = await initializeIAP();
    if (iapInitialized) {
      const products = await loadProducts();
      setIapProducts(products || []);

      // Satın alınan ürünleri kontrol et
      const removedAds = await hasRemovedAds();
      const premiumSkins = await hasPremiumSkins();
      setAdsRemoved(removedAds);
      setPremiumSkinsOwned(premiumSkins);
    }
  }, []);

  // Shop popup göster
  const showShopPopup = useCallback((message) => {
    setShopPurchasePopup({ visible: true, message });
    setTimeout(() => {
      setShopPurchasePopup({ visible: false, message: '' });
    }, 2000);
  }, []);

  // Devam etmek için reklam izle
  const handleContinueWithAd = useCallback(() => {
    if (isRewardedAdReady()) {
      showRewardedAd(
        (rewarded) => {
          if (rewarded) {
            return true;
          }
          return false;
        },
        (error) => {
          return false;
        }
      );
    } else {
      loadRewardedAd();
      return false;
    }
  }, []);

  // Reklam izleyerek coin kazan
  const handleWatchAdForCoins = useCallback(() => {
    if (isRewardedAdReady()) {
      showRewardedAd(
        async (rewarded) => {
          if (rewarded) {
            await addCoins(25);
            showShopPopup('🎉 25 coin kazandınız!');
          }
        },
        (error) => {
          showShopPopup('❌ Reklam yüklenemedi');
        }
      );
    } else {
      loadRewardedAd();
      showShopPopup('⏳ Reklam yükleniyor...');
    }
  }, [addCoins, showShopPopup]);

  // Ürün satın al
  const handlePurchase = useCallback(async (productId) => {
    setIapLoading(true);
    try {
      const success = await purchaseProduct(productId);

      if (success) {
        // Satın alma başarılı
        if (productId === IAP_PRODUCT_IDS.removeAds) {
          setAdsRemoved(true);
          showShopPopup('✅ Reklamlar kaldırıldı!');
        } else if (productId === IAP_PRODUCT_IDS.premiumSkins) {
          setPremiumSkinsOwned(true);
          showShopPopup('✅ Premium skinler açıldı!');
        } else if (productId === IAP_PRODUCT_IDS.powerUpPack) {
          showShopPopup('✅ Power-up paketi alındı!');
        } else if (productId === IAP_PRODUCT_IDS.coinPackSmall) {
          await addCoins(100);
          showShopPopup('✅ 100 coin kazandınız!');
        } else if (productId === IAP_PRODUCT_IDS.coinPackMedium) {
          await addCoins(600);
          showShopPopup('✅ 600 coin kazandınız!');
        } else if (productId === IAP_PRODUCT_IDS.coinPackLarge) {
          await addCoins(1500);
          showShopPopup('✅ 1500 coin kazandınız!');
        }
      }
    } catch (error) {
      showShopPopup('❌ Satın alma başarısız');
    } finally {
      setIapLoading(false);
    }
  }, [addCoins, showShopPopup]);

  // Satın almaları geri yükle
  const handleRestorePurchases = useCallback(async () => {
    setIapLoading(true);
    try {
      await restorePurchasesService();

      const removedAds = await hasRemovedAds();
      const premiumSkins = await hasPremiumSkins();

      setAdsRemoved(removedAds);
      setPremiumSkinsOwned(premiumSkins);

      if (removedAds || premiumSkins) {
        showShopPopup('✅ Satın almalar geri yüklendi!');
      } else {
        showShopPopup('ℹ️ Geri yüklenecek satın alma bulunamadı');
      }
    } catch (error) {
      showShopPopup('❌ Geri yükleme başarısız');
    } finally {
      setIapLoading(false);
    }
  }, [showShopPopup]);

  return {
    // State
    adsRemoved,
    premiumSkinsOwned,
    iapProducts,
    iapLoading,
    gamesPlayedSinceAd,
    setGamesPlayedSinceAd,
    continueUsesToday,
    setContinueUsesToday,
    shopPurchasePopup,
    setShopPurchasePopup,
    // Functions
    initializeMonetization,
    showShopPopup,
    handleContinueWithAd,
    handleWatchAdForCoins,
    handlePurchase,
    handleRestorePurchases,
    // Utilities
    isInterstitialReady,
    showInterstitialAd,
    loadInterstitialAd,
  };
};

export default useMonetization;
