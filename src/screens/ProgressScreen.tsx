import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

const MOODS = [
  { level: 1, label: 'Abrumado', icon: 'sentiment-very-dissatisfied', color: '#ba1a1a' },
  { level: 2, label: 'Ansioso', icon: 'sentiment-dissatisfied', color: '#e65100' },
  { level: 3, label: 'Neutro', icon: 'sentiment-neutral', color: '#fbc02d' },
  { level: 4, label: 'En calma', icon: 'sentiment-satisfied', color: '#4a654e' },
  { level: 5, label: 'Radiante', icon: 'sentiment-very-satisfied', color: '#326578' },
];

const WEEK_HISTORY = [
  { day: 'Lun', level: 3, label: 'Neutro' },
  { day: 'Mar', level: 4, label: 'En calma' },
  { day: 'Mié', level: 4, label: 'En calma' },
  { day: 'Jue', level: 2, label: 'Ansioso' },
  { day: 'Vie', level: 5, label: 'Radiante' },
  { day: 'Sáb', level: 4, label: 'En calma' },
  { day: 'Dom', level: 5, label: 'Radiante' },
];

interface ProgressScreenProps {
  navigation: any;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(4);
  const [savedToday, setSavedToday] = useState(false);
  const isWeb = Platform.OS === 'web';

  const handleSaveMood = () => {
    setSavedToday(true);
    if (Platform.OS !== 'web') {
      Alert.alert('¡Registrado!', 'Gracias por cuidar de tu bienestar emocional hoy.');
    }
  };

  return (
    <View style={styles.outerCanvas}>
      <View style={styles.container}>
        <TopAppBar title="Mi Progreso" />
        {isWeb && (
          <WebHeader
            activeScreen="Progress"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Streak Banner */}
            <View style={[styles.streakCard, Shadows.soft]}>
              <View style={styles.streakIconWrapper}>
                <MaterialIcons name="local-fire-department" size={32} color="#f57c00" />
              </View>
              <View style={styles.streakInfo}>
                <Text style={styles.streakTitle}>Racha de 5 días</Text>
                <Text style={styles.streakSubtitle}>Cuidando de tu bienestar conscientemente.</Text>
              </View>
            </View>

            {/* Daily Mood Check-In */}
            <View style={[styles.card, Shadows.soft]}>
              <Text style={styles.cardTitle}>¿Cómo te sientes hoy?</Text>
              <Text style={styles.cardSubtitle}>
                Registrar tu emoción te ayuda a identificar patrones.
              </Text>

              <View style={styles.moodGrid}>
                {MOODS.map((mood) => {
                  const isSelected = selectedMood === mood.level;
                  return (
                    <TouchableOpacity
                      key={mood.level}
                      style={styles.moodItem}
                      onPress={() => {
                        setSelectedMood(mood.level);
                        setSavedToday(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.moodIconCircle,
                          isSelected && { backgroundColor: mood.color + '25', borderColor: mood.color, borderWidth: 2.5 },
                        ]}
                      >
                        <MaterialIcons
                          name={mood.icon as any}
                          size={32}
                          color={isSelected ? mood.color : Colors.onSurfaceVariant}
                        />
                      </View>
                      <Text
                        style={[
                          styles.moodLabel,
                          isSelected && { color: mood.color, fontWeight: '700' },
                        ]}
                      >
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[
                  styles.saveMoodBtn,
                  savedToday && styles.savedBtn,
                ]}
                onPress={handleSaveMood}
                activeOpacity={0.85}
              >
                <Text style={styles.saveMoodBtnText}>
                  {savedToday ? '✓ Registrado hoy' : 'Guardar estado de ánimo'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Weekly Overview */}
            <View style={[styles.card, Shadows.soft]}>
              <Text style={styles.cardTitle}>Resumen semanal</Text>
              <View style={styles.weekChart}>
                {WEEK_HISTORY.map((item, idx) => (
                  <View key={idx} style={styles.dayCol}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: item.level * 22,
                          backgroundColor:
                            item.level >= 4
                              ? Colors.tertiary
                              : item.level === 3
                              ? Colors.secondary
                              : '#e65100',
                        },
                      ]}
                    />
                    <Text style={styles.dayText}>{item.day}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Suggested Activity */}
            <View style={[styles.card, styles.highlightCard, Shadows.soft]}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="air" size={24} color={Colors.primary} />
                <Text style={styles.highlightTitle}>Recomendado para ti</Text>
              </View>
              <Text style={styles.highlightDesc}>
                Completa una sesión de 3 minutos de respiración guiada para mantener tu calma.
              </Text>
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => navigation.navigate('Breathing')}
              >
                <Text style={styles.actionPillText}>Ir a Respirar →</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Footer />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Spacing.maxWidth,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: Spacing.safeMargin,
    paddingTop: 20,
    gap: 16,
  },
  streakCard: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: BorderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  streakIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    ...Typography.headlineMd,
    color: Colors.onSecondaryContainer,
  },
  streakSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSecondaryContainer,
    opacity: 0.9,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  cardTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodItem: {
    alignItems: 'center',
    gap: 6,
  },
  moodIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: {
    ...Typography.labelSm,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  saveMoodBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  savedBtn: {
    backgroundColor: Colors.tertiary,
  },
  saveMoodBtnText: {
    ...Typography.labelSmBold,
    color: Colors.onPrimary,
    fontSize: 14,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    paddingBottom: 8,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  barFill: {
    width: 24,
    borderRadius: BorderRadius.sm,
  },
  dayText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  highlightCard: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primary,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  highlightTitle: {
    ...Typography.headlineMd,
    color: Colors.onPrimaryContainer,
  },
  highlightDesc: {
    ...Typography.bodyMd,
    color: Colors.onPrimaryContainer,
    marginBottom: 12,
  },
  actionPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
  },
  actionPillText: {
    ...Typography.labelSmBold,
    color: Colors.onPrimary,
  },
});
