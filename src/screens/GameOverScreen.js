import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { shareScore } from '../services/sharing';

/**
 * GameOverScreen - Oyun bitti ekranı
 */
const GameOverScreen = ({
  // State
  score,
  highScore,
  sessionAchievements,
  continueUsesToday,
  isRewardedAdReady,

  // Handlers
  onStartGame,
  onNavigateMenu,
  onContinueWithAd,
  onTriggerHaptic,

  // Components
  SettingsModal,
}) => {
  // Paylaşma fonksiyonu
  const handleShare = async () => {
    try {
      onTriggerHaptic('light');
      const result = await shareScore(score, highScore);
      if (result.success) {
        onTriggerHaptic('success');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Ayarlar Modal */}
      {SettingsModal}

      <ScrollView
        style={styles.gameOverScrollView}
        contentContainerStyle={styles.gameOverScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Oyun Bitti!</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.finalScoreLabel}>Skorun</Text>
            <Text style={styles.finalScoreValue}>{score}</Text>

            {score >= highScore && score > 0 && (
              <Text style={styles.newRecordText}>🎉 YENİ REKOR!</Text>
            )}

            <View style={styles.divider} />

            <Text style={styles.bestScoreLabel}>En İyi Skorun</Text>
            <Text style={styles.bestScoreValue}>{highScore}</Text>
          </View>

          {/* Coin kazanma bilgisi */}
          <View style={styles.coinEarnedInfo}>
            <Text style={styles.coinEarnedText}>💰 +{score} coin kazandınız!</Text>
          </View>

          {/* Kazanılan Başarımlar */}
          {sessionAchievements.length > 0 && (
            <View style={styles.achievementsEarnedContainer}>
              <Text style={styles.achievementsEarnedTitle}>🏆 Kazanılan Başarımlar</Text>
              {sessionAchievements.map((achievement, index) => (
                <View key={`${achievement.id}-${index}`} style={styles.achievementEarnedItem}>
                  <Text style={styles.achievementEarnedIcon}>{achievement.title.split(' ')[0]}</Text>
                  <View style={styles.achievementEarnedInfo}>
                    <Text style={styles.achievementEarnedTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementEarnedDesc}>{achievement.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Rewarded Video - Devam Et */}
          {continueUsesToday < 3 && isRewardedAdReady() && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onContinueWithAd}
            >
              <Text style={styles.continueButtonText}>📺 Reklam İzle ve Devam Et</Text>
              <Text style={styles.continueButtonSubtext}>({3 - continueUsesToday} hak kaldı)</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.restartButton} onPress={onStartGame}>
            <Text style={styles.restartButtonText}>🔄 Tekrar Oyna</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>📤 Skorumu Paylaş</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              onTriggerHaptic('light');
              onNavigateMenu();
            }}
          >
            <Text style={styles.menuButtonText}>Ana Menü</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gameOverScrollView: {
    flex: 1,
  },
  gameOverScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 30,
    textShadowColor: 'rgba(255, 59, 48, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  finalScoreLabel: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 5,
  },
  finalScoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 10,
  },
  newRecordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  bestScoreLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  bestScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  coinEarnedInfo: {
    backgroundColor: 'rgba(255, 204, 0, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  coinEarnedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  achievementsEarnedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
  },
  achievementsEarnedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 10,
    textAlign: 'center',
  },
  achievementEarnedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  achievementEarnedIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  achievementEarnedInfo: {
    flex: 1,
  },
  achievementEarnedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  achievementEarnedDesc: {
    fontSize: 12,
    color: '#aaa',
  },
  continueButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.8,
  },
  restartButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GameOverScreen;
