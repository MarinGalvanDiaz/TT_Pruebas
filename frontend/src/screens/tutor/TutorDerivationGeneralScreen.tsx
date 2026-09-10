import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import EmergencyDirectoryModal from '../../components/modules/EmergencyDirectoryModal';

export default function TutorDerivationGeneralScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const emailTutor = route.params?.emailTutor || '';
  const [showModal, setShowModal] = useState(false);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart-half-outline" size={44} color={Colors.secondary} />
        </View>

        <Text style={styles.title}>Gracias por confiar en nosotros</Text>
        <Text style={styles.subtitle}>
          UNAM · IPN · LABPSIIT • Protocolo PAPIME PE309026
        </Text>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Por los criterios metodológicos y de inclusión de nuestro protocolo de investigación actual, en esta etapa no es posible continuar con el registro en la plataforma Libérate.
          </Text>
          <Text style={[styles.messageText, { marginTop: 10 }]}>
            Nuestro compromiso ético es garantizar que cada adolescente reciba el acompañamiento más idóneo y profesional para sus requerimientos particulares.
          </Text>
        </View>

        <Text style={styles.directoryHeading}>Centros e Instituciones Recomendadas</Text>

        {/* List of recommended centers */}
        <View style={styles.institutionCard}>
          <View style={styles.instHeader}>
            <Ionicons name="school-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.instName}>Atención Psicológica UNAM (Facultad de Psicología)</Text>
          </View>
          <Text style={styles.instDesc}>
            Atención clínica especializada para adolescentes y familias, con terapeutas certificados.
          </Text>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => handleCall('5550250855')}
          >
            <Ionicons name="call" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.callBtnText}>Llamar al 55 5025 0855</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.institutionCard}>
          <View style={styles.instHeader}>
            <Ionicons name="call-outline" size={20} color={Colors.tertiary} style={{ marginRight: 8 }} />
            <Text style={styles.instName}>Línea de la Vida (CONASAMA)</Text>
          </View>
          <Text style={styles.instDesc}>
            Orientación telefónica gratuita las 24 horas los 365 días del año con cobertura en toda la República Mexicana.
          </Text>
          <TouchableOpacity
            style={[styles.callBtn, { backgroundColor: Colors.tertiary }]}
            onPress={() => handleCall('8009112000')}
          >
            <Ionicons name="call" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.callBtnText}>Llamar al 800 911 2000</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.emailDirectoryBtn}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="mail-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.emailDirectoryBtnText}>Enviar directorio completo a mi correo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeBtnText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>

      <EmergencyDirectoryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
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
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.secondaryContainer + '50',
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
  messageBox: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  messageText: {
    ...Typography.bodyMedium,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  directoryHeading: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  institutionCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '60',
  },
  instHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  instName: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    flex: 1,
  },
  instDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  callBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  callBtnText: {
    ...Typography.labelMedium,
    color: '#ffffff',
    fontWeight: '700',
  },
  emailDirectoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryContainer + '40',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    marginTop: Spacing.md,
  },
  emailDirectoryBtnText: {
    ...Typography.labelMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  homeBtn: {
    marginTop: Spacing.md,
    paddingVertical: 10,
  },
  homeBtnText: {
    ...Typography.labelMedium,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
});

