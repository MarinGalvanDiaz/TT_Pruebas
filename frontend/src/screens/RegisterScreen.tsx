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
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, loginWithGoogle, selectedRole, setSelectedRole, isLoading, error, clearError } =
    useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('15');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    age?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const errors: typeof formErrors = {};
    if (!name.trim()) {
      errors.name = 'Ingresa tu nombre completo';
    }
    if (!email.trim()) {
      errors.email = 'Ingresa tu correo electrónico';
    } else if (!email.includes('@')) {
      errors.email = 'Formato de correo inválido';
    }
    if (selectedRole === 'ADOLESCENTES') {
      const numAge = parseInt(age, 10);
      if (isNaN(numAge) || numAge < 12 || numAge > 17) {
        errors.age = 'El protocolo para adolescentes es de 12 a 17 años';
      }
    }
    if (!password) {
      errors.password = 'Ingresa una contraseña';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;

    const numAge = parseInt(age, 10);
    const isAdolescent = selectedRole === 'ADOLESCENTES' && !isNaN(numAge) && numAge < 18;

    const success = await register({
      name: name.trim(),
      nombre: name.trim(),
      email: email.trim(),
      password,
      role: selectedRole,
      edad: !isNaN(numAge) ? numAge : undefined,
    });

    if (success) {
      if (isAdolescent) {
        navigation.navigate('AdolescentBlocked', {
          nombre: name.trim(),
          edad: numAge,
          email: email.trim(),
        });
      } else {
        navigation.navigate('VerifyEmail', { email: email.trim() });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsGoogleLoading(true);
    try {
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

  return (
    <View style={styles.outerCanvas}>
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        {/* Mobile top bar (mobile native / narrow screen) */}
        {!isDesktop && <TopAppBar title="Libérate" />}

        {/* Web Header for desktop / web browser */}
        {isWeb && (
          <WebHeader
            activeScreen="Register"
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
            {/* Mascot Banner Header */}
            <View style={[styles.mascotWelcomeHeader, Shadows.soft]}>
              <Image
                source={require('../../assets/images/mascots_group_banner.png')}
                style={styles.mascotGroupImage}
              />
              <Text style={styles.mascotWelcomeTitle}>Comienza tu viaje</Text>
              <Text style={styles.mascotWelcomeSubtitle}>
                Crea tu cuenta segura y accede a recursos diseñados para ti.
              </Text>
            </View>

            {/* Segmented Control */}
            <SegmentedControl
              selected="registro"
              onSelect={(opt) => {
                if (opt === 'ingreso') navigation.navigate('Login');
              }}
            />

            {/* Profile Selector */}
            <ProfileSelector
              selectedRole={selectedRole}
              onSelectRole={(role) => setSelectedRole(role)}
            />

            {/* Register Card */}
            <View style={[styles.formCard, Shadows.soft]}>
              <Text style={styles.formTitle}>Crear cuenta</Text>

              {!!error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              <FloatingInput
                label="Nombre completo"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                }}
                autoCapitalize="words"
                placeholder="Ej. Camila Silva"
                error={formErrors.name}
              />

              {selectedRole === 'ADOLESCENTES' && (
                <FloatingInput
                  label="Edad (12 a 17 años)"
                  value={age}
                  onChangeText={(t: string) => {
                    setAge(t);
                    if (formErrors.age) setFormErrors({ ...formErrors, age: undefined });
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="Ej. 15"
                  error={formErrors.age}
                  hint="Los menores de 18 años requieren autorización y consentimiento de su tutor."
                />
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
                placeholder="Mínimo 6 caracteres"
                error={formErrors.password}
              />

              <FloatingInput
                label="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  if (formErrors.confirmPassword)
                    setFormErrors({ ...formErrors, confirmPassword: undefined });
                }}
                isPassword
                placeholder="Repite tu contraseña"
                error={formErrors.confirmPassword}
              />

              <GradientButton
                title="Crear cuenta"
                onPress={handleRegister}
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
                title="Registrarse con Google"
                onPress={handleGoogleSignIn}
                isLoading={isGoogleLoading}
              />

              <View style={styles.loginPrompt}>
                <Text style={styles.promptText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Iniciar sesión</Text>
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
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.xl,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  mascotGroupImage: {
    width: '100%',
    height: 76,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  mascotWelcomeTitle: {
    ...Typography.headlineMd,
    color: Colors.onPrimaryContainer,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  mascotWelcomeSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onPrimaryContainer,
    fontSize: 13,
    opacity: 0.9,
    textAlign: 'center',
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
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
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
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  promptText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  loginLink: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});


