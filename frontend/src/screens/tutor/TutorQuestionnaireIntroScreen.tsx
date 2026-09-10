import React from 'react';
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

export default function TutorQuestionnaireIntroScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const token = route.params?.token || '';
  const emailTutor = route.params?.emailTutor || '';

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
        <Text style={styles.stepLabel}>Paso 3 de 4 • Cuestionario de Ingreso</Text>

        <View style={styles.iconCircle}>
          <Ionicons name="clipboard-outline" size={40} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Cuestionario de Ingreso y Tamizaje</Text>
        <Text style={styles.subtitle}>
          UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
        </Text>

        <View style={styles.infoCardsList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.primaryContainer + '50' }]}>
              <Ionicons name="time-outline" size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Duración aproximada: 10 a 15 minutos</Text>
              <Text style={styles.featureDesc}>
                Está diseñado para responderse con calma desde tu celular o computadora.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.secondaryContainer + '50' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Colors.secondary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Respondido por el tutor legal</Text>
              <Text style={styles.featureDesc}>
                Nos permite verificar que el programa sea el adecuado para las necesidades de tu adolescente.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.tertiaryContainer + '50' }]}>
              <Ionicons name="lock-closed-outline" size={22} color={Colors.tertiary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>100% Confidencial y protegido</Text>
              <Text style={styles.featureDesc}>
                Tus respuestas se almacenan bajo cifrado y solo el equipo de investigación tiene acceso autorizado.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Comenzar cuestionario"
            onPress={() => navigation.navigate('TutorBlockA', { token, emailTutor })}
          />

          <TouchableOpacity
            style={styles.saveLaterBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.saveLaterText}>Guardar y continuar después</Text>
          </TouchableOpacity>
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
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryContainer + '40',
    justifyContent: 'center',
    alignItems: 'center',
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
  infoCardsList: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
  },
  saveLaterBtn: {
    marginTop: Spacing.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveLaterText: {
    ...Typography.labelMedium,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
});
