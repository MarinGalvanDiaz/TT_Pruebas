import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

export default function TutorReviewBridgeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const token = route.params?.token || '';
  const emailTutor = route.params?.emailTutor || '';
  const derivacionTipo = route.params?.derivacionTipo || 'NONE';

  useEffect(() => {
    // 3.5 seconds bridge delay per clinical specification
    const timer = setTimeout(() => {
      if (derivacionTipo === 'PRIORITARIA') {
        navigation.replace('TutorDerivationPriority', { token, emailTutor });
      } else if (derivacionTipo === 'GENERAL') {
        navigation.replace('TutorDerivationGeneral', { token, emailTutor });
      } else {
        navigation.replace('TutorSymptoms', { token, emailTutor });
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [derivacionTipo, token]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.pulseContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>

        <Text style={styles.title}>Estamos revisando tu solicitud</Text>
        <Text style={styles.subtitle}>
          Evaluando criterios de participación conforme al protocolo clínico UNAM · IPN · LABPSIIT.
        </Text>

        <View style={styles.badgeRow}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.tertiary} style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>Proceso confidencial y seguro</Text>
        </View>

        <Text style={styles.waitingText}>Por favor no cierres esta ventana, tomará solo un momento...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  pulseContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryContainer + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.headlineMedium,
    color: Colors.onSurface,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiaryContainer + '40',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  badgeText: {
    ...Typography.bodySmall,
    color: Colors.onTertiaryContainer,
    fontWeight: '600',
  },
  waitingText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
});

