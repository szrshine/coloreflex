import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { POWERUPS } from '../constants/powerups';

/**
 * PowerupsScreen - Power-up satın alma ekranı
 */
const PowerupsScreen = ({
  // State
  coins,
  powerupInventory,
  currentTheme,
  powerupPurchasePopup,

  // Handlers
  onNavigateMenu,
  onBuyPowerup,
  onNavigateStore,
  onClosePowerupPopup,
  onTriggerHaptic,
  onPlaySound,

  // Refs
  clickSound,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.powerupContainer}>
        <View style={styles.powerupHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              onTriggerHaptic('light');
              onPlaySound(clickSound);
              onNavigateMenu();
            }}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.powerupTitle}>⚡ Power-Ups</Text>
          <View style={styles.coinIndicatorSmall}>
            <Text style={styles.coinIcon}>💰</Text>
            <Text style={styles.coinTextSmall}>{coins}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.powerupScrollView}
          contentContainerStyle={styles.powerupScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {POWERUPS.map((powerup) => {
            const inventory = powerupInventory[powerup.id] || 0;

            return (
              <View key={powerup.id} style={styles.powerupCard}>
                <View style={styles.powerupCardLeft}>
                  <Text style={styles.powerupEmoji}>{powerup.emoji}</Text>
                  <View style={styles.powerupInfo}>
                    <Text style={styles.powerupName}>{powerup.name}</Text>
                    <Text style={styles.powerupDescription}>{powerup.description}</Text>
                    <Text style={styles.powerupInventory}>
                      Envanter: {inventory} adet
                    </Text>
                  </View>
                </View>

                <View style={styles.powerupCardRight}>
                  <TouchableOpacity
                    style={styles.powerupBuyButton}
                    onPress={() => onBuyPowerup(powerup.id)}
                  >
                    <Text style={styles.powerupBuyPrice}>{powerup.coinPrice} 💰</Text>
                    <Text style={styles.powerupBuyLabel}>Satın Al</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <View style={styles.powerupPromoBanner}>
            <Text style={styles.powerupPromoTitle}>⚡ Power-Up Paketi</Text>
            <Text style={styles.powerupPromoText}>
              5 Yavaş Çekim + 5 Kalkan + 5 Dondur
            </Text>
            <TouchableOpacity
              style={styles.powerupPromoButton}
              onPress={onNavigateStore}
            >
              <Text style={styles.powerupPromoButtonText}>Mağazaya Git</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.powerupGuideContainer}>
            <Text style={styles.powerupGuideTitle}>📖 Nasıl Kullanılır?</Text>
            <Text style={styles.powerupGuideText}>
              • Power-up'ları satın aldıktan sonra oyun ekranında kullanabilirsiniz
            </Text>
            <Text style={styles.powerupGuideText}>
              • Oyun sırasında üstte bulunan power-up butonlarına basın
            </Text>
            <Text style={styles.powerupGuideText}>
              • Her power-up tek kullanımlıktır, dikkatli kullanın!
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Power-up Satın Alma Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={powerupPurchasePopup.visible}
        onRequestClose={onClosePowerupPopup}
      >
        <View style={styles.popupOverlay}>
          <View style={[styles.popupContainer, { backgroundColor: currentTheme.accentColor }]}>
            <Text style={styles.popupIcon}>✅</Text>
            <Text style={[styles.popupMessage, { color: currentTheme.scoreColor }]}>
              {powerupPurchasePopup.message}
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
  powerupContainer: {
    flex: 1,
  },
  powerupHeader: {
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
  powerupTitle: {
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
  coinIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  coinTextSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  powerupScrollView: {
    flex: 1,
  },
  powerupScrollContent: {
    padding: 20,
  },
  powerupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  powerupCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  powerupEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  powerupInfo: {
    flex: 1,
  },
  powerupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  powerupDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 6,
  },
  powerupInventory: {
    fontSize: 12,
    color: '#FFCC00',
    fontWeight: 'bold',
  },
  powerupCardRight: {
    marginLeft: 10,
  },
  powerupBuyButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
  },
  powerupBuyPrice: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  powerupBuyLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
  },
  powerupPromoBanner: {
    backgroundColor: 'rgba(255, 204, 0, 0.15)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  powerupPromoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 8,
  },
  powerupPromoText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  powerupPromoButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  powerupPromoButtonText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  powerupGuideContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  powerupGuideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  powerupGuideText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
    marginBottom: 6,
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

export default PowerupsScreen;
