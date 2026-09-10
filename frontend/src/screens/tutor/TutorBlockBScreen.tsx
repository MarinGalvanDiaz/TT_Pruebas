import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import { ClinicalAnswer } from '../../types/tutor.types';
import { TutorService } from '../../services/tutor.service';

interface QuestionItem {
  key: 'neurodesarrollo' | 'atencionActual' | 'otroDiagnostico' | 'violencia';
  number: number;
  text: string;
  helper: string;
}

const QUESTIONS: QuestionItem[] = [
  {
    key: 'neurodesarrollo',
    number: 1,
    text: '¿El o la adolescente cuenta con algún diagnóstico de condición del neurodesarrollo?',
    helper: 'Por ejemplo: Trastorno del Espectro Autista (TEA), TDAH, discapacidad intelectual o trastorno del aprendizaje.',
  },
  {
    key: 'atencionActual',
    number: 2,
    text: '¿Actualmente se encuentra recibiendo tratamiento psicológico o psiquiátrico activo?',
    helper: 'Consultas regulares con psicólogo/a, psiquiatra o toma de psicofármacos prescritos.',
  },
  {
    key: 'otroDiagnostico',
    number: 3,
    text: '¿Ha recibido algún otro diagnóstico de salud mental emitido por un profesional médico o de la salud?',
    helper: 'Por ejemplo: trastorno bipolar, depresión mayor recurrente, trastornos de la conducta alimentaria.',
  },
  {
    key: 'violencia',
    number: 4,
    text: '¿El o la adolescente se encuentra actualmente en alguna situación de violencia o riesgo inminente?',
    helper: 'Violencia familiar, de pareja, física, psicológica, acoso severo o riesgo vital.',
  },
];

export default function TutorBlockBScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const token = route.params?.token || '';
  const emailTutor = route.params?.emailTutor || '';

  const [answers, setAnswers] = useState<Record<string, ClinicalAnswer>>({
    neurodesarrollo: 'NO',
    atencionActual: 'NO',
    otroDiagnostico: 'NO',
    violencia: 'NO',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectAnswer = (key: string, value: ClinicalAnswer) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    // Validate all answered
    if (
      !answers.neurodesarrollo ||
      !answers.atencionActual ||
      !answers.otroDiagnostico ||
      !answers.violencia
    ) {
      setErrorMessage('Por favor responde a todas las preguntas de la evaluación');
      return;
    }

    setLoading(true);
    try {
      const response = await TutorService.submitBlockB({
        token,
        neurodesarrollo: answers.neurodesarrollo,
        atencionActual: answers.atencionActual,
        otroDiagnostico: answers.otroDiagnostico,
        violencia: answers.violencia,
      });

      // Navigate to Pantalla 11 (Review Bridge animation)
      navigation.navigate('TutorReviewBridge', {
        token,
        emailTutor,
        derivacionTipo: response.derivacionTipo,
        estado: response.estado,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al procesar el tamizaje clínico.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
        <Text style={styles.stepLabel}>Paso 3 de 4 • Bloque B: Tamizaje Clínico</Text>

        <Text style={styles.title}>Cuestionario de Salud y Bienestar</Text>
        <Text style={styles.subtitle}>
          UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
        </Text>

        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.secondary} style={{ marginRight: 8 }} />
          <Text style={styles.disclaimerText}>
            Selecciona la opción que mejor describa la situación del adolescente. Esta información nos permite canalizar adecuadamente la atención.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.questionsList}>
          {QUESTIONS.map((q) => (
            <View key={q.key} style={styles.questionCard}>
              <View style={styles.qNumBadge}>
                <Text style={styles.qNumText}>Reactivo {q.number}</Text>
              </View>
              <Text style={styles.questionPrompt}>{q.text}</Text>
              <Text style={styles.questionHelper}>{q.helper}</Text>

              {/* Three Options: Sí | No | No lo sé */}
              <View style={styles.optionsRow}>
                {(['SI', 'NO', 'NO_SE'] as ClinicalAnswer[]).map((opt) => {
                  const isSelected = answers[q.key] === opt;
                  const label = opt === 'SI' ? 'Sí' : opt === 'NO' ? 'No' : 'No lo sé';
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.optionBtn,
                        isSelected && styles.optionBtnSelected,
                      ]}
                      onPress={() => handleSelectAnswer(q.key, opt)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Enviar tamizaje clínico"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </View>
    </ScrollView>
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
    marginBottom: Spacing.md,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer + '30',
    borderRadius: 12,
    padding: 12,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  disclaimerText: {
    ...Typography.bodySmall,
    color: Colors.onSecondaryContainer,
    flex: 1,
    lineHeight: 18,
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
  questionsList: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  questionCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
  },
  qNumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryContainer + '60',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  qNumText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '700',
  },
  questionPrompt: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  questionHelper: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
  },
  optionBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer + '30',
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    ...Typography.labelMedium,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  buttonContainer: {
    width: '100%',
    marginTop: Spacing.sm,
  },
});
