import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

export const AppDownloadBanner: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleStorePress = (store: 'App Store' | 'Google Play') => {
    if (Platform.OS === 'web') {
      window.alert(`Pronto podrás descargar Libérate directamente desde ${store}.`);
    } else {
      Alert.alert(store, `Pronto podrás descargar Libérate directamente desde ${store}.`);
    }
  };

  return (
    <View style={[styles.container, Shadows.soft, isDesktop && styles.desktopContainer]}>
      <View style={styles.textContainer}>
        <View style={styles.badgeIndicator}>
          <MaterialIcons name="phone-iphone" size={20} color={Colors.secondary} />
          <Text style={styles.badgeText}>Móvil y Web</Text>
        </View>
        <Text style={styles.title}>Libérate también está disponible como app</Text>
        <Text style={styles.subtitle}>
          Lleva tus herramientas de bienestar y ejercicios contigo en todo momento.
        </Text>
      </View>

      <View style={[styles.buttonsRow, isDesktop && styles.desktopButtonsRow]}>
        {/* App Store Button */}
        <TouchableOpacity
          style={[styles.storeButton, Shadows.soft]}
          onPress={() => handleStorePress('App Store')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="apple" size={28} color="#ffffff" />
          <View style={styles.storeBtnTextWrapper}>
            <Text style={styles.storeSmallText}>Disponible en el</Text>
            <Text style={styles.storeBigText}>App Store</Text>
          </View>
        </TouchableOpacity>

        {/* Google Play Button */}
        <TouchableOpacity
          style={[styles.storeButton, Shadows.soft]}
          onPress={() => handleStorePress('Google Play')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="shop" size={26} color="#ffffff" />
          <View style={styles.storeBtnTextWrapper}>
            <Text style={styles.storeSmallText}>DISPONIBLE EN</Text>
            <Text style={styles.storeBigText}>Google Play</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    alignItems: 'center',
  },
  desktopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 28,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: 8,
  },
  badgeText: {
    ...Typography.labelSmBold,
    color: Colors.onSecondaryContainer,
    fontSize: 11,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    fontSize: 13,
    maxWidth: 420,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  desktopButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1c1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    gap: 10,
    minWidth: 150,
  },
  storeBtnTextWrapper: {
    flexDirection: 'column',
  },
  storeSmallText: {
    color: '#eae8e4',
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  storeBigText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
