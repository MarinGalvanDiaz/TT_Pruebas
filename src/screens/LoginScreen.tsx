import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  useWindowDimensions,
} from 'react-native';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { SegmentedControl } from '../components/modules/SegmentedControl';
import { ProfileSelector } from '../components/modules/ProfileSelector';
import { FloatingInput } from '../components/common/FloatingInput';
import { GradientButton } from '../components/common/GradientButton';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

import { GoogleSignInButton } from '../components/common/GoogleSignInButton';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, loginWithGoogle, selectedRole, setSelectedRole, isLoading, error, clearError } =
    useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Ingresa tu correo electrónico';
    } else if (!email.includes('@')) {
      errors.email = 'Formato de correo inválido';
    }
    if (!password) {
      errors.password = 'Ingresa tu contraseña';
    } else if (password.length < 4) {
      errors.password = 'La contraseña debe tener al menos 4 caracteres';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;

    const success = await login({ email, password, role: selectedRole });
    if (success) {
      if (Platform.OS !== 'web') {
        Alert.alert('¡Bienvenido!', `Sesión iniciada con perfil: ${selectedRole}`);
      }
      navigation.navigate('Home');
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsGoogleLoading(true);
    try {
      // In production mobile with Expo AuthSession / Google SDK, idToken is retrieved via OpenID Connect
      // For development and testing with Spring Boot, we pass the standard token payload
      const mockGoogleIdToken = `mock-google-id-token-${Date.now()}`;
      const success = await loginWithGoogle({
        idToken: mockGoogleIdToken,
        role: selectedRole,
      });
      if (success) {
        navigation.navigate('Home');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const fillQuickDemo = (role: 'ADOLESCENTES' | 'FAMILIAS' | 'PSICOLOGOS') => {
    setSelectedRole(role);
    if (role === 'ADOLESCENTES') {
      setEmail('adolescente@liberate.org');
      setPassword('123456');
    } else if (role === 'FAMILIAS') {
      setEmail('familia@liberate.org');
      setPassword('123456');
    } else {
      setEmail('psicologo@liberate.org');
      setPassword('123456');
    }
  };

  return (
    <View style={styles.outerCanvas}>
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        {/* Mobile top bar (mobile native / narrow screen) */}
        {!isDesktop && <TopAppBar title="Libérate" />}

        {/* Web Header for desktop / web browser */}
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
            {/* Mascot Welcome Header */}
            <View style={[styles.mascotWelcomeHeader, Shadows.soft]}>
              <Image
                source={require('../../assets/images/mascots_teal_duo_crop.png')}
                style={styles.mascotWelcomeImage}
              />
              <View style={styles.mascotWelcomeTextWrap}>
                <Text style={styles.mascotWelcomeTitle}>¡Bienvenido de vuelta!</Text>
                <Text style={styles.mascotWelcomeSubtitle}>
                  Selecciona tu rol y accede a tus herramientas personalizadas.
                </Text>
              </View>
            </View>

            {/* Segmented Control (Registro / Ingreso) */}
            <SegmentedControl
              selected="ingreso"
              onSelect={(opt) => {
                if (opt === 'registro') navigation.navigate('Register');
              }}
            />

            {/* Profile Selector */}
            <ProfileSelector
              selectedRole={selectedRole}
              onSelectRole={(role) => setSelectedRole(role)}
            />

            {/* Demo Quick Select Pill */}
            <View style={styles.quickAccessBar}>
              <Text style={styles.quickAccessTitle}>Autocompletar demo:</Text>
              <View style={styles.quickPillsRow}>
                <TouchableOpacity
                  onPress={() => fillQuickDemo('ADOLESCENTES')}
                  style={styles.quickPill}
                >
                  <Text style={styles.quickPillText}>Adolescente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => fillQuickDemo('FAMILIAS')}
                  style={styles.quickPill}
                >
                  <Text style={styles.quickPillText}>Familia</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => fillQuickDemo('PSICOLOGOS')}
                  style={styles.quickPill}
                >
                  <Text style={styles.quickPillText}>Psicólogo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Card */}
            <View style={[styles.formCard, Shadows.soft]}>
              {!!error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              <FloatingInput
                label="Correo electrónico"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="ejemplo@correo.com"
                error={formErrors.email}
              />

              <FloatingInput
                label="Contraseña"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                }}
                isPassword
                placeholder="Tu contraseña secreta"
                error={formErrors.password}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <GradientButton
                title="Iniciar sesión"
                onPress={handleLogin}
                isLoading={isLoading && !isGoogleLoading}
                style={styles.submitButton}
              />

              {/* Social Login Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o bien</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign In */}
              <GoogleSignInButton
                title="Continuar con Google"
                onPress={handleGoogleSignIn}
                isLoading={isGoogleLoading}
              />

              <View style={styles.registerPrompt}>
                <Text style={styles.promptText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Crear cuenta</Text>
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
  mascotWelcomeHeader: {
    width: '100%',
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: BorderRadius.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  mascotWelcomeImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  mascotWelcomeTextWrap: {
    flex: 1,
  },
  mascotWelcomeTitle: {
    ...Typography.headlineMd,
    color: Colors.onTertiaryContainer,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  mascotWelcomeSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onTertiaryContainer,
    fontSize: 13,
    opacity: 0.9,
    lineHeight: 18,
  },
  quickAccessBar: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  quickAccessTitle: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    fontWeight: '600',
  },
  quickPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPill: {
    backgroundColor: Colors.primaryContainer,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
  },
  quickPillText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
    fontWeight: '600',
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
  errorBanner: {
    backgroundColor: Colors.errorContainer,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    ...Typography.bodyMd,
    color: Colors.onErrorContainer,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceVariant,
  },
  dividerText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    paddingHorizontal: 12,
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  promptText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  registerLink: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});


