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

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}***@${domain}`;
  return `${user.substring(0, 2)}***@${domain}`;
}

export default function TutorCompletionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const adolescenteNombre = route.params?.adolescenteNombre || 'el o la adolescente';
  const adolescenteEmail = route.params?.adolescenteEmail || '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done" size={48} color={Colors.tertiary} />
        </View>

        <Text style={styles.title}>¡Terminaste tu parte!</Text>
        <Text style={styles.subtitle}>
          UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
        </Text>

        <View style={styles.successBanner}>
          <Ionicons name="mail" size={20} color={Colors.tertiary} style={{ marginRight: 8 }} />
          <Text style={styles.successBannerText}>
            Le enviamos un correo de invitación a{' '}
            <Text style={{ fontWeight: '700' }}>{maskEmail(adolescenteEmail)}</Text>
          </Text>
        </View>

        <Text style={styles.explanation}>
          La cuenta de <Text style={{ fontWeight: '700' }}>{adolescenteNombre}</Text> ha sido desbloqueada en la plataforma.
        </Text>

        {/* 3 Next Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsHeading}>¿Qué sigue ahora?</Text>

          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeNum}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepItemTitle}>Revisión de correo</Text>
              <Text style={styles.stepItemDesc}>
                El o la adolescente abrirá su correo para confirmar su cuenta y definir su contraseña segura.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeNum}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepItemTitle}>Asentimiento personal</Text>
              <Text style={styles.stepItemDesc}>
                Responderá su propio cuestionario de intereses y bienestar adaptado a su edad.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeNum}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepItemTitle}>Acceso a herramientas</Text>
              <Text style={styles.stepItemDesc}>
                Podrá utilizar los ejercicios de respiración táctica, diario de estado de ánimo y cápsulas educativas.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Ir a mi cuenta"
            onPress={() => navigation.navigate('Home')}
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
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.tertiaryFixed + '60',
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiaryContainer + '40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: Spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.tertiaryContainer,
  },
  successBannerText: {
    ...Typography.bodyMedium,
    color: Colors.onTertiaryContainer,
    flex: 1,
  },
  explanation: {
    ...Typography.bodyMedium,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 18,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  stepsHeading: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepBadgeNum: {
    ...Typography.labelSmall,
    color: '#ffffff',
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepItemTitle: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepItemDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
  },
});
