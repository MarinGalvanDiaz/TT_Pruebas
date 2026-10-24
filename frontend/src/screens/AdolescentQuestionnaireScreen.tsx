import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { QuestionnaireService } from '../services/questionnaire.service';
import {
  QuestionnaireBattery,
  QuestionnaireItem,
  QuestionnaireOption,
} from '../types/questionnaire.types';
import EmergencyDirectoryModal from '../components/modules/EmergencyDirectoryModal';

interface Props {
  navigation: any;
}

type InstrumentKey = 'CMASR2' | 'BAI-Y' | 'EBIS' | 'DERS-E';

const INSTRUMENT_ORDER: InstrumentKey[] = ['CMASR2', 'BAI-Y', 'EBIS', 'DERS-E'];

const INSTRUMENT_METADATA: Record<
  InstrumentKey,
  { title: string; subtitle: string; tip: string }
> = {
  CMASR2: {
    title: '1. Conociendo tus Sensaciones (CMASR-2)',
    subtitle: 'Responde Sí o No según cómo te has sentido habitualmente.',
    tip: 'No hay respuestas buenas ni malas; responde con total tranquilidad.',
  },
  'BAI-Y': {
    title: '2. Escala de Preocupaciones (BAI-Y)',
    subtitle: 'Elige qué tan seguido experimentas cada situación.',
    tip: 'Tómate un respiro. Piensa en tus últimas dos semanas.',
  },
  EBIS: {
    title: '3. Exploración de Pensamientos (EBIS)',
    subtitle: 'Queremos comprender profundamente cómo te sientes por dentro.',
    tip: 'Este es un espacio 100% seguro y confidencial. Estamos para cuidarte.',
  },
  'DERS-E': {
    title: '4. Claridad Emocional (DERS-E)',
    subtitle: 'Cuéntanos cómo te relacionas con tus emociones.',
    tip: 'Último paso. ¡Ya casi terminas tu evaluación de ingreso!',
  },
};

export const AdolescentQuestionnaireScreen: React.FC<Props> = ({ navigation }) => {
  const isWeb = Platform.OS === 'web';

  const [battery, setBattery] = useState<QuestionnaireBattery | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);

  // Navegación de instrumentos y preguntas
  const [currentInstrumentIndex, setCurrentInstrumentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Respuestas acumuladas
  const [cmasr2Answers, setCmasr2Answers] = useState<Record<number, number>>({});
  const [baiyAnswers, setBaiyAnswers] = useState<Record<number, number>>({});
  const [ebisAnswers, setEbisAnswers] = useState<Record<number, number>>({});
  const [derseAnswers, setDerseAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    loadBattery();
  }, []);

  const loadBattery = async () => {
    try {
      setLoading(true);
      const data = await QuestionnaireService.getInitialBattery();
      setBattery(data);
    } catch (err: any) {
      Alert.alert(
        'Error',
        'No se pudieron cargar los cuestionarios iniciales. Revisa tu conexión.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading || !battery) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando preguntas de bienestar...</Text>
      </View>
    );
  }

  const currentInstrumentKey = INSTRUMENT_ORDER[currentInstrumentIndex];
  const meta = INSTRUMENT_METADATA[currentInstrumentKey];

  const getInstrumentList = (key: InstrumentKey): QuestionnaireItem[] => {
    switch (key) {
      case 'CMASR2':
        return battery.cmasr2 || [];
      case 'BAI-Y':
        return battery.baiy || [];
      case 'EBIS':
        return battery.ebis || [];
      case 'DERS-E':
        return battery.derse || [];
    }
  };

  const getAnswersMap = (key: InstrumentKey): Record<number, number> => {
    switch (key) {
      case 'CMASR2':
        return cmasr2Answers;
      case 'BAI-Y':
        return baiyAnswers;
      case 'EBIS':
        return ebisAnswers;
      case 'DERS-E':
        return derseAnswers;
    }
  };

  const setAnswersMap = (key: InstrumentKey, newMap: Record<number, number>) => {
    switch (key) {
      case 'CMASR2':
        setCmasr2Answers(newMap);
        break;
      case 'BAI-Y':
        setBaiyAnswers(newMap);
        break;
      case 'EBIS':
        setEbisAnswers(newMap);
        break;
      case 'DERS-E':
        setDerseAnswers(newMap);
        break;
    }
  };

  const currentList = getInstrumentList(currentInstrumentKey);
  const currentItem = currentList[currentQuestionIndex];
  const currentAnswers = getAnswersMap(currentInstrumentKey);
  const selectedValue = currentItem ? currentAnswers[currentItem.id] : undefined;

  const handleSelectOption = (value: number) => {
    if (!currentItem) return;
    const updated = { ...currentAnswers, [currentItem.id]: value };
    setAnswersMap(currentInstrumentKey, updated);
  };

  const handleNext = () => {
    if (selectedValue === undefined) {
      Alert.alert('Selección requerida', 'Por favor selecciona una opción antes de continuar.');
      return;
    }

    // Regla de Salto Condicional en EBIS:
    // Si estamos en EBIS y acabamos de responder el reactivo 5 (índice 4):
    // Verificamos si reactivo 4 es 0 y reactivo 5 es 0
    if (currentInstrumentKey === 'EBIS' && currentItem.id === 5) {
      const ebis4 = ebisAnswers[4] ?? 0;
      const ebis5 = selectedValue;
      if (ebis4 === 0 && ebis5 === 0) {
        // Regla clínica de salto: concluir EBIS temprano y avanzar a DERS-E
        if (currentInstrumentIndex < INSTRUMENT_ORDER.length - 1) {
          setCurrentInstrumentIndex(currentInstrumentIndex + 1);
          setCurrentQuestionIndex(0);
          return;
        }
      }
    }

    // Avance normal a la siguiente pregunta del instrumento actual
    if (currentQuestionIndex < currentList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Fin del instrumento actual -> avanzar al siguiente o enviar
      if (currentInstrumentIndex < INSTRUMENT_ORDER.length - 1) {
        setCurrentInstrumentIndex(currentInstrumentIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Fin de la batería -> Enviar todo
        submitAll();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentInstrumentIndex > 0) {
      const prevKey = INSTRUMENT_ORDER[currentInstrumentIndex - 1];
      const prevList = getInstrumentList(prevKey);
      setCurrentInstrumentIndex(currentInstrumentIndex - 1);
      setCurrentQuestionIndex(prevList.length - 1);
    }
  };

  const submitAll = async () => {
    try {
      setSubmitting(true);
      const result = await QuestionnaireService.submitInitial({
        cmasr2Answers,
        baiyAnswers,
        ebisAnswers,
        derseAnswers,
      });

      if (result.hasRedFlag || result.status === 'ALERTA_CRITICA') {
        navigation.replace('CriticalAlert');
      } else {
        Alert.alert(
          '¡Evaluación completada!',
          result.message || 'Tus respuestas se han guardado correctamente.',
          [{ text: 'Comenzar en Libérate', onPress: () => navigation.replace('Home') }]
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Error al guardar',
        err.message || 'No se pudo guardar la evaluación. Intenta de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Cálculo de progreso porcentual
  const totalSteps =
    (battery.cmasr2?.length || 0) +
    (battery.baiy?.length || 0) +
    (battery.ebis?.length || 0) +
    (battery.derse?.length || 0);

  const answeredSteps =
    Object.keys(cmasr2Answers).length +
    Object.keys(baiyAnswers).length +
    Object.keys(ebisAnswers).length +
    Object.keys(derseAnswers).length;

  const progressPercent = Math.min(100, Math.round((answeredSteps / totalSteps) * 100));

  const isLastQuestion =
    currentInstrumentIndex === INSTRUMENT_ORDER.length - 1 &&
    currentQuestionIndex === currentList.length - 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={[styles.mainWrapper, isWeb && styles.webLayout]}>
        {/* Contenido Principal */}
        <View style={isWeb ? styles.webMainColumn : styles.mobileMainColumn}>
          {/* Header Superior y Progreso */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperHeader}>
              <View style={styles.stepperNumberBadge}>
                <Text style={styles.stepperNumberText}>{currentInstrumentIndex + 1}</Text>
              </View>
              <Text style={styles.stepperLabel}>
                {meta.title} — Pregunta {currentQuestionIndex + 1} de {currentList.length}
              </Text>
            </View>

            <View style={styles.confidentialPill}>
              <MaterialIcons name="lock" size={14} color={Colors.onTertiaryContainer} />
              <Text style={styles.confidentialText}>100% Confidencial y Seguro</Text>
            </View>

            {/* Barra de progreso visual */}
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Tarjeta de Acompañamiento Emocional */}
          <View style={styles.companionCard}>
            <View style={styles.companionTexts}>
              <Text style={styles.companionCategory}>Evaluación de Bienestar Emocional</Text>
              <Text style={styles.companionTip}>{meta.tip}</Text>
            </View>
          </View>

          {/* Tarjeta de la Pregunta Actual */}
          {currentItem && (
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <MaterialIcons name="psychology-alt" size={26} color={Colors.primary} />
                <Text style={styles.questionText}>{currentItem.text}</Text>
              </View>

              <Text style={styles.instructionsText}>
                Selecciona la opción que mejor describa tu experiencia:
              </Text>

              {/* Opciones según scaleType */}
              <View style={styles.optionsContainer}>
                {currentItem.options.map((opt: QuestionnaireOption) => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => handleSelectOption(opt.value)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.optionNumberCircle,
                          isSelected && styles.optionNumberCircleSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionNumberText,
                            isSelected && styles.optionNumberTextSelected,
                          ]}
                        >
                          {opt.value}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.optionLabelText,
                          isSelected && styles.optionLabelTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {isSelected && (
                        <MaterialIcons
                          name="check"
                          size={20}
                          color={Colors.onSecondaryContainer}
                          style={styles.checkIcon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Indicador de opción seleccionada */}
              {selectedValue !== undefined && (
                <View style={styles.feedbackPill}>
                  <MaterialIcons name="check-circle" size={18} color={Colors.secondary} />
                  <Text style={styles.feedbackText}>
                    Seleccionado: <Text style={styles.feedbackBold}>{selectedValue}</Text>
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* SOS Urgente Link */}
          <TouchableOpacity
            style={styles.sosLink}
            onPress={() => setShowSOSModal(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="phone-in-talk" size={18} color={Colors.error} />
            <Text style={styles.sosLinkText}>¿Necesitas apoyo urgente? Toca aquí 24/7</Text>
          </TouchableOpacity>

          {/* Botones de Navegación */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentQuestionIndex === 0 && currentInstrumentIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0 && currentInstrumentIndex === 0}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={20} color={Colors.outline} />
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleNext}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.primaryActionButtonText}>
                    {isLastQuestion ? 'Finalizar evaluación' : 'Siguiente pregunta'}
                  </Text>
                  <MaterialIcons
                    name={isLastQuestion ? 'check-circle' : 'arrow-forward'}
                    size={20}
                    color={Colors.onPrimary}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra Lateral Web (Mascota Pili y Técnica TIPP) */}
        {isWeb && (
          <View style={styles.webSidebar}>
            <View style={styles.sidebarCard}>
              <View style={styles.mascotCircle}>
                <Ionicons name="sparkles" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.sidebarTitle}>Pili te acompaña</Text>
              <Text style={styles.sidebarDesc}>
                “Nombrar lo que sientes no lo hace más difícil, te da espacio para respirar. No hay prisa aquí.”
              </Text>
              <View style={styles.secureTag}>
                <MaterialIcons name="shield" size={16} color={Colors.tertiary} />
                <Text style={styles.secureTagText}>Espacio seguro de escucha activa</Text>
              </View>
            </View>

            <View style={styles.tippCard}>
              <View style={styles.tippHeader}>
                <MaterialIcons name="air" size={20} color={Colors.secondary} />
                <Text style={styles.tippTitle}>Técnica TIPP rápida</Text>
              </View>
              <Text style={styles.tippDesc}>
                Si notas que el cuerpo se tensa durante las preguntas, inhala en 4 segundos y exhala en 8 segundos suavemente.
              </Text>
            </View>
          </View>
        )}
      </View>

      <EmergencyDirectoryModal
        visible={showSOSModal}
        onClose={() => setShowSOSModal(false)}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  loadingText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 600,
  },
  webLayout: {
    maxWidth: 960,
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 16,
  },
  mobileMainColumn: {
    width: '100%',
  },
  webMainColumn: {
    flex: 1,
  },
  webSidebar: {
    width: 320,
    gap: 16,
  },
  stepperContainer: {
    marginBottom: 16,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepperNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperNumberText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryFixed,
    fontWeight: '700',
  },
  stepperLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    flex: 1,
  },
  confidentialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.tertiaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginBottom: 12,
  },
  confidentialText: {
    ...Typography.labelSm,
    color: Colors.onTertiaryContainer,
    fontWeight: '600',
    fontSize: 11,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  companionCard: {
    backgroundColor: 'rgba(209, 196, 233, 0.25)',
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginBottom: 16,
  },
  companionTexts: {
    flex: 1,
  },
  companionCategory: {
    ...Typography.labelSm,
    color: Colors.secondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  companionTip: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
  questionCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  questionText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '700',
    flex: 1,
    lineHeight: 26,
  },
  instructionsText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: Colors.secondaryContainer,
    borderColor: Colors.secondary,
  },
  optionNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNumberCircleSelected: {
    backgroundColor: Colors.secondary,
  },
  optionNumberText: {
    ...Typography.labelSm,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  optionNumberTextSelected: {
    color: Colors.onSecondary,
  },
  optionLabelText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    flex: 1,
    fontWeight: '500',
  },
  optionLabelTextSelected: {
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  feedbackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainer,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginTop: 16,
    gap: 6,
  },
  feedbackText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  feedbackBold: {
    fontWeight: '700',
    color: Colors.primary,
  },
  sosLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 12,
    paddingVertical: 6,
  },
  sosLinkText: {
    ...Typography.labelSm,
    color: Colors.secondary,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainerHigh,
    gap: 6,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    ...Typography.bodyMd,
    color: Colors.outline,
    fontWeight: '600',
  },
  primaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionButtonText: {
    ...Typography.bodyLg,
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  sidebarCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  mascotCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  sidebarDesc: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
  },
  secureTagText: {
    ...Typography.labelSm,
    color: Colors.tertiary,
    fontWeight: '600',
  },
  tippCard: {
    backgroundColor: 'rgba(181, 231, 254, 0.35)',
    borderRadius: BorderRadius.xl,
    padding: 16,
    gap: 8,
  },
  tippHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tippTitle: {
    ...Typography.headlineMd,
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
    fontSize: 16,
  },
  tippDesc: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 18,
  },
});
