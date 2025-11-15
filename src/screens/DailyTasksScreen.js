import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * DailyTasksScreen - Günlük görevler ekranı
 */
const DailyTasksScreen = ({
  // State
  dailyLoginStreak,
  dailyTasks,

  // Handlers
  onNavigateMenu,
  onTriggerHaptic,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.dailyTasksContainer}>
        <View style={styles.dailyTasksHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              onTriggerHaptic('light');
              onNavigateMenu();
            }}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.dailyTasksTitle}>📋 Günlük Görevler</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.dailyStreakCard}>
          <Text style={styles.dailyStreakTitle}>🔥 Günlük Giriş Serisi</Text>
          <Text style={styles.dailyStreakValue}>{dailyLoginStreak} Gün</Text>
          <Text style={styles.dailyStreakDescription}>
            Her gün giriş yaparak serinizi artırın!
          </Text>
        </View>

        <ScrollView style={styles.dailyTasksList} showsVerticalScrollIndicator={false}>
          <Text style={styles.tasksHeader}>Bugünün Görevleri</Text>
          {dailyTasks.length === 0 ? (
            <View style={styles.noTasksCard}>
              <Text style={styles.noTasksText}>Henüz görev yok</Text>
              <Text style={styles.noTasksDescription}>Yarın yeni görevler gelecek!</Text>
            </View>
          ) : (
            dailyTasks.map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  task.completed && styles.taskCardCompleted
                ]}
              >
                <View style={styles.taskIcon}>
                  <Text style={styles.taskIconText}>
                    {task.completed ? '✓' : '○'}
                  </Text>
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted
                  ]}>
                    {task.title}
                  </Text>
                  <View style={styles.taskProgress}>
                    <View style={styles.taskProgressBar}>
                      <View
                        style={[
                          styles.taskProgressFill,
                          { width: `${Math.min(100, (task.progress / task.target) * 100)}%` }
                        ]}
                      />
                    </View>
                    <Text style={styles.taskProgressText}>
                      {task.progress} / {task.target}
                    </Text>
                  </View>
                </View>
              </View>
            ))
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
  dailyTasksContainer: {
    flex: 1,
  },
  dailyTasksHeader: {
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
  dailyTasksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dailyStreakCard: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  dailyStreakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
  },
  dailyStreakValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
  },
  dailyStreakDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  dailyTasksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tasksHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  noTasksCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 8,
  },
  noTasksDescription: {
    fontSize: 14,
    color: '#777',
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  taskCardCompleted: {
    borderColor: '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskProgress: {
    marginTop: 4,
  },
  taskProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  taskProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  taskProgressText: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default DailyTasksScreen;
