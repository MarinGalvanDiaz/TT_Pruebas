import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/spacing';

interface TopAppBarProps {
  title?: string;
  onContactPress?: () => void;
  onSharePress?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Libérate',
  onContactPress,
  onSharePress,
}) => {
  const handleContact = () => {
    if (onContactPress) {
      onContactPress();
    } else {
      Linking.openURL('mailto:contacto@liberate.org?subject=Consulta%20Libérate');
    }
  };

  const handleShare = async () => {
    if (onSharePress) {
      onSharePress();
    } else {
      try {
        if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({
            title: 'Libérate - Tu espacio seguro',
            text: 'Descubre Libérate: Tu espacio seguro para sentirte mejor.',
            url: window.location.href,
          });
        } else {
          await Share.share({
            message: 'Descubre Libérate: Tu espacio seguro para sentirte mejor. https://liberate.org',
            title: 'Libérate',
          });
        }
      } catch (err) {
        console.log('Share action cancelled or unavailable');
      }
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <View style={styles.brandDot} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleContact}
          accessibilityLabel="Contacto"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="mail-outline" size={22} color={Colors.onSurface} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleShare}
          accessibilityLabel="Compartir"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="share" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: Colors.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    zIndex: 50,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
  },
});

