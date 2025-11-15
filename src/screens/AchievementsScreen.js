import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ACHIEVEMENTS_LIST } from '../constants/achievements';

/**
 * AchievementsScreen - Başarımlar ekranı
 */
const AchievementsScreen = ({
  // State
  achievements,

  // Handlers
  onNavigateMenu,
  onTriggerHaptic,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.achievementsContainer}>
        <View style={styles.achievementsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              onTriggerHaptic('light');
              onNavigateMenu();
            }}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.achievementsTitle}>🏆 Başarımlar</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.achievementsList} showsVerticalScrollIndicator={false}>
          {ACHIEVEMENTS_LIST.map((achievement) => {
            const state = achievements[achievement.id] || { unlocked: false, progress: 0 };
            const percentage = Math.min(100, (state.progress / achievement.requirement) * 100);

            return (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  state.unlocked && styles.achievementCardUnlocked
                ]}
              >
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementIconText}>
                    {state.unlocked ? achievement.title.split(' ')[0] : '🔒'}
                  </Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    !state.unlocked && styles.achievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  {!state.unlocked && (
                    <View style={styles.achievementProgress}>
                      <View style={styles.achievementProgressBar}>
                        <View
                          style={[
                            styles.achievementProgressFill,
                            { width: `${percentage}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.achievementProgressText}>
                        {state.progress} / {achievement.requirement}
                      </Text>
                    </View>
                  )}
                  {state.unlocked && (
                    <Text style={styles.achievementUnlockedText}>✓ Tamamlandı</Text>
                  )}
                </View>
              </View>
            );
          })}
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
  achievementsContainer: {
    flex: 1,
  },
  achievementsHeader: {
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
  achievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  achievementsList: {
    flex: 1,
    padding: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  achievementCardUnlocked: {
    borderColor: '#FFCC00',
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#aaa',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  achievementProgress: {
    marginTop: 4,
  },
  achievementProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#aaa',
  },
  achievementUnlockedText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default AchievementsScreen;
