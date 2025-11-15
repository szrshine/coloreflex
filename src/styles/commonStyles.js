import { StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius, shadows, dimensions } from './theme';

/**
 * Common Styles - Ortak kullanılan stil bileşenleri
 */

export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },

  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },

  // Button styles
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  backButtonText: {
    color: colors.secondary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: dimensions.playButtonPaddingX,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.base,
    alignItems: 'center',
    ...shadows.playButton,
  },

  primaryButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.responsivePlayButton,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: colors.background.cardHighlight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.responsiveMenuButton,
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.5,
  },

  // Card styles
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    marginBottom: spacing.base,
  },

  cardHighlight: {
    backgroundColor: colors.background.cardHighlight,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    marginBottom: spacing.base,
  },

  // Coin indicator styles
  coinIndicator: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.input,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    zIndex: 100,
  },

  coinIndicatorSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.input,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.base,
  },

  coinIcon: {
    fontSize: fontSize.xl,
    marginRight: 5,
  },

  coinIconSmall: {
    fontSize: fontSize.md,
    marginRight: 4,
  },

  coinText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.coin,
  },

  coinTextSmall: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.coin,
  },

  // Settings button
  settingsIconButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.input,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  settingsIcon: {
    fontSize: fontSize.xxl,
  },

  // Text styles
  title: {
    fontSize: fontSize.responsiveTitle,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
    ...shadows.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: fontSize.responsiveSubtitle,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.base,
  },

  description: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  // Score styles
  scoreCard: {
    backgroundColor: colors.background.cardHighlight,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },

  scoreLabel: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginBottom: 5,
  },

  scoreValue: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    color: colors.coin,
    marginBottom: spacing.sm,
  },

  // Divider
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border.secondary,
    marginVertical: spacing.lg,
  },

  // Modal/Popup styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  modalContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },

  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },

  modalContent: {
    padding: spacing.lg,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },

  // Popup styles
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  popupContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 200,
  },

  popupIcon: {
    fontSize: fontSize.huge,
    marginBottom: spacing.sm,
  },

  popupMessage: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // ScrollView styles
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
  },

  scrollViewContentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },

  // Badge styles
  badge: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.base,
  },

  badgeSuccess: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },

  badgeWarning: {
    backgroundColor: 'rgba(255, 204, 0, 0.15)',
  },

  badgeDanger: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },

  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },

  // Progress bar styles
  progressBar: {
    height: 8,
    backgroundColor: colors.background.cardHighlight,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: 4,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
  },

  progressBarText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },

  // Icon styles
  iconLarge: {
    fontSize: fontSize.xxxl,
    marginBottom: spacing.lg,
  },

  iconMedium: {
    fontSize: fontSize.xxl,
  },

  iconSmall: {
    fontSize: fontSize.md,
  },
});

export default commonStyles;
