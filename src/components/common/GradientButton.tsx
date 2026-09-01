import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  uppercase?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  uppercase = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.wrapper, Shadows.button, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.innerBorder}>
          {isLoading ? (
            <ActivityIndicator color={Colors.onPrimary} size="small" />
          ) : (
            <Text style={[styles.text, textStyle]}>
              {uppercase ? title.toUpperCase() : title}
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
  },
  gradient: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBorder: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.6,
  },
});
