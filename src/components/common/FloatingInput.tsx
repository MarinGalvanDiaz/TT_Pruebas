import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/spacing';

interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  error?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const hasContent = value.length > 0;
  const isFloating = isFocused || hasContent;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          !!error && styles.inputContainerError,
        ]}
      >
        <Text
          style={[
            styles.label,
            isFloating ? styles.labelFloating : styles.labelDefault,
            isFocused && styles.labelFocused,
            !!error && styles.labelError,
          ]}
        >
          {label}
        </Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFloating ? placeholder : ''}
          placeholderTextColor={Colors.onSurfaceVariant}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.input}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color={Colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    minHeight: 58,
    justifyContent: 'center',
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 224, 204, 0.28)',
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  label: {
    position: 'absolute',
    left: 16,
    color: Colors.onSurfaceVariant,
    transitionDuration: '200ms',
  } as any,
  labelDefault: {
    top: 18,
    ...Typography.bodyMd,
  },
  labelFloating: {
    top: 6,
    ...Typography.labelSm,
    fontSize: 11,
  },
  labelFocused: {
    color: Colors.primary,
    fontWeight: '600',
  },
  labelError: {
    color: Colors.error,
  },
  input: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    padding: 0,
    margin: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 18,
  },
  errorText: {
    ...Typography.labelSm,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
