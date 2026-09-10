import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { GradientButton } from '../components/common/GradientButton';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

interface VerifyEmailScreenProps {
  navigation: any;
  route?: any;
}

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ navigation, route }) => {
  const { verifyEmail, resendVerification, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const initialEmail = route?.params?.email || '';
  const initialToken = route?.params?.token || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialToken);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(
    null
  );
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (initialToken) {
      handleVerify(initialToken);
    }
  }, [initialToken]);

  const handleVerify = async (tokenToVerify?: string) => {
    const token = (tokenToVerify || code).trim();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Por favor, ingresa el código de verificación de 6 dígitos.' });
      return;
    }

    setIsVerifying(true);
    setStatusMessage(null);
    try {
      const response = await verifyEmail(token);
      if (response.success) {
        setIsVerified(true);
        setStatusMessage({
          type: 'success',
          text: response.message || '¡Tu correo electrónico ha sido verificado exitosamente! Ya puedes iniciar sesión.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: response.message || 'El código es inválido o ha expirado. Verifica el código e intenta nuevamente.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error de conexión al validar el código. Verifica e intenta nuevamente.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Por favor, ingresa un correo electrónico válido para reenviar el código.' });
      return;
    }

    setIsResending(true);
    setStatusMessage(null);
    try {
      const response = await resendVerification(email.trim());
      setStatusMessage({
        type: 'info',
        text: response.message || 'Hemos enviado un nuevo código a tu correo electrónico.',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'No se pudo reenviar el código. Inténtalo de nuevo en unos momentos.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.outerCanvas}>
      {isWeb ? (
        <WebHeader
          activeScreen="VerifyEmail"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      ) : (
        <TopAppBar title="Validar Correo" />
      )}

      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Header Icon */}
            <View style={styles.iconCircle}>
              <MaterialIcons
                name={isVerified ? 'verified' : 'mark-email-read'}
                size={40}
                color={isVerified ? Colors.secondary : Colors.primary}
              />
            </View>

            <Text style={styles.title}>
              {isVerified ? '¡Cuenta Verificada!' : 'Valida tu Correo'}
            </Text>

            <Text style={styles.subtitle}>
              {isVerified
                ? 'Tu cuenta de Libérate está lista para usar. Puedes continuar para iniciar sesión con tus credenciales.'
                : email
                ? `Ingresa el código de 6 dígitos enviado a:\n${email}`
                : 'Ingresa el código de 6 dígitos enviado a tu correo electrónico para activar tu cuenta.'}
            </Text>

            {/* Status Message Alert */}
            {statusMessage && (
              <View
                style={[
                  styles.statusBox,
                  statusMessage.type === 'success' && styles.statusBoxSuccess,
                  statusMessage.type === 'error' && styles.statusBoxError,
                  statusMessage.type === 'info' && styles.statusBoxInfo,
                ]}
              >
                <MaterialIcons
                  name={
                    statusMessage.type === 'success'
                      ? 'check-circle'
                      : statusMessage.type === 'error'
                      ? 'error-outline'
                      : 'info'
                  }
                  size={20}
                  color={
                    statusMessage.type === 'success'
                      ? Colors.secondary
                      : statusMessage.type === 'error'
                      ? Colors.error
                      : Colors.primary
                  }
                />
                <Text
                  style={[
                    styles.statusText,
                    statusMessage.type === 'success' && styles.statusTextSuccess,
                    statusMessage.type === 'error' && styles.statusTextError,
                    statusMessage.type === 'info' && styles.statusTextInfo,
                  ]}
                >
                  {statusMessage.text}
                </Text>
              </View>
            )}

            {!isVerified ? (
              <>
                {/* Email field if not provided */}
                {!initialEmail && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Correo electrónico registrado</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="ejemplo@luminar.top"
                      placeholderTextColor={Colors.onSurfaceVariant}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                )}

                {/* Verification Code Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Código de verificación</Text>
                  <TextInput
                    style={styles.codeInput}
                    placeholder="123456"
                    placeholderTextColor="#9ca3af"
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="characters"
                    maxLength={64}
                    textAlign="center"
                  />
                  <Text style={styles.inputHint}>
                    Revisa tu bandeja de entrada o la bandeja de spam en Mailtrap.
                  </Text>
                </View>

                {/* Validate Button */}
                <View style={styles.actionContainer}>
                  <GradientButton
                    title={isVerifying ? 'Validando...' : 'Validar código'}
                    label={isVerifying ? 'Validando...' : 'Validar código'}
                    isLoading={isVerifying}
                    onPress={() => handleVerify()}
                    disabled={isVerifying}
                  />
                </View>

                {/* Resend Code Section */}
                <View style={styles.resendSection}>
                  <Text style={styles.resendPrompt}>¿No recibiste el correo o expiró?</Text>
                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={isResending}
                    style={styles.resendButton}
                  >
                    {isResending ? (
                      <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                      <Text style={styles.resendButtonText}>Reenviar código nuevo</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Return to Login */}
                <TouchableOpacity
                  style={styles.backToLoginBtn}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Success Actions */
              <View style={styles.successActions}>
                <GradientButton
                  title="Iniciar sesión ahora"
                  label="Iniciar sesión ahora"
                  onPress={() => navigation.navigate('Login')}
                />
                <TouchableOpacity
                  style={styles.homeBtn}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.homeBtnText}>Ir al Inicio</Text>
                </TouchableOpacity>
              </View>
            )}
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
    paddingVertical: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 32,
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.card,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: BorderRadius.md,
    marginBottom: 20,
    width: '100%',
  },
  statusBoxSuccess: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  statusBoxError: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  statusBoxInfo: {
    backgroundColor: '#ede7f6',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  statusText: {
    ...Typography.bodySm,
    flex: 1,
    fontWeight: '500',
  },
  statusTextSuccess: {
    color: '#1b5e20',
  },
  statusTextError: {
    color: Colors.error,
  },
  statusTextInfo: {
    color: Colors.primary,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    ...Typography.labelSmBold,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
    color: Colors.primary,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  inputHint: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
  },
  actionContainer: {
    width: '100%',
    marginTop: 8,
    marginBottom: 20,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  resendPrompt: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  resendButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  resendButtonText: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  backToLoginBtn: {
    paddingVertical: 8,
  },
  backToLoginText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  successActions: {
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  homeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  homeBtnText: {
    ...Typography.labelSmBold,
    color: Colors.onSurface,
  },
});

