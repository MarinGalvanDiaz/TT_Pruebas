import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import EmergencyDirectoryModal from '../components/modules/EmergencyDirectoryModal';

export type ErrorType = '404' | '500' | 'NETWORK' | '401' | '403';

interface ErrorMetadata {
  codeLabel: string;
  badgeText: string;
  title: string;
  subtitle: string;
  reassurance: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  accentColor: string;
  accentBg: string;
  primaryActionLabel: string;
}

const ERROR_CONFIGS: Record<ErrorType, ErrorMetadata> = {
  '404': {
    codeLabel: 'Error 404',
    badgeText: 'Página no encontrada',
    title: 'Parece que dimos un paso fuera del sendero',
    subtitle:
      'La dirección que buscas no existe, fue movida o tiene algún error de escritura. No te preocupes, tu progreso y tu cuenta están seguros.',
    reassurance:
      'Respira profundo. A veces perderse un momento también es parte del camino; volvamos juntos a un lugar conocido.',
    iconName: 'explore-off',
    accentColor: Colors.primary,
    accentBg: Colors.primaryContainer,
    primaryActionLabel: 'Volver al Inicio',
  },
  '500': {
    codeLabel: 'Error 500 / 502',
    badgeText: 'Servidor tomando un respiro',
    title: 'Nuestros sistemas necesitan un momento de calma',
    subtitle:
      'Estamos experimentando una interrupción temporal en el servidor o realizando ajustes técnicos. Tus respuestas guardadas están protegidas.',
    reassurance:
      'Mientras nuestro equipo restablece el servicio, puedes practicar un ejercicio de respiración o intentarlo de nuevo en unos segundos.',
    iconName: 'cloud-off',
    accentColor: Colors.secondary,
    accentBg: Colors.secondaryContainer,
    primaryActionLabel: 'Reintentar conexión',
  },
  NETWORK: {
    codeLabel: 'Sin Conexión',
    badgeText: 'Red no disponible',
    title: 'No pudimos conectar con Libérate',
    subtitle:
      'Revisa tu conexión a internet o Wi-Fi. Si estabas respondiendo tu cuestionario, tus respuestas quedaron respaldadas en tu dispositivo.',
    reassurance:
      'Tu avance local está resguardado y se sincronizará en cuanto vuelva la señal.',
    iconName: 'wifi-off',
    accentColor: Colors.tertiary,
    accentBg: Colors.tertiaryContainer,
    primaryActionLabel: 'Volver a intentar',
  },
  '401': {
    codeLabel: 'Error 401',
    badgeText: 'Sesión finalizada',
    title: 'Tu sesión expiró por seguridad',
    subtitle:
      'Para proteger la confidencialidad de tu información emocional y clínica, cerramos las sesiones inactivas automáticamente.',
    reassurance:
      'Inicia sesión nuevamente para retomar tus cuestionarios exactamente en la pregunta donde te quedaste.',
    iconName: 'lock-clock',
    accentColor: Colors.primary,
    accentBg: Colors.primaryContainer,
    primaryActionLabel: 'Iniciar sesión',
  },
  '403': {
    codeLabel: 'Error 403',
    badgeText: 'Acceso restringido',
    title: 'Esta sección requiere autorización especial',
    subtitle:
      'Tu perfil actual no cuenta con permisos para visualizar este recurso o aún está pendiente el consentimiento de tu tutor legal.',
    reassurance:
      'Si eres menor de edad, recuerda que tu tutor recibe un enlace en su correo para activar tu cuenta.',
    iconName: 'verified-user',
    accentColor: Colors.secondary,
    accentBg: Colors.secondaryContainer,
    primaryActionLabel: 'Ir a mi perfil / Inicio',
  },
};

interface InlineErrorViewProps {
  type?: ErrorType;
  customMessage?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoLogin?: () => void;
}

export const InlineErrorView: React.FC<InlineErrorViewProps> = ({
  type = '500',
  customMessage,
  onRetry,
  onGoHome,
  onGoLogin,
}) => {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const config = ERROR_CONFIGS[type] || ERROR_CONFIGS['500'];

  return (
    <View style={styles.inlineCard}>
      <View style={[styles.badgePill, { backgroundColor: config.accentBg }]}>
        <MaterialIcons name={config.iconName} size={16} color={config.accentColor} />
        <Text style={[styles.badgeText, { color: config.accentColor }]}>
          {config.codeLabel} • {config.badgeText}
        </Text>
      </View>

      <View style={[styles.iconCircle, { backgroundColor: config.accentBg }]}>
        <MaterialIcons name={config.iconName} size={46} color={config.accentColor} />
      </View>

      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.subtitle}>{customMessage || config.subtitle}</Text>

      {/* Tarjeta de acompañamiento Pili */}
      <View style={styles.piliBox}>
        <View style={styles.piliIconWrap}>
          <Ionicons name="sparkles" size={22} color={Colors.primary} />
        </View>
        <View style={styles.piliTextWrap}>
          <Text style={styles.piliLabel}>Pili te acompaña</Text>
          <Text style={styles.piliDesc}>{config.reassurance}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {onRetry && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onRetry}
            activeOpacity={0.85}
          >
            <MaterialIcons name="refresh" size={20} color={Colors.onPrimary} />
            <Text style={styles.primaryBtnText}>{config.primaryActionLabel}</Text>
          </TouchableOpacity>
        )}

        {type === '401' && onGoLogin && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onGoLogin}
            activeOpacity={0.85}
          >
            <MaterialIcons name="login" size={20} color={Colors.onPrimary} />
            <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
          </TouchableOpacity>
        )}

        {onGoHome && (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onGoHome}
            activeOpacity={0.8}
          >
            <MaterialIcons name="home" size={20} color={Colors.primary} />
            <Text style={styles.secondaryBtnText}>Ir al Inicio</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.sosBtn}
        onPress={() => setShowSOSModal(true)}
        activeOpacity={0.75}
      >
        <MaterialIcons name="phone-in-talk" size={18} color={Colors.error} />
        <Text style={styles.sosBtnText}>
          ¿Necesitas apoyo emocional urgente? Líneas gratuitas 24/7
        </Text>
      </TouchableOpacity>

      <EmergencyDirectoryModal
        visible={showSOSModal}
        onClose={() => setShowSOSModal(false)}
      />
    </View>
  );
};

interface ErrorScreenProps {
  navigation?: any;
  route?: any;
  defaultType?: ErrorType;
  onResetBoundary?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  navigation,
  route,
  defaultType = '404',
  onResetBoundary,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const initialType: ErrorType =
    (route?.params?.type as ErrorType) || defaultType || '404';
  const [selectedType, setSelectedType] = useState<ErrorType>(initialType);
  const customMessage: string | undefined = route?.params?.message;

  const handlePrimaryAction = () => {
    if (onResetBoundary) {
      onResetBoundary();
      return;
    }
    if (selectedType === '401') {
      navigation?.navigate('Login');
      return;
    }
    if (selectedType === '500' || selectedType === 'NETWORK') {
      if (isWeb && typeof window !== 'undefined') {
        window.location.reload();
        return;
      }
    }
    navigation?.navigate('Home');
  };

  const handleGoHome = () => {
    if (onResetBoundary) {
      onResetBoundary();
    }
    if (navigation) {
      navigation.navigate('Home');
    } else if (isWeb && typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <View style={styles.outerCanvas}>
      {isWeb && navigation ? (
        <WebHeader
          activeScreen="Error"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      ) : !isDesktop ? (
        <TopAppBar title="Libérate" />
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContainer, isDesktop && styles.desktopContainer]}>
          <InlineErrorView
            type={selectedType}
            customMessage={customMessage}
            onRetry={handlePrimaryAction}
            onGoHome={handleGoHome}
            onGoLogin={() => navigation?.navigate('Login')}
          />

          {/* Acceso directo a respiración guiada mientras se resuelve */}
          {navigation && (
            <TouchableOpacity
              style={styles.breathingBanner}
              onPress={() => navigation.navigate('Breathing')}
              activeOpacity={0.85}
            >
              <View style={styles.breathingIconCircle}>
                <MaterialIcons name="air" size={24} color={Colors.onSecondaryContainer} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.breathingBannerTitle}>
                  Practicar Respiración Cuadrada (4-4-4-4)
                </Text>
                <Text style={styles.breathingBannerDesc}>
                  Toma una pausa guiada de 2 minutos para relajar los hombros y recuperar la calma.
                </Text>
              </View>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={Colors.onSecondaryContainer}
              />
            </TouchableOpacity>
          )}

          {/* Selector de vista para explorar las páginas de errores comunes */}
          <View style={styles.switcherBar}>
            <Text style={styles.switcherLabel}>Vista de estados de error comunes:</Text>
            <View style={styles.switcherPills}>
              {(['404', '500', 'NETWORK', '401', '403'] as ErrorType[]).map((errKey) => {
                const active = selectedType === errKey;
                return (
                  <TouchableOpacity
                    key={errKey}
                    style={[styles.switcherPill, active && styles.switcherPillActive]}
                    onPress={() => setSelectedType(errKey)}
                  >
                    <Text
                      style={[
                        styles.switcherPillText,
                        active && styles.switcherPillTextActive,
                      ]}
                    >
                      {errKey === 'NETWORK' ? 'Sin Red' : `Error ${errKey}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};

export const NotFoundScreen: React.FC<any> = (props) => (
  <ErrorScreen {...props} defaultType="404" />
);

export const ServerErrorScreen: React.FC<any> = (props) => (
  <ErrorScreen {...props} defaultType="500" />
);

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: 28,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: Spacing.gutter,
    marginBottom: 32,
    gap: 18,
  },
  desktopContainer: {
    paddingTop: 16,
  },
  inlineCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.card,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: 20,
  },
  badgeText: {
    ...Typography.labelSm,
    fontWeight: '700',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '800',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  piliBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: 14,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  piliIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piliTextWrap: {
    flex: 1,
  },
  piliLabel: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  piliDesc: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 18,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: BorderRadius.lg,
    gap: 8,
    minWidth: 180,
    ...Shadows.button,
  },
  primaryBtnText: {
    ...Typography.bodyMd,
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    gap: 8,
    minWidth: 150,
  },
  secondaryBtnText: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontWeight: '700',
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.errorContainer,
  },
  sosBtnText: {
    ...Typography.labelSm,
    color: Colors.onErrorContainer,
    fontWeight: '700',
  },
  breathingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    borderRadius: BorderRadius.xl,
    padding: 16,
    gap: 14,
  },
  breathingIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingBannerTitle: {
    ...Typography.bodyMd,
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
    marginBottom: 2,
  },
  breathingBannerDesc: {
    ...Typography.bodySm,
    color: Colors.onSecondaryContainer,
    opacity: 0.85,
  },
  switcherBar: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: 14,
    alignItems: 'center',
    gap: 10,
  },
  switcherLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  switcherPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  switcherPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  switcherPillActive: {
    backgroundColor: Colors.primary,
  },
  switcherPillText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  switcherPillTextActive: {
    color: Colors.onPrimary,
  },
});

