import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserRole } from '../../types/auth.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Shadows } from '../../theme/spacing';

interface ProfileOption {
  id: UserRole;
  label: string;
  avatarSource?: ImageSourcePropType;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  bgColor: string;
}

const PROFILES: ProfileOption[] = [
  {
    id: 'ADOLESCENTES',
    label: 'Adolescentes',
    avatarSource: require('../../../assets/images/mascot_skater.png'),
    bgColor: Colors.secondaryContainer,
  },
  {
    id: 'FAMILIAS',
    label: 'Familias',
    avatarSource: require('../../../assets/images/mascots_teal_duo_crop.png'),
    bgColor: Colors.tertiaryContainer,
  },
  {
    id: 'PSICOLOGOS',
    label: 'Psicólogos',
    avatarSource: require('../../../assets/images/mascots_green_duo_crop.png'),
    bgColor: Colors.primaryContainer,
  },
  {
    id: 'ADMIN',
    label: 'Admin',
    iconName: 'shield',
    bgColor: Colors.surfaceContainerHigh,
  },
];

interface ProfileSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  title?: string;
  style?: ViewStyle;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  selectedRole,
  onSelectRole,
  title = '¿Quién eres?',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {PROFILES.map((profile) => {
          const isSelected = selectedRole === profile.id;
          return (
            <TouchableOpacity
              key={profile.id}
              style={styles.profileItem}
              onPress={() => onSelectRole(profile.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.avatarWrapper,
                  { backgroundColor: profile.bgColor },
                  isSelected && styles.avatarSelected,
                  isSelected && Shadows.mascot,
                ]}
              >
                {profile.avatarSource ? (
                  <Image source={profile.avatarSource} style={styles.avatarImage} />
                ) : (
                  <MaterialIcons
                    name={profile.iconName || 'person'}
                    size={28}
                    color={isSelected ? Colors.primary : Colors.onSurfaceVariant}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isSelected ? styles.labelSelected : styles.labelUnselected,
                ]}
                numberOfLines={1}
              >
                {profile.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 440,
    gap: 8,
  },
  profileItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'transparent',
    marginBottom: 6,
    padding: 6,
    opacity: 0.85,
  },
  avatarSelected: {
    borderColor: Colors.primary,
    opacity: 1,
    transform: [{ scale: 1.08 }],
    backgroundColor: '#ffffff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  label: {
    ...Typography.labelSm,
    textAlign: 'center',
  },
  labelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  labelUnselected: {
    color: Colors.onSurfaceVariant,
  },
});
