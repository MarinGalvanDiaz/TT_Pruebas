import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

interface SessionProfileScreenProps {
  navigation: any;
}

export const SessionProfileScreen: React.FC<SessionProfileScreenProps> = ({ navigation }) => {
  const { user, logout, selectedRole } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const userName = user?.name || 'Usuario';
  const userRole = user?.role || selectedRole || 'ADOLESCENTES';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '#6b21a8';
      case 'PSICOLOGOS':
        return '#0e7490';
      case 'FAMILIAS':
        return '#b45309';
      case 'ADOLESCENTES':
      default:
        return Colors.primary;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.outerCanvas}>
      {isWeb ? (
        <WebHeader
          activeScreen="SessionProfile"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      ) : (
        <TopAppBar title="Mi Sesión" />
      )}

      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Session Indicator Badge */}
            <View style={styles.sessionBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.sessionBadgeText}>Sesión iniciada</Text>
            </View>

            {/* Avatar Icon */}
            <View style={styles.avatarCircle}>
              <MaterialIcons name="person" size={52} color={Colors.primary} />
            </View>

            {/* Info Card: Only User Name and User Type */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nombre:</Text>
                <Text style={styles.infoValueName}>{userName}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo de usuario:</Text>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleBadgeColor(userRole) + '18' },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      { color: getRoleBadgeColor(userRole) },
                    ]}
                  >
                    {userRole}
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              {userRole === 'ADOLESCENTES' && (
                <TouchableOpacity
                  style={styles.questionnaireButton}
                  onPress={() => navigation.navigate('AdolescentQuestionnaire')}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="assignment" size={20} color="#ffffff" />
                  <Text style={styles.questionnaireButtonText}>
                    {user?.evaluacionInicialCompletada
                      ? 'Revisar Cuestionarios Iniciales'
                      : 'Realizar Cuestionarios Iniciales'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.85}
              >
                <MaterialIcons name="logout" size={20} color="#ffffff" />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.85}
              >
                <MaterialIcons name="home" size={20} color={Colors.primary} />
                <Text style={styles.homeButtonText}>Ir al Inicio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  desktopContainer: {
    maxWidth: '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 36,
    width: '100%',
    maxWidth: 460,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.card,
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 24,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  sessionBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  infoSection: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: 28,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    fontSize: 14,
  },
  infoValueName: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: 6,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  questionnaireButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    ...Shadows.button,
  },
  questionnaireButtonText: {
    ...Typography.labelSmBold,
    color: '#ffffff',
    fontSize: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    ...Shadows.button,
  },
  logoutButtonText: {
    ...Typography.labelSmBold,
    color: '#ffffff',
    fontSize: 15,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  homeButtonText: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    fontSize: 15,
  },
});

