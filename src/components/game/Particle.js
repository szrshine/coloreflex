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
  },
});

export default memo(Particle);
