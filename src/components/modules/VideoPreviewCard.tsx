import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

export const VideoPreviewCard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={[styles.container, Shadows.soft]}>
      <TouchableOpacity
        style={styles.thumbnailContainer}
        onPress={() => setIsPlaying(true)}
        activeOpacity={0.9}
      >
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWDFDZ3uqksM2uMn9UuDZm_tTE3R77s1nm7tf9XxWi0HPdfFmtokCVWkKOriIXtFMM3Ko6DNnvV680uiZ0qUIqZ4ZArIhwHyhgHOfzH4XakbTEuTC1ixusoR0qpZiMrZQ4VJ7OD_DJElq56BV49vyZ-OiMvTGEQ5NIu7X3W-GpAX-yqJlUKCcnqJp98uJgb4dGGb2cS3GR6LuHfSz0NPgvmmL--Dm_iQyQq0QCgl8fWF0uyzSvGup7kQ',
          }}
          style={styles.thumbnailImage}
        />
        <View style={styles.playButtonOverlay}>
          <View style={styles.playButton}>
            <MaterialIcons name="play-arrow" size={36} color="#ffffff" />
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.caption}>Conoce cómo Libérate puede ayudarte día a día.</Text>

      {/* Video Modal / Player placeholder */}
      <Modal visible={isPlaying} transparent animationType="fade" onRequestClose={() => setIsPlaying(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bienvenido a Libérate</Text>
              <TouchableOpacity onPress={() => setIsPlaying(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>
            <View style={styles.videoPlaceholder}>
              <MaterialIcons name="ondemand-video" size={64} color={Colors.primary} />
              <Text style={styles.videoPlaceholderText}>Reproduciendo video introductorio...</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginVertical: 12,
    width: '100%',
  },
  thumbnailContainer: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.inverseSurface,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.85,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
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
    maxWidth: 500,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  closeBtn: {
    padding: 4,
  },
  videoPlaceholder: {
    height: 240,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  videoPlaceholderText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
});
