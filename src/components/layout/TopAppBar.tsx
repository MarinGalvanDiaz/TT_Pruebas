import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

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
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleContact}
        accessibilityLabel="Contacto"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons name="mail" size={22} color={Colors.onTertiaryContainer} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleShare}
        accessibilityLabel="Compartir"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons name="share" size={22} color={Colors.onTertiaryContainer} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: Colors.tertiaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    zIndex: 50,
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.onTertiaryContainer,
    fontWeight: '700',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
