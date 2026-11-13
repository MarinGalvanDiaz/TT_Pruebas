import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

export type ErrorPageCode = '404' | '403' | '500' | 'OFFLINE';

interface ErrorScreenProps {
  navigation?: any;
  route?: any;
  code?: ErrorPageCode;
  customMessage?: string;
  onRetry?: () => void;
}

const ERROR_CONFIG: Record<
  ErrorPageCode,
  {
    badge: string;
    title: string;
    description: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    tip: string;
  }
> = {
  '404': {
    badge: 'Error 404 • Página no encontrada',
    title: 'Parece que tomamos un desvío tranquilo',
    description:
      'La página o enlace que buscas no existe o fue movido. No te preocupes, tu progreso y tu cuenta siguen completamente seguros.',
    icon: 'explore-off',
    tip: 'Respira profundo: regresar al inicio toma solo un toque.',
  },
  '403': {
    badge: 'Error 403 • Acceso restringido',
    title: 'Necesitas iniciar sesión para continuar',
    description:
      'Esta sección está protegida para resguardar tu privacidad y confidencialidad clínica.',
    icon: 'lock-outline',
    tip: 'Inicia sesión con tu cuenta de Libérate para acceder a tus cuestionarios y herramientas.',
  },
  '500': {
    badge: 'Error 500 • Servicio temporalmente ocupado',
    title: 'Estamos tomando un respiro técnico',
    description:
      'Ocurrió un inconveniente temporal al comunicarnos con el servidor. Tus respuestas guardadas están protegidas.',
    icon: 'cloud-off',
    tip: 'Espera unos segundos y vuelve a intentarlo.',
  },
  OFFLINE: {
    badge: 'Sin conexión • Modo desconectado',
    title: 'Revisa tu conexión a internet',
    description:
      'No pudimos conectarnos con liberate.luminar.top. Verifica tu señal Wi-Fi o datos móviles.',
    icon: 'wifi-off',
    tip: 'En cuanto recuperes la conexión podrás continuar donde te quedaste.',
  },
};

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  navigation,
  route,
  code,
  customMessage,
  onRetry,
}) => {
  const isWeb = Platform.OS === 'web';
  const resolvedCode: ErrorPageCode =
    code || (route?.params?.code as ErrorPageCode) || '404';
  const config = ERROR_CONFIG[resolvedCode] || ERROR_CONFIG['404'];
  const message = customMessage || route?.params?.message || config.description;

  const handleGoHome = () => {
    if (navigation?.navigate) {
      navigation.navigate('Home');
    } else if (isWeb && typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleGoLogin = () => {
    if (navigation?.navigate) {
      navigation.navigate('Login');
    } else if (isWeb && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <View style={styles.outerCanvas}>
      {isWeb ? (
        <WebHeader
          onNavigate={
            navigation?.navigate ? (screen) => navigation.navigate(screen) : undefined
          }
        />
      ) : (
        <TopAppBar title="Libérate" />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <View style={[styles.card, Shadows.soft]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{config.badge}</Text>
            </View>

            <View style={styles.iconCircle}>
              <MaterialIcons name={config.icon} size={44} color={Colors.primary} />
            </View>

            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.description}>{message}</Text>

            <View style={styles.tipBox}>
              <Ionicons name="sparkles" size={18} color={Colors.secondary} />
              <Text style={styles.tipText}>{config.tip}</Text>
            </View>

            <View style={styles.actionsColumn}>
              {onRetry && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onRetry}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="refresh" size={20} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>Reintentar ahora</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={onRetry ? styles.secondaryButton : styles.primaryButton}
                onPress={handleGoHome}
                activeOpacity={0.85}
              >
                <MaterialIcons
                  name="home"
                  size={20}
                  color={onRetry ? Colors.primary : '#ffffff'}
                />
                <Text
                  style={
                    onRetry ? styles.secondaryButtonText : styles.primaryButtonText
                  }
                >
                  Ir al Inicio
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGoLogin}
                activeOpacity={0.85}
              >
                <MaterialIcons name="login" size={18} color={Colors.primary} />
                <Text style={styles.secondaryButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.crisisBanner}>
              <MaterialIcons name="phone-in-talk" size={18} color={Colors.error} />
              <Text style={styles.crisisText}>
                ¿Necesitas apoyo emocional 24/7? Línea de la Vida:{' '}
                <Text style={styles.crisisPhone}>800 911 2000</Text> • SAPTEL:{' '}
                <Text style={styles.crisisPhone}>55 5259 8121</Text>
              </Text>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.background,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  mainContent: {
    paddingHorizontal: Spacing.safeMargin,
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  card: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  badge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginBottom: 16,
  },
  badgeText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer + '45',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.lg,
    gap: 8,
    width: '100%',
    marginBottom: 22,
  },
  tipText: {
    ...Typography.bodySm,
    color: Colors.onSecondaryContainer,
    flex: 1,
    fontWeight: '500',
  },
  actionsColumn: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  primaryButtonText: {
    ...Typography.bodyLg,
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainer,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 8,
  },
  secondaryButtonText: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontWeight: '700',
  },
  crisisBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorContainer + '50',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    gap: 8,
    width: '100%',
  },
  crisisText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 17,
  },
  crisisPhone: {
    color: Colors.error,
    fontWeight: '700',
  },
});
