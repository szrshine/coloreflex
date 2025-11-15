import React, { memo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { BALL_SIZE } from '../../constants/gameConfig';

/**
 * Ball komponenti - Düşen top
 * React.memo ile optimize edilmiş
 */
const Ball = ({ ball }) => {
  return (
    <Animated.View
      style={[
        styles.ball,
        {
          backgroundColor: ball.color,
          left: ball.x,
          top: ball.y,
          opacity: ball.fadeAnim,
          transform: [{ scale: ball.scaleAnim }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default memo(Ball);
