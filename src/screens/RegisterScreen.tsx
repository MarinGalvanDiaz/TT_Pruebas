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

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, selectedRole, setSelectedRole, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const isWeb = Platform.OS === 'web';

  const validate = (): boolean => {
    const errors: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      errors.name = 'Ingresa tu nombre completo';
    }
    if (!email.trim()) {
      errors.email = 'Ingresa tu correo electrónico';
    } else if (!email.includes('@')) {
      errors.email = 'Formato de correo inválido';
    }
    if (!password) {
      errors.password = 'Ingresa una contraseña';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;

    const success = await register({
      name,
      email,
      password,
      role: selectedRole,
    });

    if (success) {
      if (Platform.OS !== 'web') {
        Alert.alert('¡Cuenta creada con éxito!', `Bienvenido a Libérate como ${selectedRole}`);
      }
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.outerCanvas}>
      <View style={styles.container}>
        <TopAppBar title="Libérate" />
        {isWeb && (
          <WebHeader
            activeScreen="Register"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
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
              <Text style={styles.formTitle}>Crea tu cuenta</Text>

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
                placeholder="Crea una contraseña segura"
                error={formErrors.password}
              />

              <GradientButton
                title="Comenzar"
                onPress={handleRegister}
                isLoading={isLoading}
                style={styles.submitButton}
              />

              <View style={styles.loginPrompt}>
                <Text style={styles.promptText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Ingresa aquí</Text>
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
  formCard: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
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
