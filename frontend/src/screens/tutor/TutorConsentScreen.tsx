import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { FloatingInput } from '../../components/common/FloatingInput';
import { GradientButton } from '../../components/common/GradientButton';
import EmergencyDirectoryModal from '../../components/modules/EmergencyDirectoryModal';
import { TutorService } from '../../services/tutor.service';

export default function TutorConsentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const token = route.params?.token || '';
  const emailTutor = route.params?.emailTutor || '';

  const [hasReadConsent, setHasReadConsent] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDirectory, setShowDirectory] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleAccept = async () => {
    setErrorMessage(null);

    if (!hasReadConsent) {
      setErrorMessage('Debes marcar la casilla confirmando que has leído el consentimiento informado');
      return;
    }

    if (!signatureName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo como firma digital');
      return;
    }

    setLoading(true);
    try {
      await TutorService.submitConsent({
        token,
        nombreFirma: signatureName.trim(),
        acepto: true,
      });

      navigation.navigate('TutorQuestionnaireIntro', { token, emailTutor, signatureName });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al registrar el consentimiento.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      '¿Deseas declinar la participación?',
      'Si no aceptas el consentimiento, la cuenta del adolescente no podrá ser activada para este protocolo de investigación. Te mostraremos opciones de apoyo institucional.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Declinar y ver directorio',
          style: 'destructive',
          onPress: async () => {
            try {
              await TutorService.submitConsent({
                token,
                nombreFirma: signatureName.trim() || 'No Aceptado',
                acepto: false,
              });
            } catch {}
            setShowDirectory(true);
          },
        },
      ]
    );
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
          {/* Stepper indicator: Step 2 of 4 */}
          <View style={styles.stepperRow}>
            <View style={[styles.stepDot, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            </View>
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <View style={[styles.stepDot, styles.stepActive]}>
              <Text style={styles.stepNumActive}>2</Text>
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
          <Text style={styles.stepLabel}>Paso 2 de 4 • Consentimiento Informado Ético</Text>

          <Text style={styles.title}>Consentimiento del Tutor Legal</Text>
          <Text style={styles.subtitle}>
            UNAM · IPN · LABPSIIT • Protocolo de Investigación PAPIME PE309026
          </Text>

          {/* Consent Text Box */}
          <View style={styles.consentBox}>
            <ScrollView style={styles.consentScroll} nestedScrollEnabled>
              <Text style={styles.consentHeading}>PROTOCOLO DE CONSENTIMIENTO INFORMADO</Text>
              <Text style={styles.consentParagraph}>
                El presente protocolo tiene por objetivo evaluar herramientas digitales de bienestar y regulación emocional en población adolescente, bajo la supervisión de investigadores de la Universidad Nacional Autónoma de México (UNAM) y el Instituto Politécnico Nacional (IPN).
              </Text>
              <Text style={styles.consentSubheading}>1. Confidencialidad y Protección de Datos</Text>
              <Text style={styles.consentParagraph}>
                Toda la información recabada será tratada con estricta confidencialidad. Las respuestas clínicas y evaluaciones serán disociadas mediante códigos alfanuméricos. En ningún momento se publicarán nombres o datos identificables de usted ni del menor tutelado.
              </Text>
              <Text style={styles.consentSubheading}>2. Naturaleza Voluntaria y Participación</Text>
              <Text style={styles.consentParagraph}>
                La participación en este protocolo es 100% voluntaria y gratuita. Usted o su menor tutelado pueden retirar su consentimiento en cualquier momento sin ninguna consecuencia académica, médica o legal.
              </Text>
              <Text style={styles.consentSubheading}>3. Detección de Riesgo y Deber de Cuidado</Text>
              <Text style={styles.consentParagraph}>
                En caso de que el tamizaje detecte situaciones de urgencia o riesgo severo a la integridad física o emocional (p. ej. violencia activa), el sistema aplicará un protocolo de derivación prioritaria y nuestro equipo clínico establecerá contacto con usted en un lapso menor a 24 horas.
              </Text>
            </ScrollView>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Checkbox agreement */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setHasReadConsent(!hasReadConsent)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, hasReadConsent && styles.checkboxChecked]}>
              {hasReadConsent ? (
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              ) : null}
            </View>
            <Text style={styles.checkboxLabel}>
              He leído y comprendido el documento completo. Acepto los términos y autorizo la participación de mi menor tutelado/a en el proyecto.
            </Text>
          </TouchableOpacity>

          {/* Signature Input & Date */}
          <View style={styles.signatureSection}>
            <FloatingInput
              label="Nombre completo del tutor (Firma electrónica)"
              value={signatureName}
              onChangeText={(t: string) => {
                setSignatureName(t);
                setErrorMessage(null);
              }}
              autoCapitalize="words"
              hint="Escribe tu nombre y apellidos tal como aparecen en tu identificación oficial."
            />

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.onSurfaceVariant} style={{ marginRight: 6 }} />
              <Text style={styles.dateText}>Fecha de firma: {todayFormatted}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonsContainer}>
            <GradientButton
              title="Acepto participar"
              onPress={handleAccept}
              loading={loading}
            />

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleReject}
              disabled={loading}
            >
              <Text style={styles.rejectButtonText}>No acepto participar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <EmergencyDirectoryModal
          visible={showDirectory}
          onClose={() => setShowDirectory(false)}
          defaultEmail={emailTutor}
        />
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
    maxWidth: 620,
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
  consentBox: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.md,
  },
  consentScroll: {
    flex: 1,
  },
  consentHeading: {
    ...Typography.labelMedium,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  consentSubheading: {
    ...Typography.labelSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  consentParagraph: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: 8,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    width: '100%',
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
    color: Colors.onSurface,
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  signatureSection: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  dateText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  rejectButton: {
    marginTop: Spacing.sm,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  rejectButtonText: {
    ...Typography.labelMedium,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
});
