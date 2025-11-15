import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { height } = Dimensions.get('window');

/**
 * TutorialScreen - Tutorial ekranı
 */
const TutorialScreen = ({
  // State
  tutorialStep,

  // Handlers
  onCompleteTutorial,
  onNextStep,
  onTriggerHaptic,
}) => {
  const tutorialSteps = [
    {
      title: '🎨 Hoş Geldin!',
      description: 'ColorDrop\'a hoş geldin! Renkli topları doğru kutuyla eşleştireceğin eğlenceli bir oyun.',
    },
    {
      title: '🎯 Nasıl Oynanır?',
      description: 'Toplar yukarıdan düşer. Bir kutuya dokunarak en alttaki topu o kutuya yönlendir.',
    },
    {
      title: '✅ Doğru Eşleştir',
      description: 'Top ile kutu rengi aynı olmalı! Her doğru eşleşme 1 puan kazandırır ve oyun hızlanır.',
    },
    {
      title: '❌ Dikkat Et!',
      description: 'Yanlış renk seçersen veya bir topu kaçırırsan oyun biter. Yüksek skor için dikkatli ol!',
    },
  ];

  const currentStep = tutorialSteps[tutorialStep];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.tutorialContainer}>
        <View style={styles.tutorialContent}>
          <Text style={styles.tutorialEmoji}>
            {tutorialStep === 0 && '🎨'}
            {tutorialStep === 1 && '🎯'}
            {tutorialStep === 2 && '✅'}
            {tutorialStep === 3 && '❌'}
          </Text>
          <Text style={styles.tutorialTitle}>{currentStep.title}</Text>
          <Text style={styles.tutorialDescription}>{currentStep.description}</Text>

          <View style={styles.tutorialIndicators}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.tutorialIndicator,
                  index === tutorialStep && styles.tutorialIndicatorActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.tutorialButtons}>
          {tutorialStep < tutorialSteps.length - 1 ? (
            <>
              <TouchableOpacity
                style={styles.tutorialSkipButton}
                onPress={onCompleteTutorial}
              >
                <Text style={styles.tutorialSkipText}>Atla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tutorialNextButton}
                onPress={() => {
                  onTriggerHaptic('light');
                  onNextStep();
                }}
              >
                <Text style={styles.tutorialNextText}>İleri</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.tutorialStartButton}
              onPress={onCompleteTutorial}
            >
              <Text style={styles.tutorialStartText}>Başla!</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  tutorialContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
    paddingTop: 80,
    paddingBottom: 50,
  },
  tutorialContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  tutorialTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  tutorialDescription: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  tutorialIndicators: {
    flexDirection: 'row',
    marginTop: 40,
  },
  tutorialIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  tutorialIndicatorActive: {
    backgroundColor: '#FF3B30',
    width: 30,
  },
  tutorialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tutorialSkipButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    alignItems: 'center',
  },
  tutorialSkipText: {
    color: '#aaa',
    fontSize: 16,
  },
  tutorialNextButton: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    alignItems: 'center',
  },
  tutorialNextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tutorialStartButton: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: '#34C759',
    borderRadius: 25,
    alignItems: 'center',
  },
  tutorialStartText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TutorialScreen;
