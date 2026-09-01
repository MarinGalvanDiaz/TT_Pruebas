import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
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

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, selectedRole, setSelectedRole, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const isWeb = Platform.OS === 'web';

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
      <View style={styles.container}>
        <TopAppBar title="Libérate" />
        {isWeb && (
          <WebHeader
            activeScreen="Login"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
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
                onPress={() =>
                  Alert.alert('Recuperar contraseña', 'Te enviaremos un enlace de recuperación.')
                }
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <GradientButton
                title="Ingresar"
                onPress={handleLogin}
                isLoading={isLoading}
                style={styles.submitButton}
              />

              <View style={styles.registerPrompt}>
                <Text style={styles.promptText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
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
    backgroundColor: Colors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Spacing.maxWidth,
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mainContent: {
    paddingHorizontal: Spacing.safeMargin,
    paddingTop: 20,
    alignItems: 'center',
  },
  quickAccessBar: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  quickAccessTitle: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
    fontWeight: '600',
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPill: {
    backgroundColor: Colors.primaryContainer,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  quickPillText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
    fontWeight: '600',
  },
  formCard: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
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
