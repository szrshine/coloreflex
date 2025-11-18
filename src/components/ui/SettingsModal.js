import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Switch, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * SettingsModal - Ayarlar modal komponenti
 */
const SettingsModal = ({
  visible,
  soundEnabled,
  musicEnabled,
  hapticEnabled,
  highScore,
  totalGamesPlayed,
  totalScore,
  totalCorrectMatches,
  longestStreak,
  dailyLoginStreak,
  onClose,
  onSoundToggle,
  onMusicToggle,
  onHapticToggle,
  onRestartTutorial,
  onShowPrivacyPolicy,
  onShowTermsOfService,
  onOpenLink,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>⚙️ Ayarlar</Text>
            <TouchableOpacity
              style={styles.settingsCloseButton}
              onPress={onClose}
            >
              <Text style={styles.settingsCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.settingsContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🔊 Ses Efektleri</Text>
                <Text style={styles.settingDescription}>Oyun seslerini aç/kapat</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={onSoundToggle}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🎵 Müzik</Text>
                <Text style={styles.settingDescription}>Arka plan müziğini aç/kapat</Text>
              </View>
              <Switch
                value={musicEnabled}
                onValueChange={onMusicToggle}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>📳 Titreşim</Text>
                <Text style={styles.settingDescription}>Haptic feedback aç/kapat</Text>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={onHapticToggle}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={onRestartTutorial}
            >
              <Text style={styles.settingButtonText}>📖 Tutorial'ı Tekrar Göster</Text>
            </TouchableOpacity>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
              <View style={styles.settingsStats}>
                <Text style={styles.statsText}>En Yüksek Skor: {highScore}</Text>
                <Text style={styles.statsText}>Toplam Oyun: {totalGamesPlayed}</Text>
                <Text style={styles.statsText}>Toplam Puan: {totalScore}</Text>
                <Text style={styles.statsText}>Doğru Eşleşme: {totalCorrectMatches}</Text>
                <Text style={styles.statsText}>En Uzun Seri: {longestStreak}</Text>
                <Text style={styles.statsText}>Günlük Giriş Serisi: {dailyLoginStreak} gün</Text>
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>📜 Yasal</Text>
              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => {
                  onClose();
                  onShowPrivacyPolicy();
                }}
              >
                <Text style={styles.settingButtonText}>🔒 Gizlilik Politikası</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => {
                  onClose();
                  onShowTermsOfService();
                }}
              >
                <Text style={styles.settingButtonText}>📋 Kullanım Şartları</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => onOpenLink('mailto:support@szrgame.com')}
              >
                <Text style={styles.settingButtonText}>📧 İletişim</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>ℹ️ Hakkında</Text>
              <View style={styles.aboutSection}>
                <Text style={styles.aboutText}>coloreflex v1.0.0</Text>
                <Text style={styles.aboutText}>SZR Game Studios</Text>
                <Text style={styles.aboutTextSmall}>Renkli topları eşleştir, rekoru kır!</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C4E',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3C3C4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCloseText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsContent: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  settingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  settingsStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
  },
  statsText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  aboutSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aboutTextSmall: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SettingsModal;
