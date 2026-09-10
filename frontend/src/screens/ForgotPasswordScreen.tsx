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

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSend = async () => {
    clearError();
    setSuccessMessage(null);

    if (!email.trim()) {
      setEmailError('Ingresa tu correo electrónico');
      return;
    }
    if (!email.includes('@')) {
      setEmailError('Formato de correo inválido');
      return;
    }
    setEmailError(undefined);

    const response = await forgotPassword({ email });
    setSuccessMessage(
      response.message || 'Si el correo está registrado en Libérate, recibirás un enlace de recuperación en breve.'
    );
  };

  return (
    <View style={styles.outerCanvas}>
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        {!isDesktop && <TopAppBar title="Recuperar contraseña" />}

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
                source={require('../../assets/images/mascots_green_duo_crop.png')}
                style={styles.mascotImage}
              />
              <View style={styles.mascotTextWrap}>
                <Text style={styles.mascotTitle}>¿Olvidaste tu contraseña?</Text>
                <Text style={styles.mascotSubtitle}>
                  No te preocupes, te ayudaremos a restablecerla de forma segura.
                </Text>
              </View>
            </View>

            {/* Form Card */}
            <View style={[styles.formCard, Shadows.soft]}>
              <Text style={styles.formTitle}>Recuperación de cuenta</Text>
              <Text style={styles.formDescription}>
                Ingresa el correo electrónico asociado a tu cuenta de Libérate.
              </Text>

              {!!error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              {!!successMessage && (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerText}>{successMessage}</Text>
                </View>
              )}

              <FloatingInput
                label="Correo electrónico"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (emailError) setEmailError(undefined);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="ejemplo@correo.com"
                error={emailError}
              />

              <GradientButton
                title="Enviar enlace de recuperación"
                onPress={handleSend}
                isLoading={isLoading}
                style={styles.submitButton}
              />

              <View style={styles.loginPrompt}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>← Volver a Iniciar sesión</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: Colors.primaryContainer,
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
    color: Colors.onPrimaryContainer,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  mascotSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onPrimaryContainer,
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
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  formDescription: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 13,
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
  successBanner: {
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: 16,
  },
  successBannerText: {
    ...Typography.bodyMd,
    color: Colors.onTertiaryContainer,
    fontSize: 13,
    lineHeight: 18,
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
