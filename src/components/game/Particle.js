import React, { memo } from 'react';
import { Animated, StyleSheet } from 'react-native';

/**
 * Particle komponenti - Patlama efekti parçacığı
 * React.memo ile optimize edilmiş
 */
const Particle = ({ particle }) => {
  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: particle.color,
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          opacity: particle.opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 1,
    elevation: 1, // Box container'ın altında
  },
});

export default memo(Particle);
