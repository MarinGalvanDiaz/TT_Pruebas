import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import EmergencyDirectoryModal from '../components/modules/EmergencyDirectoryModal';

interface Props {
  navigation: any;
  route?: any;
}

export const CriticalAlertScreen: React.FC<Props> = ({ navigation }) => {
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const isWeb = Platform.OS === 'web';

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      // In web or unsupported, modal directory shows numbers
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={[styles.mainWrapper, isWeb && styles.webWrapper]}>
        {/* 1. Header de Alerta Crítica */}
        <View style={styles.alertBanner}>
          <View style={styles.badgeRow}>
            <View style={styles.liveBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.badgeText}>Atención Prioritaria Activa</Text>
            </View>
          </View>

          <View style={styles.bannerContent}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="emergency" size={32} color={Colors.onError} />
            </View>
            <View style={styles.bannerTexts}>
              <Text style={styles.bannerTitle}>Tu bienestar es lo más importante</Text>
              <Text style={styles.bannerSubtitle}>
                Hemos detectado reactivos que indican que estás pasando por un momento muy difícil. No tienes que enfrentarlo solo/a.
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Tarjeta de Contención */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="favorite" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Estamos contigo aquí y ahora</Text>
          </View>
          <Text style={styles.cardBody}>
            Sentir que las emociones nos sobrepasan puede asustar, pero hay personas preparadas las 24 horas del día listas para escucharte sin juzgarte y ayudarte a encontrar calma.
          </Text>
        </View>

        {/* 3. Líneas de Crisis 24/7 de Contacto Inmediato */}
        <Text style={styles.sectionTitle}>Líneas de Ayuda Gratuita y Confidencial 24/7</Text>

        {/* Línea de la Vida */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => handleCall('8009112000')}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconBg, { backgroundColor: '#ffebee' }]}>
            <Ionicons name="call" size={24} color="#d32f2f" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Línea de la Vida (CONASAMA)</Text>
            <Text style={styles.contactNumber}>800 911 2000</Text>
            <Text style={styles.contactDesc}>Atención psicológica y en crisis. Gratuita y disponible 24/7 en todo México.</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>

        {/* SAPTEL */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => handleCall('5552598121')}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconBg, { backgroundColor: '#e3f2fd' }]}>
            <Ionicons name="call" size={24} color="#1976d2" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>SAPTEL (Consejo Psicológico)</Text>
            <Text style={styles.contactNumber}>55 5259 8121</Text>
            <Text style={styles.contactDesc}>Intervención en crisis emocional las 24 horas.</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>

        {/* 911 */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => handleCall('911')}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconBg, { backgroundColor: '#fff3e0' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#e65100" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Servicios de Emergencia</Text>
            <Text style={styles.contactNumber}>911</Text>
            <Text style={styles.contactDesc}>Atención inmediata ante cualquier riesgo físico inminente.</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>

        {/* 4. Acciones de regulación emocional y apoyo */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.breathingButton}
            onPress={() => navigation.navigate('Breathing')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="air" size={24} color={Colors.onSecondary} />
            <Text style={styles.breathingButtonText}>Hacer ejercicio de respiración guiada</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.directoryButton}
            onPress={() => setShowDirectoryModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="book-outline" size={20} color={Colors.primary} />
            <Text style={styles.directoryButtonText}>Ver directorio institucional completo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.homeButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>

      <EmergencyDirectoryModal
        visible={showDirectoryModal}
        onClose={() => setShowDirectoryModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.gutter,
    alignItems: 'center',
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 600,
  },
  webWrapper: {
    paddingVertical: 20,
  },
  alertBanner: {
    backgroundColor: Colors.errorContainer,
    borderRadius: BorderRadius.xl,
    padding: Spacing.safeMargin,
    marginBottom: Spacing.gutter,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceBright,
  },
  badgeText: {
    ...Typography.labelSm,
    color: Colors.onError,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTexts: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.headlineMd,
    color: Colors.onErrorContainer,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onErrorContainer,
    opacity: 0.9,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.lg,
    padding: Spacing.gutter,
    marginBottom: Spacing.safeMargin,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  cardBody: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  sectionTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '700',
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  contactIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '600',
    fontSize: 16,
  },
  contactNumber: {
    ...Typography.bodyLg,
    color: Colors.primary,
    fontWeight: '700',
    marginVertical: 2,
  },
  contactDesc: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  actionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  breathingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  breathingButtonText: {
    ...Typography.bodyLg,
    color: Colors.onSecondary,
    fontWeight: '600',
  },
  directoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  directoryButtonText: {
    ...Typography.bodyLg,
    color: Colors.primary,
    fontWeight: '600',
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  homeButtonText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
});
