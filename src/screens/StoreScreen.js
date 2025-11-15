import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IAP_PRODUCT_IDS } from '../../monetization';

/**
 * StoreScreen - Mağaza ekranı
 */
const StoreScreen = ({
  // State
  coins,
  adsRemoved,
  premiumSkinsOwned,
  iapLoading,
  currentTheme,
  shopPurchasePopup,

  // Handlers
  onNavigateMenu,
  onPurchase,
  onRestorePurchases,
  onWatchAdForCoins,
  onCloseShopPopup,
  onTriggerHaptic,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.storeContainer}>
        <View style={styles.storeHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              onTriggerHaptic('light');
              onNavigateMenu();
            }}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.storeTitle}>🛒 Mağaza</Text>
          <View style={styles.coinIndicatorSmall}>
            <Text style={styles.coinIconSmall}>💰</Text>
            <Text style={styles.coinTextSmall}>{coins}</Text>
          </View>
        </View>

        <ScrollView style={styles.storeList} showsVerticalScrollIndicator={false}>
          {/* Reklam İzle - Coin Kazan */}
          <View style={styles.storeCard}>
            <View style={styles.storeCardHeader}>
              <Text style={styles.storeCardIcon}>📺</Text>
              <View style={styles.storeCardInfo}>
                <Text style={styles.storeCardTitle}>Reklam İzle</Text>
                <Text style={styles.storeCardDescription}>25 coin kazan</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.storeWatchAdButton}
              onPress={() => {
                onTriggerHaptic('medium');
                onWatchAdForCoins();
              }}
            >
              <Text style={styles.storeWatchAdButtonText}>İZLE</Text>
            </TouchableOpacity>
          </View>

          {/* Reklamsız Versiyon */}
          <View style={styles.storeCard}>
            <View style={styles.storeCardHeader}>
              <Text style={styles.storeCardIcon}>🚫</Text>
              <View style={styles.storeCardInfo}>
                <Text style={styles.storeCardTitle}>Reklamsız Versiyon</Text>
                <Text style={styles.storeCardDescription}>
                  Tüm reklamları kaldır
                </Text>
              </View>
            </View>
            {adsRemoved ? (
              <View style={styles.storePurchasedBadge}>
                <Text style={styles.storePurchasedText}>✓ Satın Alındı</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.storeBuyButton}
                onPress={() => {
                  onTriggerHaptic('medium');
                  onPurchase(IAP_PRODUCT_IDS.removeAds);
                }}
                disabled={iapLoading}
              >
                {iapLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.storeBuyButtonText}>$2.99</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Premium Skin Paketi */}
          <View style={styles.storeCard}>
            <View style={styles.storeCardHeader}>
              <Text style={styles.storeCardIcon}>🎨</Text>
              <View style={styles.storeCardInfo}>
                <Text style={styles.storeCardTitle}>Premium Skin Paketi</Text>
                <Text style={styles.storeCardDescription}>
                  Tüm premium skinleri aç
                </Text>
              </View>
            </View>
            {premiumSkinsOwned ? (
              <View style={styles.storePurchasedBadge}>
                <Text style={styles.storePurchasedText}>✓ Satın Alındı</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.storeBuyButton}
                onPress={() => {
                  onTriggerHaptic('medium');
                  onPurchase(IAP_PRODUCT_IDS.premiumSkins);
                }}
                disabled={iapLoading}
              >
                {iapLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.storeBuyButtonText}>$1.99</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Power-Up Paketi */}
          <View style={styles.storeCard}>
            <View style={styles.storeCardHeader}>
              <Text style={styles.storeCardIcon}>⚡</Text>
              <View style={styles.storeCardInfo}>
                <Text style={styles.storeCardTitle}>Power-Up Paketi</Text>
                <Text style={styles.storeCardDescription}>
                  5 Yavaş Çekim + 5 Kalkan + 5 Dondur
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.storeBuyButton}
              onPress={() => {
                onTriggerHaptic('medium');
                onPurchase(IAP_PRODUCT_IDS.powerUpPack);
              }}
              disabled={iapLoading}
            >
              {iapLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.storeBuyButtonText}>$0.99</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Coin Paketleri */}
          <Text style={styles.storeSectionTitle}>💰 Coin Paketleri</Text>

          <View style={styles.storeCard}>
            <View style={styles.storeCardHeader}>
              <Text style={styles.storeCardIcon}>💵</Text>
              <View style={styles.storeCardInfo}>
                <Text style={styles.storeCardTitle}>Küçük Paket</Text>
                <Text style={styles.storeCardDescription}>100 coin</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.storeBuyButton}
              onPress={() => {
                onTriggerHaptic('medium');
                onPurchase(IAP_PRODUCT_IDS.coinPackSmall);
              }}
              disabled={iapLoading}
            >
              {iapLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.storeBuyButtonText}>$0.99</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.storeCard}>
            <View style={styles.storeCardHeader}>
              <Text style={styles.storeCardIcon}>💴</Text>
              <View style={styles.storeCardInfo}>
                <Text style={styles.storeCardTitle}>Orta Paket</Text>
                <Text style={styles.storeCardDescription}>600 coin</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.storeBuyButton}
              onPress={() => {
                onTriggerHaptic('medium');
                onPurchase(IAP_PRODUCT_IDS.coinPackMedium);
              }}
              disabled={iapLoading}
            >
              {iapLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.storeBuyButtonText}>$4.99</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.storeCard}>
            <View style={styles.storeCardHeader}>
              <Text style={styles.storeCardIcon}>💸</Text>
              <View style={styles.storeCardInfo}>
                <Text style={styles.storeCardTitle}>Büyük Paket</Text>
                <Text style={styles.storeCardDescription}>1500 coin</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.storeBuyButton}
              onPress={() => {
                onTriggerHaptic('medium');
                onPurchase(IAP_PRODUCT_IDS.coinPackLarge);
              }}
              disabled={iapLoading}
            >
              {iapLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.storeBuyButtonText}>$9.99</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Satın Almaları Geri Yükle */}
          <TouchableOpacity
            style={styles.restorePurchasesButton}
            onPress={() => {
              onTriggerHaptic('light');
              onRestorePurchases();
            }}
            disabled={iapLoading}
          >
            <Text style={styles.restorePurchasesText}>
              🔄 Satın Almaları Geri Yükle
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Mağaza Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={shopPurchasePopup.visible}
        onRequestClose={onCloseShopPopup}
      >
        <View style={styles.popupOverlay}>
          <View style={[styles.popupContainer, { backgroundColor: currentTheme.accentColor }]}>
            <Text style={styles.popupIcon}>✅</Text>
            <Text style={[styles.popupMessage, { color: currentTheme.scoreColor }]}>
              {shopPurchasePopup.message}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  storeContainer: {
    flex: 1,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C4E',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  coinIndicatorSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  coinIconSmall: {
    fontSize: 16,
    marginRight: 4,
  },
  coinTextSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  storeList: {
    flex: 1,
    padding: 20,
  },
  storeSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 15,
  },
  storeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  storeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeCardIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  storeCardInfo: {
    flex: 1,
  },
  storeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  storeCardDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  storeWatchAdButton: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  storeWatchAdButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  storeBuyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    minWidth: 70,
    alignItems: 'center',
  },
  storeBuyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storePurchasedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  storePurchasedText: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restorePurchasesButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  restorePurchasesText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 200,
  },
  popupIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  popupMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StoreScreen;
