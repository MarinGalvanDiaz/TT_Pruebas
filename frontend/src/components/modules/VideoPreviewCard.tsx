import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

export const VideoPreviewCard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={[styles.container, Shadows.soft, isDesktop && styles.desktopContainer]}>
      {/* Video Badge */}
      <View style={styles.badgeRow}>
        <View style={styles.videoBadge}>
          <MaterialIcons name="videocam" size={16} color={Colors.primary} />
          <Text style={styles.videoBadgeText}>Video explicativo</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.thumbnailContainer, isDesktop && styles.desktopThumbnail]}
        onPress={() => setIsPlaying(true)}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Reproducir video explicativo de Libérate"
      >
        <Image
          source={require('../../../assets/images/mascots_group_banner.png')}
          style={styles.thumbnailImage}
        />
        <View style={styles.playButtonOverlay}>
          <View style={[styles.playButton, Shadows.mascot]}>
            <MaterialIcons name="play-arrow" size={38} color="#ffffff" />
          </View>
          <Text style={styles.playText}>Ver cómo funciona Libérate</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.caption}>
        Conoce el propósito del proyecto, sus herramientas y cómo puede acompañarte día a día.
      </Text>

      {/* Video Modal / Player */}
      <Modal
        visible={isPlaying}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPlaying(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, Shadows.mascot]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <MaterialIcons name="ondemand-video" size={24} color={Colors.primary} />
                <Text style={styles.modalTitle}>¿Qué es Libérate?</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPlaying(false)}
                style={styles.closeBtn}
                accessibilityLabel="Cerrar video"
              >
                <MaterialIcons name="close" size={24} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>

            <View style={styles.videoPlaceholder}>
              <MaterialIcons name="play-circle-filled" size={72} color={Colors.primary} />
              <Text style={styles.videoPlaceholderTitle}>
                Presentación del Proyecto Libérate
              </Text>
              <Text style={styles.videoPlaceholderText}>
                Un espacio de prevención y acompañamiento socioemocional respaldado por UNAM, IPN y LABPSIIT.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsPlaying(false)}
            >
              <Text style={styles.modalCloseButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 18,
    marginVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    alignItems: 'center',
  },
  desktopContainer: {
    maxWidth: 720,
    alignSelf: 'center',
    padding: 24,
  },
  badgeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  videoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  videoBadgeText: {
    ...Typography.labelSmBold,
    color: Colors.onPrimaryContainer,
    fontSize: 12,
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopThumbnail: {
    height: 280,
  },
  thumbnailImage: {
    width: '95%',
    height: '85%',
    resizeMode: 'contain',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 28, 26, 0.4)',
    gap: 10,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  playText: {
    ...Typography.labelSmBold,
    color: '#ffffff',
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  caption: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 14,
    fontSize: 13,
    maxWidth: 480,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 18,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
  },
  videoPlaceholder: {
    height: 220,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  videoPlaceholderTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 16,
    textAlign: 'center',
  },
  videoPlaceholderText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    ...Typography.labelSmBold,
    color: Colors.onPrimary,
    fontSize: 14,
  },
});

