import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface GradientButtonProps {
  title?: string;
  label?: string;
  children?: React.ReactNode;
  onPress: () => void;
  isLoading?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  uppercase?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  label,
  children,
  onPress,
  isLoading = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  uppercase = false,
}) => {
  const displayText = title || label || '';
  const effectiveLoading = isLoading || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled || effectiveLoading}
      style={[styles.wrapper, Shadows.button, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.innerBorder}>
          {effectiveLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={[styles.text, textStyle, styles.whiteText]}>
                {displayText ? displayText : 'Cargando...'}
              </Text>
            </View>
          ) : children ? (
            children
          ) : (
            <Text style={[styles.text, textStyle, styles.whiteText]}>
              {uppercase ? displayText.toUpperCase() : displayText}
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50,
  },
  innerBorder: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    ...Typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  whiteText: {
    color: '#ffffff',
  },
  disabled: {
    opacity: 0.6,
  },
});
