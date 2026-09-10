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

export default function TutorDerivationPriorityScreen() {
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
          <Ionicons name="warning" size={44} color={Colors.error} />
        </View>

        <Text style={styles.title}>Esto necesita atención ahora</Text>
        <Text style={styles.subtitle}>
          UNAM · IPN · LABPSIIT • Protocolo de Urgencia Clínica
        </Text>

        <View style={styles.alertBanner}>
          <Ionicons name="alert-circle" size={24} color={Colors.error} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertBannerTitle}>Atención prioritaria requerida</Text>
            <Text style={styles.alertBannerText}>
              A partir de las respuestas registradas, hemos detectado una situación que requiere atención profesional inmediata fuera de una plataforma digital.
            </Text>
          </View>
        </View>

        <View style={styles.teamNotice}>
          <Ionicons name="time" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.teamNoticeText}>
            Nuestro equipo clínico se comunicará contigo en un plazo <Text style={{ fontWeight: '700' }}>menor a 24 horas</Text> al teléfono registrado para brindarte orientación y seguimiento prioritario.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>Líneas Gratuitas de Emergencia (24 Horas):</Text>

        {/* 911 */}
        <TouchableOpacity
          style={[styles.urgentCard, { borderColor: Colors.error }]}
          onPress={() => handleCall('911')}
          activeOpacity={0.8}
        >
          <View style={styles.urgentRow}>
            <View style={[styles.urgentIcon, { backgroundColor: Colors.errorContainer }]}>
              <Ionicons name="call" size={22} color={Colors.error} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.urgentName}>Emergencias Nacionales</Text>
              <Text style={styles.urgentPhone}>🚨 911</Text>
              <Text style={styles.urgentDesc}>Riesgo vital, violencia activa o peligro físico inminente.</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Línea de la Vida */}
        <TouchableOpacity
          style={styles.urgentCard}
          onPress={() => handleCall('8009112000')}
          activeOpacity={0.8}
        >
          <View style={styles.urgentRow}>
            <View style={[styles.urgentIcon, { backgroundColor: Colors.primaryContainer + '60' }]}>
              <Ionicons name="heart" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.urgentName}>Línea de la Vida (CONASAMA)</Text>
              <Text style={styles.urgentPhone}>📞 800 911 2000</Text>
              <Text style={styles.urgentDesc}>Atención psicológica y contención en crisis las 24 horas.</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* SAPTEL */}
        <TouchableOpacity
          style={styles.urgentCard}
          onPress={() => handleCall('5552598121')}
          activeOpacity={0.8}
        >
          <View style={styles.urgentRow}>
            <View style={[styles.urgentIcon, { backgroundColor: Colors.secondaryContainer + '60' }]}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.urgentName}>SAPTEL Cruz Roja Mexicana</Text>
              <Text style={styles.urgentPhone}>📞 55 5259 8121</Text>
              <Text style={styles.urgentDesc}>Apoyo y consejo psicológico telefónico las 24 horas.</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.directoryBtn}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="list" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.directoryBtnText}>Ver y Enviar Directorio Completo</Text>
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
    backgroundColor: Colors.errorContainer + '80',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.headlineMedium,
    color: Colors.error,
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.errorContainer + '40',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  alertBannerTitle: {
    ...Typography.titleSmall,
    color: Colors.onErrorContainer,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertBannerText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  teamNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer + '30',
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  teamNoticeText: {
    ...Typography.bodySmall,
    color: Colors.onSurface,
    flex: 1,
    lineHeight: 18,
  },
  sectionHeading: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  urgentCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant + '60',
  },
  urgentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  urgentName: {
    ...Typography.titleSmall,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  urgentPhone: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontWeight: '700',
    marginVertical: 2,
  },
  urgentDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },
  directoryBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    marginTop: Spacing.md,
  },
  directoryBtnText: {
    ...Typography.labelMedium,
    color: '#ffffff',
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

