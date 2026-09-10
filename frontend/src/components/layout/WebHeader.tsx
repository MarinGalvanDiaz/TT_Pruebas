import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
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
  const { user, isAuthenticated, logout } = useAuth();
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
          {isAuthenticated ? (
            <>
              <TouchableOpacity
                onPress={() => handleNav('SessionProfile')}
                style={[
                  styles.sessionBtn,
                  activeScreen === 'SessionProfile' && styles.activeSessionBtn,
                ]}
                activeOpacity={0.8}
              >
                <MaterialIcons name="account-circle" size={18} color={Colors.primary} />
                <Text style={styles.sessionBtnText} numberOfLines={1}>
                  {user?.name || 'Mi Sesión'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await logout();
                  handleNav('Login');
                }}
                style={styles.logoutBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutBtnText}>Salir</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
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
            </>
          )}
        </View>
      </View>

      {/* Pestañas de navegación para versión móvil (100% ancho) */}
      {!isDesktop && (
        <View style={styles.mobileTabsRow}>
          <TouchableOpacity
            onPress={() => handleNav('Home')}
            style={[styles.mobileTab, activeScreen === 'Home' && styles.activeMobileTab]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="home"
              size={18}
              color={activeScreen === 'Home' ? Colors.primary : Colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.mobileTabText,
                activeScreen === 'Home' && styles.activeMobileTabText,
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNav('colaboradores', true)}
            style={styles.mobileTab}
            activeOpacity={0.7}
          >
            <MaterialIcons name="group" size={18} color={Colors.onSurfaceVariant} />
            <Text style={styles.mobileTabText}>Colaboradores</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNav('faqs', true)}
            style={styles.mobileTab}
            activeOpacity={0.7}
          >
            <MaterialIcons name="help-outline" size={18} color={Colors.onSurfaceVariant} />
            <Text style={styles.mobileTabText}>Preguntas</Text>
          </TouchableOpacity>
        </View>
      )}
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
    width: '100%',
  },
  desktopInnerWrap: {
    paddingHorizontal: 40,
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
  sessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryContainer,
  },
  activeSessionBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  sessionBtnText: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    fontSize: 13,
    maxWidth: 120,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fff1f2',
  },
  logoutBtnText: {
    ...Typography.labelSmBold,
    color: '#e11d48',
    fontSize: 12,
  },
  mobileTabsRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  mobileTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeMobileTab: {
    borderBottomColor: Colors.primary,
    backgroundColor: Colors.primaryContainer + '40',
  },
  mobileTabText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '500',
  },
  activeMobileTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

