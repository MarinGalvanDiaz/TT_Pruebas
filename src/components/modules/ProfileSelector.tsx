import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserRole } from '../../types/auth.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Shadows } from '../../theme/spacing';

interface ProfileOption {
  id: UserRole;
  label: string;
  avatarUrl?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  bgColor: string;
}

const PROFILES: ProfileOption[] = [
  {
    id: 'ADOLESCENTES',
    label: 'Adolescentes',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAblkMVA0H49SglFfkUede6NktGZhBDacPtK_kF1Vgil42WOJCcweIKPl4eLY-Sakl-IWpL26Z64GNJ7NckD_9xKHGL8TZoCEdPSvWAUbGjzrY14Soi8MaxfWVWeAN_gb2s51t-Ghh9pf6VUabYwHJAX3J1XBE51XR5U_onDKcNG0NZ1uL6GFsR0TDUDBpWzumq4B6Gle8OBoFq0Z_iq1-oYWuu_KTKO3ZQoq-iX4vzuHoeOfxgsx7VGpabq8PJaDcpEXs',
    bgColor: Colors.secondaryContainer,
  },
  {
    id: 'FAMILIAS',
    label: 'Familias',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyX_kF77Yt4zXO803bac2O2Vttasup6B35eJeu1ph4FehhUiE-9rhR4a9rpnD3RX3zHvIzMFejiNxewnku_Lw1O5kvCfvc2iBn_CJuOGlGEcxjQ_KCa8o51hHQBrKDv-AvzDH0DP5BPDYE3oVzWzNyB1hrw3bT4_9oWBKo39RmlRfZU6PtwrWHwHJVBKtFykKsucsXh16L67xf_uShBxHhTLWM0Ufd84SP0JjOGb_SKgeoWq9-u2KwS-wyluY9MyM5WGY',
    bgColor: Colors.tertiaryContainer,
  },
  {
    id: 'PSICOLOGOS',
    label: 'Psicólogos',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2nSWI389TCB9dEYtnPCx8So0R1JYhGR0rf-umTFbWjLpjvFs5R_cbB41lTnF9n_YOB2uVxqIRlmEh5c24g-_nF3tPrnv6EC-ubuyST6StOrCfbg4OuW0RyhoYsADMJe5Ox9qEqJxUPkeeX7RjAUmkwOljL96nLzFxecTRbdVT-8HazoOZZpuKKSQP2CoWWs7QLUTJVQThH0gzGrb4BsHFiOHwSCWBwUiBVRaaANdx9tdJn1RDVMufu9TUEG05V9rpzOE',
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
                {profile.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
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
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'transparent',
    marginBottom: 6,
    opacity: 0.75,
  },
  avatarSelected: {
    borderColor: Colors.primary,
    opacity: 1,
    transform: [{ scale: 1.06 }],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
