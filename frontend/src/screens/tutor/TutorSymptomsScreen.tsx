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
import { TutorService } from '../../services/tutor.service';

interface SymptomQuestion {
  id: string;
  text: string;
}

const SYMPTOMS: SymptomQuestion[] = [
  {
    id: 's1',
    text: 'Se muestra tenso/a, nervioso/a o preocupado/a excesivamente ante situaciones cotidianas.',
  },
  {
    id: 's2',
    text: 'Presenta cambios bruscos de humor, irritabilidad o tristeza sin causa aparente.',
  },
  {
    id: 's3',
    text: 'Tiene dificultades para conciliar el sueño, pesadillas frecuentes o cansancio constante.',
  },
  {
    id: 's4',
    text: 'Expresa sentirse abrumado/a por la escuela, calificaciones o relaciones sociales.',
  },
  {
    id: 's5',
    text: 'Tiende a aislarse de amigos o familiares y pierde interés por actividades que antes disfrutaba.',
  },
];

const LIKERT_OPTIONS = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Casi nunca' },
  { value: 2, label: 'A veces' },
  { value: 3, label: 'Seguido' },
  { value: 4, label: 'Siempre' },
];

export default function TutorSymptomsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const token = route.params?.token || '';
  const emailTutor = route.params?.emailTutor || '';

  const [ratings, setRatings] = useState<Record<string, number>>({
    s1: 2,
    s2: 2,
    s3: 1,
    s4: 2,
    s5: 1,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectRating = (sId: string, val: number) => {
    setRatings((prev) => ({ ...prev, [sId]: val }));
    setErrorMessage(null);
  };

  const handleFinalize = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await TutorService.submitSymptoms({
        token,
        respuestasLikertJson: JSON.stringify(ratings),
      });

      // Complete flow and unlock adolescent account
      const completeRes = await TutorService.completeFlow(token);

      navigation.replace('TutorCompletion', {
        token,
        emailTutor,
        adolescenteNombre: completeRes.adolescenteNombre,
        adolescenteEmail: completeRes.adolescenteEmail,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar la evaluación de síntomas.';
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
        {/* Stepper indicator: Step 4 of 4 */}
        <View style={styles.stepperRow}>
          <View style={[styles.stepDot, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#ffffff" />
          </View>
          <View style={[styles.stepLine, styles.stepLineActive]} />
          <View style={[styles.stepDot, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#ffffff" />
          </View>
          <View style={[styles.stepLine, styles.stepLineActive]} />
          <View style={[styles.stepDot, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#ffffff" />
          </View>
          <View style={[styles.stepLine, styles.stepLineActive]} />
          <View style={[styles.stepDot, styles.stepActive]}>
            <Text style={styles.stepNumActive}>4</Text>
          </View>
        </View>
        <Text style={styles.stepLabel}>Paso 4 de 4 • Evaluación Pre de Síntomas</Text>

        <Text style={styles.title}>Tu solicitud continúa</Text>
        <Text style={styles.subtitle}>
          Instrumento 1 de 4 • Observación inicial de bienestar emocional
        </Text>

        <View style={styles.instructionBox}>
          <Ionicons name="sparkles-outline" size={18} color={Colors.tertiary} style={{ marginRight: 8 }} />
          <Text style={styles.instructionText}>
            Indica con qué frecuencia has observado las siguientes conductas en el adolescente durante las últimas semanas:
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.questionsContainer}>
          {SYMPTOMS.map((item, idx) => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemNumber}>Reactivo {idx + 1}</Text>
              <Text style={styles.itemText}>{item.text}</Text>

              {/* Likert Scale row */}
              <View style={styles.scaleRow}>
                {LIKERT_OPTIONS.map((opt) => {
                  const isSelected = ratings[item.id] === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.scaleBtn,
                        isSelected && styles.scaleBtnSelected,
                      ]}
                      onPress={() => handleSelectRating(item.id, opt.value)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.scaleValue,
                          isSelected && styles.scaleValueSelected,
                        ]}
                      >
                        {opt.value}
                      </Text>
                      <Text
                        style={[
                          styles.scaleLabel,
                          isSelected && styles.scaleLabelSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {opt.label}
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
            title="Finalizar y autorizar cuenta"
            onPress={handleFinalize}
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
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiaryContainer + '30',
    borderRadius: 12,
    padding: 12,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  instructionText: {
    ...Typography.bodySmall,
    color: Colors.onSurface,
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
  questionsContainer: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  itemCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
  },
  itemNumber: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemText: {
    ...Typography.bodyMedium,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  scaleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scaleBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
  },
  scaleBtnSelected: {
    backgroundColor: Colors.primaryContainer + '50',
    borderColor: Colors.primary,
  },
  scaleValue: {
    ...Typography.titleSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
  },
  scaleValueSelected: {
    color: Colors.primary,
  },
  scaleLabel: {
    ...Typography.labelSmall,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  scaleLabelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  buttonContainer: {
    width: '100%',
    marginTop: Spacing.sm,
  },
});
