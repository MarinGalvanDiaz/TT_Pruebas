import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { FloatingInput } from '../../components/common/FloatingInput';
import { GradientButton } from '../../components/common/GradientButton';
import { TutorService } from '../../services/tutor.service';

export default function TutorBlockAScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const token = route.params?.token || '';
  const emailTutor = route.params?.emailTutor || '';

  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(''); // Formato YYYY-MM-DD
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [adolescenteEmail, setAdolescenteEmail] = useState('');
  const [tieneDispositivo, setTieneDispositivo] = useState<boolean | null>(null);
  const [nacionalidad, setNacionalidad] = useState('Mexicana');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      TutorService.getStatus(token)
        .then((status) => {
          if (status.adolescenteNombre) setNombre(status.adolescenteNombre);
          if (status.adolescenteEmail) setAdolescenteEmail(status.adolescenteEmail);
          if (status.adolescenteFechaNacimiento) {
            setFechaNacimiento(status.adolescenteFechaNacimiento);
            computeAge(status.adolescenteFechaNacimiento);
          }
          if (status.adolescenteTieneDispositivo !== undefined) {
            setTieneDispositivo(status.adolescenteTieneDispositivo);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const computeAge = (birthDateStr: string) => {
    try {
      const parts = birthDateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const birth = new Date(year, month, day);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        if (!isNaN(age) && age > 0 && age < 100) {
          setCalculatedAge(age);
          return;
        }
      }
    } catch {}
    setCalculatedAge(null);
  };

  const handleDateChange = (text: string) => {
    // Permitir escribir con formato YYYY-MM-DD
    setFechaNacimiento(text);
    setErrorMessage(null);
    if (text.length === 10) {
      computeAge(text);
    } else {
      setCalculatedAge(null);
    }
  };

  const handleContinue = async () => {
    setErrorMessage(null);

    if (!nombre.trim()) {
      setErrorMessage('Ingresa el nombre completo del adolescente');
      return;
    }

    if (!fechaNacimiento.trim() || !fechaNacimiento.includes('-') || fechaNacimiento.length !== 10) {
      setErrorMessage('Ingresa una fecha de nacimiento válida en formato AAAA-MM-DD (ejemplo: 2010-05-14)');
      return;
    }

    if (!adolescenteEmail.trim() || !adolescenteEmail.includes('@')) {
      setErrorMessage('Ingresa el correo electrónico del adolescente');
      return;
    }

    if (emailTutor && adolescenteEmail.trim().toLowerCase() === emailTutor.trim().toLowerCase()) {
      setErrorMessage('El correo del adolescente no puede ser idéntico al correo del tutor');
      return;
    }

    if (tieneDispositivo === null) {
      setErrorMessage('Indica si el adolescente cuenta con dispositivo propio o familiar con acceso a internet');
      return;
    }

    setLoading(true);
    try {
      await TutorService.submitBlockA({
        token,
        nombreAdolescente: nombre.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        emailAdolescente: adolescenteEmail.trim().toLowerCase(),
        tieneDispositivo,
        nacionalidad,
      });

      navigation.navigate('TutorBlockB', {
        token,
        emailTutor,
        adolescenteNombre: nombre.trim(),
        adolescenteEdad: calculatedAge,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar los datos del adolescente.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Stepper indicator: Step 3 of 4 */}
          <View style={styles.stepperRow}>
            <View style={[styles.stepDot, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            </View>
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <View style={[styles.stepDot, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            </View>
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <View style={[styles.stepDot, styles.stepActive]}>
              <Text style={styles.stepNumActive}>3</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepDot}>
              <Text style={styles.stepNum}>4</Text>
            </View>
          </View>
          <Text style={styles.stepLabel}>Paso 3 de 4 • Bloque A: Datos del Adolescente</Text>

          <Text style={styles.title}>Información del Adolescente</Text>
          <Text style={styles.subtitle}>
            UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
          </Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.formSection}>
            <FloatingInput
              label="Nombre completo del adolescente"
              value={nombre}
              onChangeText={(t: string) => {
                setNombre(t);
                setErrorMessage(null);
              }}
              autoCapitalize="words"
            />

            <View style={styles.birthRow}>
              <View style={{ flex: 1 }}>
                <FloatingInput
                  label="Fecha de nacimiento (AAAA-MM-DD)"
                  value={fechaNacimiento}
                  onChangeText={handleDateChange}
                  keyboardType="default"
                  maxLength={10}
                  hint="Ejemplo: 2010-06-15"
                />
              </View>
              {calculatedAge !== null ? (
                <View style={styles.ageBadge}>
                  <Text style={styles.ageBadgeNum}>{calculatedAge}</Text>
                  <Text style={styles.ageBadgeLabel}>años</Text>
                </View>
              ) : null}
            </View>

            <FloatingInput
              label="Correo electrónico del adolescente"
              value={adolescenteEmail}
              onChangeText={(t: string) => {
                setAdolescenteEmail(t);
                setErrorMessage(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              hint="Debe ser una cuenta a la que el adolescente tenga acceso directo."
            />

            {/* Question: Has device and internet */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionTitle}>
                ¿El adolescente cuenta con teléfono, tablet o computadora con acceso a internet para usar Libérate?
              </Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    tieneDispositivo === true && styles.toggleBtnActive,
                  ]}
                  onPress={() => setTieneDispositivo(true)}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      tieneDispositivo === true && styles.toggleBtnTextActive,
                    ]}
                  >
                    Sí, cuenta con acceso
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    tieneDispositivo === false && styles.toggleBtnActive,
                  ]}
                  onPress={() => setTieneDispositivo(false)}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      tieneDispositivo === false && styles.toggleBtnTextActive,
                    ]}
                  >
                    No cuenta con acceso
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FloatingInput
              label="Nacionalidad"
              value={nacionalidad}
              onChangeText={setNacionalidad}
            />
          </View>

          <View style={styles.buttonContainer}>
            <GradientButton
              title="Continuar al Bloque B"
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
    maxWidth: 580,
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
  stepCompleted: {
    backgroundColor: Colors.tertiary,
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
  stepLineActive: {
    backgroundColor: Colors.tertiary,
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
  birthRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ageBadge: {
    backgroundColor: Colors.primaryContainer + '60',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 4,
  },
  ageBadgeNum: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  ageBadgeLabel: {
    ...Typography.labelSmall,
    color: Colors.primary,
  },
  questionBlock: {
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing.md,
    borderRadius: 14,
    marginBottom: Spacing.md,
  },
  questionTitle: {
    ...Typography.bodyMedium,
    color: Colors.onSurface,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleBtnText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
  },
  buttonContainer: {
    width: '100%',
    marginTop: Spacing.sm,
  },
});
