import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
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
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, logout } = useAuth();

  // En Web siempre se utiliza WebHeader (responsivo para escritorio y navegador móvil).
  // Retornar null en web evita cualquier duplicación de encabezado al redimensionar la pantalla.
  if (Platform.OS === 'web') {
    return null;
  }

  const handleContact = () => {
    if (onContactPress) {
      onContactPress();
    } else {
      Linking.openURL('mailto:soporte@luminar.top?subject=Consulta%20Libérate');
    }
  };

  const handleShare = async () => {
    if (onSharePress) {
      onSharePress();
    } else {
      try {
        await Share.share({
          message: 'Descubre Libérate: Tu espacio seguro para sentirte mejor. https://liberate.luminar.top',
          title: 'Libérate',
        });
      } catch {
        // Share cancelled
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.logoRow}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <View style={styles.brandDot} />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        {isAuthenticated ? (
          <>
            <TouchableOpacity
              style={styles.profilePill}
              onPress={() => navigation.navigate('SessionProfile')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="account-circle" size={16} color={Colors.primary} />
              <Text style={styles.profilePillText} numberOfLines={1}>
                {user?.name?.split(' ')[0] || 'Sesión'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutPill}
              onPress={handleLogout}
              accessibilityLabel="Cerrar sesión"
              activeOpacity={0.8}
            >
              <MaterialIcons name="logout" size={15} color="#e11d48" />
              <Text style={styles.logoutPillText}>Salir</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleContact}
              accessibilityLabel="Contacto"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="mail-outline" size={20} color={Colors.onSurface} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleShare}
              accessibilityLabel="Compartir"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="share" size={19} color={Colors.onSurface} />
            </TouchableOpacity>
          </>
        )}
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
    paddingHorizontal: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    zIndex: 50,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
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
    fontSize: 17,
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
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryContainer,
    maxWidth: 120,
  },
  profilePillText: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    fontSize: 12,
  },
  logoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fff1f2',
  },
  logoutPillText: {
    ...Typography.labelSmBold,
    color: '#e11d48',
    fontSize: 12,
  },
});
