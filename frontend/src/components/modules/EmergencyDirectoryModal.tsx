import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { TutorService } from '../../services/tutor.service';
import { FloatingInput } from '../common/FloatingInput';

interface EmergencyDirectoryModalProps {
  visible: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

interface CrisisContact {
  id: string;
  name: string;
  phone: string;
  displayPhone: string;
  hours: string;
  description: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CRISIS_CONTACTS: CrisisContact[] = [
  {
    id: 'vida',
    name: 'Línea de la Vida (CONASAMA)',
    phone: '8009112000',
    displayPhone: '800 911 2000',
    hours: '24 horas / 365 días • Gratuita',
    description: 'Orientación psicológica especializada en crisis emocional, ansiedad y prevención de autolesiones.',
    color: Colors.primary,
    icon: 'call',
  },
  {
    id: 'saptel',
    name: 'SAPTEL Cruz Roja Mexicana',
    phone: '5552598121',
    displayPhone: '55 5259 8121',
    hours: '24 horas • Gratuita',
    description: 'Sistema de Apoyo Psicológico e intervención en crisis por teléfono con psicólogos profesionales.',
    color: Colors.secondary,
    icon: 'heart-half',
  },
  {
    id: 'unam',
    name: 'Atención Psicológica UNAM',
    phone: '5550250855',
    displayPhone: '55 5025 0855',
    hours: 'Lunes a Viernes 8:00 - 18:00',
    description: 'Servicio de orientación psicológica remota de la Facultad de Psicología de la UNAM.',
    color: Colors.tertiary,
    icon: 'school',
  },
  {
    id: '911',
    name: 'Emergencias Nacionales',
    phone: '911',
    displayPhone: '911',
    hours: '24 horas • Emergencia vital',
    description: 'Para situaciones de riesgo inmediato a la vida o integridad física.',
    color: Colors.error,
    icon: 'warning',
  },
];

export default function EmergencyDirectoryModal({
  visible,
  onClose,
  defaultEmail = '',
}: EmergencyDirectoryModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      // Ignorar si no tiene soporte para llamadas telefónicas (p. ej. en navegador web de escritorio)
    });
  };

  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      setEmailError('Ingresa un correo electrónico válido');
      return;
    }
    setSendingEmail(true);
    setEmailError(null);
    try {
      await TutorService.sendDirectory({ email: email.trim() });
      setEmailSent(true);
    } catch (err: any) {
      setEmailError(err.response?.data?.message || 'No se pudo enviar el directorio por correo.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.modalTitle}>Directorio de Apoyo Institucional</Text>
                <Text style={styles.modalSubtitle}>UNAM · IPN · LABPSIIT • Atención gratuita</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Cerrar modal">
              <Ionicons name="close" size={24} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.bannerText}>
              Si tú o el adolescente están pasando por un momento de angustia, crisis o peligro, estas líneas están listas para acompañarte con profesionales de la salud mental:
            </Text>

            {CRISIS_CONTACTS.map((item) => (
              <View key={item.id} style={styles.contactCard}>
                <View style={styles.contactHeader}>
                  <View style={[styles.badgeIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactHours}>{item.hours}</Text>
                  </View>
                </View>

                <Text style={styles.contactDesc}>{item.description}</Text>

                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: item.color }]}
                  onPress={() => handleCall(item.phone)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.callButtonText}>Llamar al {item.displayPhone}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Enviar directorio por correo */}
            <View style={styles.emailCard}>
              <Text style={styles.emailCardTitle}>¿Deseas recibir este directorio en tu correo?</Text>
              <Text style={styles.emailCardDesc}>
                Te enviaremos los datos de contacto y centros de atención para que los tengas a la mano en todo momento.
              </Text>

              {emailSent ? (
                <View style={styles.successBox}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.tertiary} style={{ marginRight: 8 }} />
                  <Text style={styles.successText}>¡Directorio enviado con éxito a {email}!</Text>
                </View>
              ) : (
                <View style={styles.emailInputRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <FloatingInput
                      label="Correo electrónico"
                      value={email}
                      onChangeText={(t: string) => {
                        setEmail(t);
                        setEmailError(null);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={emailError || undefined}
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.sendButton, sendingEmail && { opacity: 0.6 }]}
                    onPress={handleSendEmail}
                    disabled={sendingEmail}
                  >
                    {sendingEmail ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Ionicons name="mail" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                        <Text style={styles.sendButtonText}>Enviar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer close */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Cerrar Directorio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    width: '100%',
    maxWidth: 620,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryContainer + '60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  modalTitle: {
    ...Typography.titleMedium,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  modalSubtitle: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
  },
  closeButton: {
    padding: 6,
    borderRadius: 12,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  bannerText: {
    ...Typography.bodyMedium,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  contactCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '60',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  contactHours: {
    ...Typography.bodySmall,
    color: Colors.tertiary,
    fontWeight: '600',
  },
  contactDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  callButtonText: {
    ...Typography.labelMedium,
    color: '#ffffff',
    fontWeight: '700',
  },
  emailCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 16,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  emailCardTitle: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    marginBottom: 4,
  },
  emailCardDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  emailInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 4,
  },
  sendButtonText: {
    ...Typography.labelMedium,
    color: '#ffffff',
    fontWeight: '700',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiaryFixed + '40',
    padding: 12,
    borderRadius: 10,
  },
  successText: {
    ...Typography.bodySmall,
    color: Colors.tertiary,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  doneButton: {
    backgroundColor: Colors.surfaceVariant,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    ...Typography.labelLarge,
    color: Colors.onSurface,
    fontWeight: '600',
  },
});
