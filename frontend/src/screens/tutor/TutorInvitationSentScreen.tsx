import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/common/GradientButton';
import EmergencyDirectoryModal from '../../components/modules/EmergencyDirectoryModal';
import { TutorService } from '../../services/tutor.service';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}***@${domain}`;
  return `${user.substring(0, 2)}***@${domain}`;
}

export default function TutorInvitationSentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const token = route.params?.token || '';
  const emailTutor = route.params?.emailTutor || 'tutor@ejemplo.com';
  const adolescenteNombre = route.params?.adolescenteNombre || '';
  const adolescenteEmail = route.params?.adolescenteEmail || '';

  const [countdown, setCountdown] = useState(120); // 2 minutes cooldown
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [showDirectory, setShowDirectory] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (!canResend || resendCount >= 3) return;
    setResending(true);
    setFeedbackMessage(null);
    try {
      await TutorService.resendInvite(token);
      setCountdown(120);
      setCanResend(false);
      setResendCount((c) => c + 1);
      setFeedbackMessage('Invitación reenviada exitosamente.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'No se pudo reenviar la invitación.';
      setFeedbackMessage(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        {/* Success Icon Badge */}
        <View style={styles.iconCircle}>
          <Ionicons name="mail-unread-outline" size={40} color={Colors.tertiary} />
        </View>

        <Text style={styles.title}>Listo, ya le avisamos a tu tutor</Text>
        <Text style={styles.subtitle}>
          UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
        </Text>

        <View style={styles.emailBox}>
          <Ionicons name="send" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.emailBoxText}>
            Enviamos un correo a <Text style={{ fontWeight: '700' }}>{maskEmail(emailTutor)}</Text>
          </Text>
        </View>

        <Text style={styles.instructions}>
          Tu tutor legal debe abrir el correo, revisar el consentimiento informado ético y contestar unas breves preguntas para desbloquear tu cuenta.
        </Text>

        {feedbackMessage ? (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </View>
        ) : null}

        {/* Resend button with 2 minute countdown */}
        <View style={styles.resendSection}>
          <GradientButton
            title={canResend ? 'Reenviar invitación' : `Reenviar en ${formatTimer(countdown)}`}
            onPress={handleResend}
            loading={resending}
            disabled={!canResend || resendCount >= 3}
          />
          {resendCount >= 3 ? (
            <Text style={styles.limitText}>
              Has alcanzado el límite máximo de 3 reenvíos en 24 horas.
            </Text>
          ) : null}
        </View>

        {/* Change email link */}
        <TouchableOpacity
          style={styles.changeEmailLink}
          onPress={() =>
            navigation.navigate('AdolescentBlocked', {
              nombre: adolescenteNombre,
              email: adolescenteEmail,
            })
          }
        >
          <Ionicons name="create-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.changeEmailText}>Cambiar el correo de mi tutor</Text>
        </TouchableOpacity>

        {/* Tutor quick entry for simulation/testing */}
        <TouchableOpacity
          style={styles.tutorEntryLink}
          onPress={() => navigation.navigate('TutorConfirmData', { token, emailTutor })}
        >
          <Ionicons name="open-outline" size={16} color={Colors.tertiary} style={{ marginRight: 6 }} />
          <Text style={styles.tutorEntryText}>Acceder al enlace del tutor (Paso 1)</Text>
        </TouchableOpacity>

        {/* Emergency Crisis Contact */}
        <View style={styles.crisisCard}>
          <View style={styles.crisisHeader}>
            <Ionicons name="heart" size={18} color={Colors.secondary} style={{ marginRight: 6 }} />
            <Text style={styles.crisisTitle}>¿Necesitas hablar con alguien ahora?</Text>
          </View>
          <Text style={styles.crisisDesc}>
            Línea de la Vida (800 911 2000) o SAPTEL (55 5259 8121) atienden gratis las 24 horas.
          </Text>
          <TouchableOpacity
            style={styles.directoryBtn}
            onPress={() => setShowDirectory(true)}
          >
            <Text style={styles.directoryBtnText}>Ver números de apoyo en crisis</Text>
          </TouchableOpacity>
        </View>
      </View>

      <EmergencyDirectoryModal
        visible={showDirectory}
        onClose={() => setShowDirectory(false)}
        defaultEmail={emailTutor}
      />
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
    maxWidth: 540,
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.tertiaryFixed + '50',
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
  emailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer + '40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
  },
  emailBoxText: {
    ...Typography.bodyMedium,
    color: Colors.onPrimaryContainer,
  },
  instructions: {
    ...Typography.bodyMedium,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  feedbackBanner: {
    backgroundColor: Colors.tertiaryContainer + '60',
    padding: 10,
    borderRadius: 10,
    marginBottom: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  feedbackText: {
    ...Typography.bodySmall,
    color: Colors.onTertiaryContainer,
    fontWeight: '600',
  },
  resendSection: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  limitText: {
    ...Typography.bodySmall,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 6,
  },
  changeEmailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: Spacing.sm,
  },
  changeEmailText: {
    ...Typography.labelMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  tutorEntryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: Spacing.md,
  },
  tutorEntryText: {
    ...Typography.labelMedium,
    color: Colors.tertiary,
    fontWeight: '600',
  },
  crisisCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 16,
    padding: Spacing.md,
    width: '100%',
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  crisisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  crisisTitle: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  crisisDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  directoryBtn: {
    backgroundColor: Colors.secondaryContainer,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  directoryBtnText: {
    ...Typography.labelMedium,
    color: Colors.onSecondaryContainer,
    fontWeight: '600',
  },
});
