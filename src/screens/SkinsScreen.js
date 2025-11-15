import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SKINS } from '../constants/skins';

const { width } = Dimensions.get('window');

/**
 * SkinsScreen - Skin seçimi ekranı
 */
const SkinsScreen = ({
  // State
  coins,
  ownedSkins,
  selectedSkin,
  premiumSkinsOwned,

  // Handlers
  onNavigateMenu,
  onSelectSkin,
  onBuySkin,
  onNavigateStore,
  onTriggerHaptic,
  onPlaySound,

  // Refs
  clickSound,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.skinContainer}>
        <View style={styles.skinHeader}>
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
          <Text style={styles.skinTitle}>🎨 Skinler</Text>
          <View style={styles.coinIndicatorSmall}>
            <Text style={styles.coinIcon}>💰</Text>
            <Text style={styles.coinTextSmall}>{coins}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.skinScrollView}
          contentContainerStyle={styles.skinScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SKINS.map((skin) => {
            const isOwned = ownedSkins.includes(skin.id);
            const isSelected = selectedSkin === skin.id;
            const isLocked = !isOwned;
            const isPremiumLocked = skin.isPremium && !premiumSkinsOwned && !isOwned;

            return (
              <View key={skin.id} style={styles.skinCard}>
                <View style={styles.skinCardLeft}>
                  <Text style={styles.skinEmoji}>{skin.emoji}</Text>
                  <View style={styles.skinInfo}>
                    <Text style={styles.skinName}>{skin.name}</Text>
                    <View style={styles.skinPreview}>
                      {skin.colors.slice(0, 4).map((color, index) => (
                        <View
                          key={index}
                          style={[styles.colorDot, { backgroundColor: color }]}
                        />
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.skinCardRight}>
                  {isSelected ? (
                    <View style={styles.skinSelectedBadge}>
                      <Text style={styles.skinSelectedText}>✓ Kullanılıyor</Text>
                    </View>
                  ) : isOwned ? (
                    <TouchableOpacity
                      style={styles.skinSelectButton}
                      onPress={() => onSelectSkin(skin.id)}
                    >
                      <Text style={styles.skinSelectText}>Kullan</Text>
                    </TouchableOpacity>
                  ) : isPremiumLocked ? (
                    <View style={styles.skinLockedBadge}>
                      <Text style={styles.skinLockedText}>🔒 Premium</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.skinBuyButton}
                      onPress={() => onBuySkin(skin.id)}
                    >
                      <Text style={styles.skinBuyText}>{skin.coinPrice} 💰</Text>
                      <Text style={styles.skinBuyLabel}>Satın Al</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {!premiumSkinsOwned && (
            <View style={styles.premiumPromoBanner}>
              <Text style={styles.premiumPromoTitle}>🌟 Premium Skin Paketi</Text>
              <Text style={styles.premiumPromoText}>
                Tüm premium skinleri aç!
              </Text>
              <TouchableOpacity
                style={styles.premiumPromoButton}
                onPress={onNavigateStore}
              >
                <Text style={styles.premiumPromoButtonText}>Mağazaya Git</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  skinContainer: {
    flex: 1,
  },
  skinHeader: {
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
  skinTitle: {
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
  skinScrollView: {
    flex: 1,
  },
  skinScrollContent: {
    padding: 20,
  },
  skinCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  skinCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skinEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  skinInfo: {
    flex: 1,
  },
  skinName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  skinPreview: {
    flexDirection: 'row',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  skinCardRight: {
    marginLeft: 10,
  },
  skinSelectedBadge: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  skinSelectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skinSelectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  skinSelectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skinLockedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  skinLockedText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skinBuyButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  skinBuyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skinBuyLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
  },
  premiumPromoBanner: {
    backgroundColor: 'rgba(255, 204, 0, 0.15)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  premiumPromoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 8,
  },
  premiumPromoText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  premiumPromoButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  premiumPromoButtonText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SkinsScreen;
