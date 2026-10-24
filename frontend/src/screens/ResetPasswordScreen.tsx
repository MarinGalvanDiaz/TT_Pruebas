import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { FloatingInput } from '../components/common/FloatingInput';
import { GradientButton } from '../components/common/GradientButton';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

interface ResetPasswordScreenProps {
  navigation: any;
  route?: any;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const getInitialToken = (): string => {
    if (route?.params?.token) return String(route.params.token);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.search) {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('token') || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  };

  const initialToken = getInitialToken();
  const [token, setToken] = useState(initialToken);

  React.useEffect(() => {
    const activeToken = route?.params?.token || getInitialToken();
    if (activeToken && !token) {
      setToken(activeToken);
    }
  }, [route?.params?.token]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: typeof formErrors = {};
    if (!token.trim()) {
      errs.token = 'Ingresa el código o token de verificación';
    }
    if (!newPassword) {
      errs.newPassword = 'Crea tu nueva contraseña';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Debe tener al menos 6 caracteres';
    }
    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReset = async () => {
    clearError();
    if (!validate()) return;

    const res = await resetPassword({ token: token.trim(), newPassword });
    if (res.success) {
      setIsSuccess(true);
      if (Platform.OS !== 'web') {
        Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada.');
      }
    }
  };

  return (
    <View style={styles.outerCanvas}>
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        {!isDesktop && <TopAppBar title="Restablecer contraseña" />}

        {isWeb && (
          <WebHeader
            activeScreen="Login"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.desktopScrollContent,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.mainContent, isDesktop && styles.desktopMainContent]}>
            {/* Mascot Banner */}
            <View style={[styles.mascotBanner, Shadows.soft]}>
              <Image
                source={require('../../assets/images/mascot_skater.png')}
                style={styles.mascotImage}
              />
              <View style={styles.mascotTextWrap}>
                <Text style={styles.mascotTitle}>Nueva Contraseña</Text>
                <Text style={styles.mascotSubtitle}>
                  Elige una clave segura para proteger tu cuenta de Libérate.
                </Text>
              </View>
            </View>

            {/* Form Card */}
            <View style={[styles.formCard, Shadows.soft]}>
              <Text style={styles.formTitle}>Restablecer contraseña</Text>

              {!!error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              {isSuccess ? (
                <View style={styles.successBox}>
                  <Text style={styles.successTitle}>¡Contraseña actualizada!</Text>
                  <Text style={styles.successDesc}>
                    Ahora puedes iniciar sesión con tu nueva contraseña.
                  </Text>
                  <GradientButton
                    title="Iniciar sesión ahora"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.submitButton}
                  />
                </View>
              ) : (
                <>
                  <FloatingInput
                    label="Código / Token de recuperación"
                    value={token}
                    onChangeText={(t) => {
                      setToken(t);
                      if (formErrors.token) setFormErrors({ ...formErrors, token: undefined });
                    }}
                    placeholder="Pega aquí el código recibido"
                    error={formErrors.token}
                  />

                  <FloatingInput
                    label="Nueva contraseña"
                    value={newPassword}
                    onChangeText={(t) => {
                      setNewPassword(t);
                      if (formErrors.newPassword)
                        setFormErrors({ ...formErrors, newPassword: undefined });
                    }}
                    isPassword
                    placeholder="Mínimo 6 caracteres"
                    error={formErrors.newPassword}
                  />

                  <FloatingInput
                    label="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChangeText={(t) => {
                      setConfirmPassword(t);
                      if (formErrors.confirmPassword)
                        setFormErrors({ ...formErrors, confirmPassword: undefined });
                    }}
                    isPassword
                    placeholder="Repite tu nueva contraseña"
                    error={formErrors.confirmPassword}
                  />

                  <GradientButton
                    title="Guardar nueva contraseña"
                    onPress={handleReset}
                    isLoading={isLoading}
                    style={styles.submitButton}
                  />

                  <View style={styles.loginPrompt}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <Text style={styles.loginLink}>← Cancelar y volver al inicio</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>

          <Footer />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.surface,
  },
  desktopContainer: {
    maxWidth: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 24,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  desktopScrollContent: {
    paddingBottom: 0,
  },
  mainContent: {
    paddingHorizontal: Spacing.safeMargin,
    paddingTop: 24,
    alignItems: 'center',
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  desktopMainContent: {
    paddingTop: 36,
    paddingBottom: 36,
  },
  mascotBanner: {
    width: '100%',
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: BorderRadius.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  mascotImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  mascotTextWrap: {
    flex: 1,
  },
  mascotTitle: {
    ...Typography.headlineMd,
    color: Colors.onTertiaryContainer,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  mascotSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onTertiaryContainer,
    fontSize: 12,
    opacity: 0.9,
    lineHeight: 16,
  },
  formCard: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    marginBottom: 24,
  },
  formTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: Colors.errorContainer,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    ...Typography.bodyMd,
    color: Colors.onErrorContainer,
    fontSize: 13,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  successTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  successDesc: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginLink: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontWeight: '700',
  },
});
