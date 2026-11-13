import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface WebHeaderProps {
  activeScreen?: string;
  onNavigate?: (screenName: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const WebHeader: React.FC<WebHeaderProps> = ({
  activeScreen,
  onNavigate,
  onNavigateSection,
}) => {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleNav = (target: string, isSection = false) => {
    if (isSection && onNavigateSection) {
      onNavigateSection(target);
      return;
    }
    if (onNavigate) {
      onNavigate(target);
    } else {
      navigation.navigate(target);
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
          <Text style={[styles.brandText, !isDesktop && styles.mobileBrandText]}>Libérate</Text>
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
              onPress={() => handleNav('Breathing')}
              style={[styles.navItem, activeScreen === 'Breathing' && styles.activeNavItem]}
            >
              <Text style={[styles.navText, activeScreen === 'Breathing' && styles.activeNavText]}>
                Respirar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNav('Progress')}
              style={[styles.navItem, activeScreen === 'Progress' && styles.activeNavItem]}
            >
              <Text style={[styles.navText, activeScreen === 'Progress' && styles.activeNavText]}>
                Progreso
              </Text>
            </TouchableOpacity>

            {isAuthenticated && user?.role === 'ADOLESCENTES' && (
              <TouchableOpacity
                onPress={() => handleNav('AdolescentQuestionnaire')}
                style={[
                  styles.navItem,
                  activeScreen === 'AdolescentQuestionnaire' && styles.activeNavItem,
                ]}
              >
                <Text
                  style={[
                    styles.navText,
                    activeScreen === 'AdolescentQuestionnaire' && styles.activeNavText,
                  ]}
                >
                  Evaluación
                </Text>
              </TouchableOpacity>
            )}

            {onNavigateSection && (
              <>
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
              </>
            )}
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
                  !isDesktop && styles.mobileSessionBtn,
                  activeScreen === 'SessionProfile' && styles.activeSessionBtn,
                ]}
                activeOpacity={0.8}
              >
                <MaterialIcons name="account-circle" size={17} color={Colors.primary} />
                <Text style={styles.sessionBtnText} numberOfLines={1}>
                  {isDesktop ? user?.name || 'Mi Sesión' : user?.name?.split(' ')[0] || 'Sesión'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await logout();
                  handleNav('Login');
                }}
                style={[styles.logoutBtn, !isDesktop && styles.mobileLogoutBtn]}
                activeOpacity={0.8}
              >
                <MaterialIcons name="logout" size={15} color="#e11d48" />
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

      {/* Pestañas de navegación para versión móvil web (100% ancho) */}
      {!isDesktop && (
        <View style={styles.mobileTabsRow}>
          <TouchableOpacity
            onPress={() => handleNav('Home')}
            style={[styles.mobileTab, activeScreen === 'Home' && styles.activeMobileTab]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="home"
              size={17}
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
            onPress={() => handleNav('Breathing')}
            style={[styles.mobileTab, activeScreen === 'Breathing' && styles.activeMobileTab]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="air"
              size={17}
              color={activeScreen === 'Breathing' ? Colors.primary : Colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.mobileTabText,
                activeScreen === 'Breathing' && styles.activeMobileTabText,
              ]}
            >
              Respirar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNav('Progress')}
            style={[styles.mobileTab, activeScreen === 'Progress' && styles.activeMobileTab]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="analytics"
              size={17}
              color={activeScreen === 'Progress' ? Colors.primary : Colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.mobileTabText,
                activeScreen === 'Progress' && styles.activeMobileTabText,
              ]}
            >
              Progreso
            </Text>
          </TouchableOpacity>

          {isAuthenticated && user?.role === 'ADOLESCENTES' && (
            <TouchableOpacity
              onPress={() => handleNav('AdolescentQuestionnaire')}
              style={[
                styles.mobileTab,
                activeScreen === 'AdolescentQuestionnaire' && styles.activeMobileTab,
              ]}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="assignment"
                size={17}
                color={
                  activeScreen === 'AdolescentQuestionnaire'
                    ? Colors.primary
                    : Colors.onSurfaceVariant
                }
              />
              <Text
                style={[
                  styles.mobileTabText,
                  activeScreen === 'AdolescentQuestionnaire' && styles.activeMobileTabText,
                ]}
              >
                Evaluación
              </Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
  },
  desktopInnerWrap: {
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  brandText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  mobileBrandText: {
    fontSize: 17,
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
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
    gap: 8,
  },
  loginBtn: {
    paddingVertical: 7,
    paddingHorizontal: 10,
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
    paddingVertical: 7,
    paddingHorizontal: 14,
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
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryContainer,
  },
  mobileSessionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  activeSessionBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  sessionBtnText: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    fontSize: 12,
    maxWidth: 110,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fff1f2',
  },
  mobileLogoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
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
    gap: 4,
    paddingVertical: 10,
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
    fontSize: 12,
    fontWeight: '500',
  },
  activeMobileTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
