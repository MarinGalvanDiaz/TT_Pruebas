import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface WebHeaderProps {
  activeScreen?: string;
  onNavigate: (screenName: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const WebHeader: React.FC<WebHeaderProps> = ({
  activeScreen,
  onNavigate,
  onNavigateSection,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleNav = (target: string, isSection = false) => {
    if (isSection && onNavigateSection) {
      onNavigateSection(target);
    } else {
      onNavigate(target);
    }
  };

  return (
    <View style={[styles.container, Shadows.soft]}>
      <View style={[styles.innerWrap, isDesktop && styles.desktopInnerWrap]}>
        {/* Logo with Brand Indicator */}
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => handleNav('Home')}
          activeOpacity={0.8}
        >
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>Libérate</Text>
        </TouchableOpacity>

        {/* Center Navigation Links (Desktop) */}
        {isDesktop && (
          <View style={styles.navLinksRow}>
            <TouchableOpacity
              onPress={() => handleNav('Home')}
              style={[styles.navItem, activeScreen === 'Home' && styles.activeNavItem]}
            >
              <Text style={[styles.navText, activeScreen === 'Home' && styles.activeNavText]}>
                Inicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNav('colaboradores', true)}
              style={styles.navItem}
            >
              <Text style={styles.navText}>Colaboradores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNav('faqs', true)}
              style={styles.navItem}
            >
              <Text style={styles.navText}>Preguntas frecuentes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Right Auth Buttons */}
        <View style={styles.authButtonsRow}>
          <TouchableOpacity
            onPress={() => handleNav('Login')}
            style={styles.loginBtn}
            activeOpacity={0.8}
          >
            <Text style={[styles.loginText, activeScreen === 'Login' && styles.activeAuthText]}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNav('Register')}
            style={[styles.registerBtn, Shadows.button]}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>Registro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    width: '100%',
    zIndex: 100,
  },
  innerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  desktopInnerWrap: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
  },
  brandText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  navText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '500',
  },
  activeNavText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  authButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  loginText: {
    ...Typography.labelSmBold,
    color: Colors.onSurface,
    fontSize: 13,
  },
  activeAuthText: {
    color: Colors.primary,
  },
  registerBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.full,
  },
  registerBtnText: {
    ...Typography.labelSmBold,
    color: Colors.onPrimary,
    fontSize: 13,
  },
});

