import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AdMobBanner, BannerAdSize, AD_UNIT_IDS } from '../../monetization';
import { COLORS } from '../constants/colors';
import { POWERUPS } from '../constants/powerups';
import Ball from '../components/game/Ball';
import Particle from '../components/game/Particle';

const { height } = Dimensions.get('window');

/**
 * GameScreen - Ana oyun ekranı
 */
const GameScreen = ({
  // State
  score,
  highScore,
  balls,
  particles,
  countdown,
  adsRemoved,
  currentTheme,
  powerupInventory,
  activePowerup,
  shieldActive,
  powerupPurchasePopup,

  // Handlers
  onOpenSettings,
  onUsePowerup,
  onDirectBall,
  onBoxLayout,
  onClosePowerupPopup,

  // Functions
  getCurrentSkinColors,

  // Components
  SettingsModal,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar style="light" />

      {/* Ayarlar Modal */}
      {SettingsModal}

      {/* Skor göstergesi */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreItemsContainer}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: currentTheme.scoreColor }]}>SKOR</Text>
            <Text style={[styles.scoreValue, { color: currentTheme.accentColor }]}>{score}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: currentTheme.scoreColor }]}>REKOR</Text>
            <Text style={[styles.scoreValue, { color: currentTheme.accentColor }]}>{highScore}</Text>
          </View>
        </View>

        {/* Ayarlar butonu - oyun ekranında */}
        <TouchableOpacity
          style={styles.gameSettingsButton}
          onPress={onOpenSettings}
        >
          <Text style={styles.gameSettingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Power-up butonları */}
      <View style={styles.powerupButtonsContainer}>
        {POWERUPS.map((powerup) => {
          const inventory = powerupInventory[powerup.id] || 0;
          // Shield için activePowerup kontrolü yapma, diğerleri için yap
          const isDisabled = inventory === 0 ||
            (powerup.effect !== 'shield' && activePowerup !== null);

          return (
            <TouchableOpacity
              key={powerup.id}
              style={[
                styles.powerupGameButton,
                { backgroundColor: isDisabled ? currentTheme.boxBackground : currentTheme.accentColor },
                isDisabled && styles.powerupGameButtonDisabled
              ]}
              onPress={() => onUsePowerup(powerup.id)}
              disabled={isDisabled}
            >
              <Text style={styles.powerupGameEmoji}>{powerup.emoji}</Text>
              <Text style={[styles.powerupGameCount, { color: currentTheme.scoreColor }]}>{inventory}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Oyun alanı */}
      <View style={[styles.gameArea, { backgroundColor: currentTheme.background }]}>
        {balls.map((ball) => (
          <Ball key={ball.id} ball={ball} />
        ))}
        {particles.map((particle) => (
          <Particle key={particle.id} particle={particle} />
        ))}

        {/* Countdown overlay */}
        {countdown > 0 && (
          <View style={styles.countdownOverlay}>
            <Text style={[styles.countdownText, { color: currentTheme.accentColor }]}>{countdown}</Text>
            <Text style={[styles.countdownSubtext, { color: currentTheme.scoreColor }]}>Hazırlan!</Text>
          </View>
        )}
      </View>

      {/* Banner Reklam - En altta, sadece reklamsız değilse göster */}
      {!adsRemoved && (
        <View style={styles.bannerAdContainer}>
          <AdMobBanner
            unitId={AD_UNIT_IDS.banner}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}

      {/* Renkli kutular - Banner varsa onun üzerinde, yoksa en altta */}
      <View
        style={[
          styles.boxContainer,
          !adsRemoved && styles.boxContainerAboveBanner,
          { backgroundColor: currentTheme.boxBackground }
        ]}
        onLayout={onBoxLayout}
      >
        {COLORS.map((color, index) => {
          // Seçili skin'in renklerini al
          const skinColors = getCurrentSkinColors();
          const boxColor = skinColors[index % skinColors.length];

          return (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorBox,
                {
                  backgroundColor: boxColor,
                  borderWidth: 2,
                  borderColor: currentTheme.boxBorder
                }
              ]}
              activeOpacity={0.7}
              onPress={() => {
                const closestBall = balls
                  .filter((b) => !b.isDirected && b.y > 0 && b.y < height - 150)
                  .sort((a, b) => b.y - a.y)[0];

                if (closestBall) {
                  onDirectBall(closestBall.id, color.id, index);
                }
              }}
            >
            </TouchableOpacity>
          );
        })}
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

      {/* Şeffaf Overlay - Power-up Göstergeleri için */}
      {(activePowerup || shieldActive) && (
        <View style={styles.powerupIndicatorOverlay} pointerEvents="none">
          <View style={styles.powerupIndicatorContainer}>
            {activePowerup && (
              <View style={[styles.powerupIndicator, { backgroundColor: currentTheme.accentColor }]}>
                <Text style={[styles.powerupIndicatorText, { color: currentTheme.scoreColor }]}>
                  {POWERUPS.find(p => p.effect === activePowerup)?.emoji} AKTİF
                </Text>
              </View>
            )}
            {shieldActive && (
              <View style={[styles.powerupIndicator, { backgroundColor: currentTheme.accentColor }]}>
                <Text style={[styles.powerupIndicatorText, { color: currentTheme.scoreColor }]}>🛡️ Kalkan Aktif</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoreBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 95,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 45,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  scoreItemsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  scoreItem: {
    marginRight: 30,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameSettingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameSettingsIcon: {
    fontSize: 20,
  },
  powerupButtonsContainer: {
    position: 'absolute',
    top: 95,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  },
  powerupGameButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 3,
  },
  powerupGameButtonDisabled: {
    opacity: 0.5,
  },
  powerupGameEmoji: {
    fontSize: 24,
  },
  powerupGameCount: {
    fontSize: 10,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 2,
    right: 5,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
  },
  countdownSubtext: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  bannerAdContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  boxContainerAboveBanner: {
    bottom: 60,
  },
  colorBox: {
    width: 70,
    height: 70,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  powerupIndicatorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 5,
  },
  powerupIndicatorContainer: {
    marginTop: 160,
    alignItems: 'center',
  },
  powerupIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 5,
  },
  powerupIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
