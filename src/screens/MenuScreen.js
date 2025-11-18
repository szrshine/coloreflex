import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { privacyPolicyText, termsOfServiceText } from '../constants/legalText';

const { width } = Dimensions.get('window');

/**
 * MenuScreen - Ana menü ekranı
 */
const MenuScreen = ({
  // State
  coins,
  highScore,
  modalVisible,
  modalTitle,
  modalContent,

  // Handlers
  onStartGame,
  onNavigate,
  onOpenSettings,
  onShowPrivacyPolicy,
  onShowTermsOfService,
  onOpenLink,
  onCloseModal,
  onTriggerHaptic,
  onPlaySound,

  // Refs
  clickSound,

  // Components
  SettingsModal,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Coin göstergesi - sol üst köşe */}
      <View style={styles.coinIndicator}>
        <Text style={styles.coinIcon}>💰</Text>
        <Text style={styles.coinText}>{coins}</Text>
      </View>

      {/* Ayarlar butonu - sağ üst köşe */}
      <TouchableOpacity
        style={styles.settingsIconButton}
        onPress={onOpenSettings}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.menuScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          <Text style={styles.title}>🎨 coloreflex</Text>
          <Text style={styles.subtitle}>Topları doğru renge yönlendir!</Text>

          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreLabel}>En Yüksek Skor</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={onStartGame}>
            <Text style={styles.playButtonText}>OYNA</Text>
          </TouchableOpacity>

          <View style={styles.menuButtons}>
            <TouchableOpacity
              style={styles.menuSecondaryButton}
              onPress={() => {
                onTriggerHaptic('light');
                onPlaySound(clickSound);
                onNavigate('skins');
              }}
            >
              <Text style={styles.menuSecondaryButtonText}>🎨 Skinler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSecondaryButton}
              onPress={() => {
                onTriggerHaptic('light');
                onPlaySound(clickSound);
                onNavigate('powerups');
              }}
            >
              <Text style={styles.menuSecondaryButtonText}>⚡ Power-Ups</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSecondaryButton}
              onPress={() => {
                onTriggerHaptic('light');
                onNavigate('achievements');
              }}
            >
              <Text style={styles.menuSecondaryButtonText}>🏆 Başarımlar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSecondaryButton}
              onPress={() => {
                onTriggerHaptic('light');
                onNavigate('leaderboard');
              }}
            >
              <Text style={styles.menuSecondaryButtonText}>🎖️ Liderlik Tablosu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSecondaryButton}
              onPress={() => {
                onTriggerHaptic('light');
                onNavigate('dailyTasks');
              }}
            >
              <Text style={styles.menuSecondaryButtonText}>📋 Günlük Görevler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSecondaryButton}
              onPress={() => {
                onTriggerHaptic('light');
                onNavigate('store');
              }}
            >
              <Text style={styles.menuSecondaryButtonText}>🛒 Mağaza</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>📌 Nasıl Oynanır:</Text>
            <Text style={styles.instructionDetail}>• Toplar yukarıdan düşer</Text>
            <Text style={styles.instructionDetail}>• Ekrana dokun ve topu doğru kutuya yönlendir</Text>
            <Text style={styles.instructionDetail}>• Her doğru eşleşme = 1 puan</Text>
            <Text style={styles.instructionDetail}>• Yanlış renk veya kaçırma = oyun biter</Text>
            <Text style={styles.instructionDetail}>• Hız giderek artar!</Text>
          </View>

          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={onShowPrivacyPolicy}>
              <Text style={styles.legalLinkText}>Gizlilik Politikası</Text>
            </TouchableOpacity>
            <Text style={styles.legalDivider}>•</Text>
            <TouchableOpacity onPress={onShowTermsOfService}>
              <Text style={styles.legalLinkText}>Kullanım Şartları</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.supportLink}
            onPress={() => onOpenLink('mailto:support@szrgame.com')}
          >
            <Text style={styles.supportLinkText}>📧 Destek: support@szrgame.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Ayarlar Modal */}
      {SettingsModal}

      {/* Yasal Belgeler Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={onCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onCloseModal}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {modalContent === 'privacy' ? (
              <View>
                <Text style={styles.modalText}>
                  {privacyPolicyText}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.modalText}>
                  {termsOfServiceText}
                </Text>
              </View>
            )}
          </ScrollView>
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
  menuScrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: Dimensions.get('window').height - 40,
  },
  coinIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 100,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  coinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  settingsIconButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  settingsIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: Math.min(56, width * 0.14),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(18, width * 0.045),
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  highScoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    minWidth: Math.min(200, width * 0.5),
  },
  highScoreLabel: {
    fontSize: Math.min(14, width * 0.035),
    color: '#aaa',
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: Math.min(48, width * 0.12),
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  playButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: Math.min(60, width * 0.15),
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
  },
  menuButtons: {
    width: '100%',
    maxWidth: Math.min(350, width * 0.9),
    marginBottom: 20,
  },
  menuSecondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  menuSecondaryButtonText: {
    color: '#fff',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    maxWidth: Math.min(350, width * 0.9),
    width: '100%',
  },
  instructionText: {
    fontSize: Math.min(16, width * 0.04),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionDetail: {
    fontSize: Math.min(14, width * 0.035),
    color: '#aaa',
    marginBottom: 4,
    paddingLeft: 10,
  },
  legalLinks: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  legalLinkText: {
    color: '#007AFF',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  legalDivider: {
    color: '#aaa',
    marginHorizontal: 10,
  },
  supportLink: {
    marginTop: 10,
  },
  supportLinkText: {
    color: '#aaa',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C4E',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3C3C4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default MenuScreen;
