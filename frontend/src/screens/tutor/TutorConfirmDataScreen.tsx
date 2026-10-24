import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { FloatingInput } from '../../components/common/FloatingInput';
import { GradientButton } from '../../components/common/GradientButton';
import { TutorService } from '../../services/tutor.service';

export default function TutorConfirmDataScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const getWebQueryParam = (param: string): string => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.search) {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(param) || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  };

  const initialToken = route.params?.token || getWebQueryParam('token') || '';
  const initialEmail = route.params?.emailTutor || getWebQueryParam('email') || '';

  const [token, setToken] = useState(initialToken);
  const [emailTutor, setEmailTutor] = useState(initialEmail);
  const [telefono, setTelefono] = useState('');
  const [autorizaWhatsapp, setAutorizaWhatsapp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!initialToken && !initialEmail);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const activeToken = route.params?.token || getWebQueryParam('token') || token;
    if (activeToken) {
      if (activeToken !== token) {
        setToken(activeToken);
      }
      if (!emailTutor) {
        setInitialLoading(true);
        TutorService.getStatus(activeToken)
          .then((status) => {
            setEmailTutor(status.emailTutor);
            if (status.telefonoTutor) setTelefono(status.telefonoTutor);
            setAutorizaWhatsapp(status.autorizaWhatsapp);
          })
          .catch((err) => {
            setErrorMessage('No se pudo verificar el enlace o ha expirado.');
          })
          .finally(() => setInitialLoading(false));
      }
    }
  }, [route.params?.token, token]);

  const handleContinue = async () => {
    setErrorMessage(null);

    const cleanPhone = telefono.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Ingresa un número celular de 10 dígitos para WhatsApp');
      return;
    }

    setLoading(true);
    try {
      await TutorService.confirmData({
        token,
        telefonoTutor: cleanPhone,
        autorizaWhatsapp,
      });

      navigation.navigate('TutorConsent', { token, emailTutor, telefonoTutor: cleanPhone });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar datos. Intenta nuevamente.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[Typography.bodyMedium, { marginTop: 12, color: Colors.onSurfaceVariant }]}>
          Cargando solicitud de tutor...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Stepper indicator: Step 1 of 4 */}
          <View style={styles.stepperRow}>
            <View style={[styles.stepDot, styles.stepActive]}>
              <Text style={styles.stepNumActive}>1</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepDot}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepDot}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepDot}>
              <Text style={styles.stepNum}>4</Text>
            </View>
          </View>
          <Text style={styles.stepLabel}>Paso 1 de 4 • Confirmación de Datos del Tutor</Text>

          <Text style={styles.title}>Bienvenido/a al proceso de autorización</Text>
          <Text style={styles.subtitle}>
            UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
          </Text>

          {/* Email verified badge */}
          <View style={styles.verifiedBox}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.tertiary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.verifiedLabel}>Correo del tutor verificado</Text>
              <Text style={styles.verifiedEmail}>{emailTutor || 'Correo verificado'}</Text>
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.formSection}>
            <FloatingInput
              label="Número de teléfono celular (10 dígitos)"
              value={telefono}
              onChangeText={(t: string) => {
                setTelefono(t);
                setErrorMessage(null);
              }}
              keyboardType="phone-pad"
              maxLength={10}
              hint="Lo utilizaremos para seguimiento o canalización si es necesario."
            />

            {/* Checkbox WhatsApp */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAutorizaWhatsapp(!autorizaWhatsapp)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, autorizaWhatsapp && styles.checkboxChecked]}>
                {autorizaWhatsapp ? (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                ) : null}
              </View>
              <Text style={styles.checkboxLabel}>
                Autorizo recibir avisos e información relevante del proyecto a través de WhatsApp.
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <GradientButton
              title="Continuar al Consentimiento Ético"
              onPress={handleContinue}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 560,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: Colors.primary,
  },
  stepNum: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
  },
  stepNumActive: {
    ...Typography.labelSmall,
    color: '#ffffff',
    fontWeight: '700',
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: Colors.outlineVariant,
    marginHorizontal: 4,
  },
  stepLabel: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.headlineMedium,
    color: Colors.onSurface,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiaryFixed + '30',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.tertiaryContainer,
  },
  verifiedLabel: {
    ...Typography.bodySmall,
    color: Colors.tertiary,
    fontWeight: '700',
  },
  verifiedEmail: {
    ...Typography.bodyMedium,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorContainer + '60',
    padding: 12,
    borderRadius: 12,
    marginBottom: Spacing.md,
    width: '100%',
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '600',
    flex: 1,
  },
  formSection: {
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
  },
});
