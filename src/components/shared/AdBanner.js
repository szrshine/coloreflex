import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner, BannerAdSize } from '../../monetization';

/**
 * AdBanner komponenti - Reklam banner wrapper
 */
const AdBanner = ({ adsRemoved, position = 'bottom' }) => {
  if (adsRemoved) {
    return null; // Reklamlar kaldırıldıysa gösterme
  }

  return (
    <View style={[styles.adContainer, position === 'top' && styles.adTop]}>
      <AdMobBanner
        bannerSize={BannerAdSize.BANNER}
        style={styles.adBanner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adTop: {
    bottom: 'auto',
    top: 0,
  },
  adBanner: {
    width: '100%',
  },
});

export default AdBanner;
