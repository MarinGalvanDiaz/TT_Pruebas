import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius, Shadows } from '../theme/spacing';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { QuestionnaireService } from '../services/questionnaire.service';
import {
  QuestionnaireBattery,
  QuestionnaireItem,
  QuestionnaireOption,
  QuestionnaireProgress,
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isCompactMobile = width < 420;

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [battery, setBattery] = useState<QuestionnaireBattery | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [showSOSModal, setShowSOSModal] = useState(false);

  // Estado de evaluación completada (para no mostrar la última pregunta si ya terminaron)
  const [completedEvaluation, setCompletedEvaluation] =
    useState<QuestionnaireProgress | null>(null);

  // Navegación de instrumentos y preguntas
  const [currentInstrumentIndex, setCurrentInstrumentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Respuestas acumuladas
  const [cmasr2Answers, setCmasr2Answers] = useState<Record<number, number>>({});
  const [baiyAnswers, setBaiyAnswers] = useState<Record<number, number>>({});
  const [ebisAnswers, setEbisAnswers] = useState<Record<number, number>>({});
  const [derseAnswers, setDerseAnswers] = useState<Record<number, number>>({});

  // Redirigir a Login si no hay sesión iniciada
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigation.replace('Login');
    }
  }, [authLoading, isAuthenticated, navigation]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadBatteryAndProgress();
    }
  }, [authLoading, isAuthenticated]);

  const loadBatteryAndProgress = async () => {
    try {
      setLoading(true);
      const [batteryData, progressData] = await Promise.all([
        QuestionnaireService.getInitialBattery(),
        QuestionnaireService.getProgress().catch(() => null),
      ]);
      setBattery(batteryData);

      if (progressData) {
        if (progressData.cmasr2Answers) setCmasr2Answers(progressData.cmasr2Answers);
        if (progressData.baiyAnswers) setBaiyAnswers(progressData.baiyAnswers);
        if (progressData.ebisAnswers) setEbisAnswers(progressData.ebisAnswers);
        if (progressData.derseAnswers) setDerseAnswers(progressData.derseAnswers);

        // Si ya completó el tamizaje:
        if (
          progressData.completed ||
          progressData.status === 'COMPLETADO' ||
          progressData.status === 'ALERTA_CRITICA'
        ) {
          if (progressData.hasRedFlag || progressData.status === 'ALERTA_CRITICA') {
            navigation.replace('CriticalAlert');
            return;
          }
          setCompletedEvaluation(progressData);
          return;
        }

        // Restaurar instrumento y pregunta actual si estaba en progreso
        if (
          typeof progressData.currentInstrumentIndex === 'number' &&
          progressData.currentInstrumentIndex >= 0 &&
          progressData.currentInstrumentIndex < INSTRUMENT_ORDER.length
        ) {
          setCurrentInstrumentIndex(progressData.currentInstrumentIndex);
        }
        if (
          typeof progressData.currentQuestionIndex === 'number' &&
          progressData.currentQuestionIndex >= 0
        ) {
          setCurrentQuestionIndex(progressData.currentQuestionIndex);
        }
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        'No se pudieron cargar los cuestionarios iniciales. Revisa tu conexión.'
      );
    } finally {
      setLoading(false);
    }
  };

  const persistProgress = useCallback(
    async (
      nextInstrumentIdx: number,
      nextQuestionIdx: number,
      overrides?: {
        cmasr2?: Record<number, number>;
        baiy?: Record<number, number>;
        ebis?: Record<number, number>;
        derse?: Record<number, number>;
      }
    ) => {
      try {
        setAutoSaving(true);
        await QuestionnaireService.saveProgress({
          cmasr2Answers: overrides?.cmasr2 ?? cmasr2Answers,
          baiyAnswers: overrides?.baiy ?? baiyAnswers,
          ebisAnswers: overrides?.ebis ?? ebisAnswers,
          derseAnswers: overrides?.derse ?? derseAnswers,
          currentInstrumentIndex: nextInstrumentIdx,
          currentQuestionIndex: nextQuestionIdx,
        });
        const now = new Date();
        setLastSavedAt(
          now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        );
      } catch {
        // Silencioso en auto-save para no interrumpir al adolescente
      } finally {
        setAutoSaving(false);
      }
    },
    [cmasr2Answers, baiyAnswers, ebisAnswers, derseAnswers]
  );

  // Si aún está verificando sesión o no está autenticado
  if (authLoading || !isAuthenticated) {
    return (
      <View style={styles.outerCanvas}>
        {isWeb ? (
          <WebHeader
            activeScreen="AdolescentQuestionnaire"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        ) : (
          <TopAppBar title="Evaluación Inicial" />
        )}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Verificando sesión segura...</Text>
        </View>
      </View>
    );
  }

  if (loading || !battery) {
    return (
      <View style={styles.outerCanvas}>
        {isWeb ? (
          <WebHeader
            activeScreen="AdolescentQuestionnaire"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        ) : (
          <TopAppBar title="Evaluación Inicial" />
        )}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando preguntas de bienestar...</Text>
        </View>
      </View>
    );
  }

  // Vista de Resultados cuando el adolescente YA completó su tamizaje inicial
  if (completedEvaluation) {
    const isRisk =
      completedEvaluation.hasRedFlag ||
      completedEvaluation.status === 'ALERTA_CRITICA';

    if (isRisk) {
      return (
        <View style={styles.outerCanvas}>
          {isWeb ? (
            <WebHeader
              activeScreen="AdolescentQuestionnaire"
              onNavigate={(screen) => navigation.navigate(screen)}
            />
          ) : (
            <TopAppBar title="Apoyo Prioritario" />
          )}
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.resultsCard}>
              <View style={[styles.resultsIconCircle, { backgroundColor: Colors.errorContainer }]}>
                <MaterialIcons name="emergency" size={40} color={Colors.error} />
              </View>
              <Text style={styles.resultsTitle}>Atención Prioritaria y Emergencia</Text>
              <Text style={styles.resultsSubtitle}>
                Detectamos que podrías necesitar acompañamiento inmediato. No estás solo/a.
              </Text>
              <TouchableOpacity
                style={[styles.primaryActionButton, { backgroundColor: Colors.error, width: '100%' }]}
                onPress={() => navigation.replace('CriticalAlert')}
              >
                <MaterialIcons name="phone-in-talk" size={20} color="#ffffff" />
                <Text style={styles.primaryActionButtonText}>
                  Abrir Pestaña de Emergencia 24/7
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.outerCanvas}>
        {isWeb ? (
          <WebHeader
            activeScreen="AdolescentQuestionnaire"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        ) : (
          <TopAppBar title="Resultados de Evaluación" />
        )}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultsWrapper}>
            <View style={[styles.resultsCard, Shadows.soft]}>
              <View style={styles.completedBadge}>
                <MaterialIcons name="verified" size={16} color={Colors.primary} />
                <Text style={styles.completedBadgeText}>
                  Tamizaje Inicial Completado • Proyecto TT-A128
                </Text>
              </View>

              <View style={styles.resultsIconCircle}>
                <Ionicons name="checkmark-done-circle" size={48} color={Colors.primary} />
              </View>

              <Text style={styles.resultsTitle}>Resultados de tus Evaluaciones</Text>
              <Text style={styles.resultsSubtitle}>
                ¡Gracias por compartir cómo te sientes! Ya completaste tu batería de ingreso y tus respuestas quedaron registradas de forma confidencial.
              </Text>

              {/* Resumen de los 4 instrumentos */}
              <View style={styles.scoresGrid}>
                <View style={styles.scoreItemCard}>
                  <View style={styles.scoreHeaderRow}>
                    <MaterialIcons name="favorite-border" size={20} color={Colors.primary} />
                    <Text style={styles.scoreInstrumentName}>1. Sensaciones (CMASR-2)</Text>
                  </View>
                  <Text style={styles.scoreValueText}>
                    Puntaje registrado: {completedEvaluation.cmasr2Score ?? 0} pts
                  </Text>
                  <Text style={styles.scoreDescText}>
                    Explora tus sensaciones físicas y emocionales cotidianas.
                  </Text>
                </View>

                <View style={styles.scoreItemCard}>
                  <View style={styles.scoreHeaderRow}>
                    <MaterialIcons name="psychology" size={20} color={Colors.secondary} />
                    <Text style={styles.scoreInstrumentName}>2. Preocupaciones (BAI-Y)</Text>
                  </View>
                  <Text style={styles.scoreValueText}>
                    Puntaje registrado: {completedEvaluation.baiyScore ?? 0} pts
                  </Text>
                  <Text style={styles.scoreDescText}>
                    Identifica situaciones de tensión o inquietud en las últimas semanas.
                  </Text>
                </View>

                <View style={styles.scoreItemCard}>
                  <View style={styles.scoreHeaderRow}>
                    <MaterialIcons name="shield" size={20} color={Colors.tertiary} />
                    <Text style={styles.scoreInstrumentName}>3. Pensamientos (EBIS)</Text>
                  </View>
                  <Text style={styles.scoreValueText}>
                    Puntaje registrado: {completedEvaluation.ebisScore ?? 0} pts
                  </Text>
                  <Text style={styles.scoreDescText}>
                    Evaluación de bienestar interno y factores de protección.
                  </Text>
                </View>

                <View style={styles.scoreItemCard}>
                  <View style={styles.scoreHeaderRow}>
                    <MaterialIcons name="self-improvement" size={20} color={Colors.primary} />
                    <Text style={styles.scoreInstrumentName}>4. Claridad Emocional (DERS-E)</Text>
                  </View>
                  <Text style={styles.scoreValueText}>
                    Puntaje registrado: {completedEvaluation.derseScore ?? 0} pts
                  </Text>
                  <Text style={styles.scoreDescText}>
                    Conoce tus herramientas personales de regulación emocional.
                  </Text>
                </View>
              </View>

              <View style={styles.recommendationBanner}>
                <Ionicons name="sparkles" size={22} color={Colors.secondary} />
                <Text style={styles.recommendationText}>
                  Con base en tus respuestas, hemos preparado ejercicios de respiración táctica y seguimiento emocional adaptados para ti.
                </Text>
              </View>

              <View style={styles.resultsActionsCol}>
                <TouchableOpacity
                  style={styles.primaryActionButton}
                  onPress={() => navigation.navigate('Breathing')}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="air" size={20} color="#ffffff" />
                  <Text style={styles.primaryActionButtonText}>
                    Ir a Ejercicio de Respiración
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryResultButton}
                  onPress={() => navigation.navigate('Progress')}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="analytics" size={20} color={Colors.primary} />
                  <Text style={styles.secondaryResultButtonText}>Ver Mi Progreso</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.emergencyResultButton}
                  onPress={() => navigation.navigate('CriticalAlert')}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="phone-in-talk" size={18} color={Colors.error} />
                  <Text style={styles.emergencyResultButtonText}>
                    Pestaña de Emergencia y Apoyo 24/7
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backHomeLink}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.backHomeLinkText}>Volver al Inicio</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Footer />
        </ScrollView>
      </View>
    );
  }

  const currentInstrumentKey = INSTRUMENT_ORDER[currentInstrumentIndex] || 'CMASR2';
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

  const currentList = getInstrumentList(currentInstrumentKey);
  const safeQuestionIndex = Math.min(
    currentQuestionIndex,
    Math.max(0, currentList.length - 1)
  );
  const currentItem = currentList[safeQuestionIndex];
  const currentAnswers = getAnswersMap(currentInstrumentKey);
  const selectedValue = currentItem ? currentAnswers[currentItem.id] : undefined;

  const handleSelectOption = (value: number) => {
    if (!currentItem) return;
    const updated = { ...currentAnswers, [currentItem.id]: value };

    let nextCmasr2 = cmasr2Answers;
    let nextBaiy = baiyAnswers;
    let nextEbis = ebisAnswers;
    let nextDerse = derseAnswers;

    switch (currentInstrumentKey) {
      case 'CMASR2':
        nextCmasr2 = updated;
        setCmasr2Answers(updated);
        break;
      case 'BAI-Y':
        nextBaiy = updated;
        setBaiyAnswers(updated);
        break;
      case 'EBIS':
        nextEbis = updated;
        setEbisAnswers(updated);
        break;
      case 'DERS-E':
        nextDerse = updated;
        setDerseAnswers(updated);
        break;
    }

    // Guardar automáticamente al seleccionar respuesta
    persistProgress(currentInstrumentIndex, safeQuestionIndex, {
      cmasr2: nextCmasr2,
      baiy: nextBaiy,
      ebis: nextEbis,
      derse: nextDerse,
    });
  };

  const handleNext = () => {
    if (selectedValue === undefined) {
      Alert.alert(
        'Selección requerida',
        'Por favor selecciona una opción antes de continuar.'
      );
      return;
    }

    // Regla de Salto Condicional en EBIS:
    // Si estamos en EBIS y acabamos de responder el reactivo 5:
    // Verificamos si reactivo 4 es 0 y reactivo 5 es 0
    if (currentInstrumentKey === 'EBIS' && currentItem?.id === 5) {
      const ebis4 = ebisAnswers[4] ?? 0;
      const ebis5 = selectedValue;
      if (ebis4 === 0 && ebis5 === 0) {
        if (currentInstrumentIndex < INSTRUMENT_ORDER.length - 1) {
          const nextInst = currentInstrumentIndex + 1;
          setCurrentInstrumentIndex(nextInst);
          setCurrentQuestionIndex(0);
          persistProgress(nextInst, 0);
          return;
        }
      }
    }

    // Avance normal a la siguiente pregunta del instrumento actual
    if (safeQuestionIndex < currentList.length - 1) {
      const nextQ = safeQuestionIndex + 1;
      setCurrentQuestionIndex(nextQ);
      persistProgress(currentInstrumentIndex, nextQ);
    } else {
      // Fin del instrumento actual -> avanzar al siguiente o enviar
      if (currentInstrumentIndex < INSTRUMENT_ORDER.length - 1) {
        const nextInst = currentInstrumentIndex + 1;
        setCurrentInstrumentIndex(nextInst);
        setCurrentQuestionIndex(0);
        persistProgress(nextInst, 0);
      } else {
        submitAll();
      }
    }
  };

  const handlePrevious = () => {
    if (safeQuestionIndex > 0) {
      const prevQ = safeQuestionIndex - 1;
      setCurrentQuestionIndex(prevQ);
      persistProgress(currentInstrumentIndex, prevQ);
    } else if (currentInstrumentIndex > 0) {
      const prevInst = currentInstrumentIndex - 1;
      const prevKey = INSTRUMENT_ORDER[prevInst];
      const prevList = getInstrumentList(prevKey);
      const prevQ = Math.max(0, prevList.length - 1);
      setCurrentInstrumentIndex(prevInst);
      setCurrentQuestionIndex(prevQ);
      persistProgress(prevInst, prevQ);
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
        // Mostrar pantalla de resultados inmediatamente sin dejar visible la última pregunta
        const updatedProgress = await QuestionnaireService.getProgress().catch(() => null);
        setCompletedEvaluation(
          updatedProgress || {
            completed: true,
            status: 'COMPLETADO',
            hasRedFlag: false,
            currentInstrumentIndex: 3,
            currentQuestionIndex: 0,
            cmasr2Answers,
            baiyAnswers,
            ebisAnswers,
            derseAnswers,
            cmasr2Score: result.cmasr2Score,
            baiyScore: result.baiyScore,
            ebisScore: result.ebisScore,
            derseScore: result.derseScore,
          }
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

  const progressPercent = Math.min(
    100,
    Math.round((answeredSteps / Math.max(1, totalSteps)) * 100)
  );

  const isLastQuestion =
    currentInstrumentIndex === INSTRUMENT_ORDER.length - 1 &&
    safeQuestionIndex === currentList.length - 1;

  return (
    <View style={styles.outerCanvas}>
      {/* Header único con botón de salir (sin duplicarse en web móvil) */}
      {isWeb ? (
        <WebHeader
          activeScreen="AdolescentQuestionnaire"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      ) : (
        <TopAppBar title="Evaluación Inicial" />
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          isCompactMobile && styles.contentContainerMobile,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopLayout]}>
          {/* Columna Principal */}
          <View style={isDesktop ? styles.desktopMainColumn : styles.mobileMainColumn}>
            {/* Header Superior y Progreso */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperHeader}>
                <View style={styles.stepperNumberBadge}>
                  <Text style={styles.stepperNumberText}>
                    {currentInstrumentIndex + 1}
                  </Text>
                </View>
                <Text style={styles.stepperLabel}>
                  {meta.title} — Pregunta {safeQuestionIndex + 1} de {currentList.length}
                </Text>
              </View>

              <View style={styles.pillsRow}>
                <View style={styles.confidentialPill}>
                  <MaterialIcons
                    name="lock"
                    size={14}
                    color={Colors.onTertiaryContainer}
                  />
                  <Text style={styles.confidentialText}>
                    100% Confidencial • Proyecto TT-A128
                  </Text>
                </View>

                <View style={styles.autoSavePill}>
                  <MaterialIcons
                    name={autoSaving ? 'sync' : 'cloud-done'}
                    size={14}
                    color={Colors.primary}
                  />
                  <Text style={styles.autoSaveText}>
                    {autoSaving
                      ? 'Guardando...'
                      : lastSavedAt
                      ? `Guardado ${lastSavedAt}`
                      : 'Guardado automático'}
                  </Text>
                </View>
              </View>

              {/* Barra de progreso visual */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                />
              </View>
            </View>

            {/* Tarjeta de Acompañamiento Emocional */}
            <View style={styles.companionCard}>
              <View style={styles.companionTexts}>
                <Text style={styles.companionCategory}>
                  Evaluación de Bienestar Emocional
                </Text>
                <Text style={styles.companionTip}>{meta.tip}</Text>
              </View>
            </View>

            {/* Tarjeta de la Pregunta Actual */}
            {currentItem && (
              <View
                style={[
                  styles.questionCard,
                  isCompactMobile && styles.questionCardMobile,
                ]}
              >
                <View style={styles.questionHeader}>
                  <MaterialIcons
                    name="psychology-alt"
                    size={26}
                    color={Colors.primary}
                  />
                  <Text
                    style={[
                      styles.questionText,
                      isCompactMobile && styles.questionTextMobile,
                    ]}
                  >
                    {currentItem.text}
                  </Text>
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
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color={Colors.secondary}
                    />
                    <Text style={styles.feedbackText}>
                      Respuesta guardada:{' '}
                      <Text style={styles.feedbackBold}>{selectedValue}</Text>
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Botones de Navegación */}
            <View
              style={[
                styles.actionButtonsRow,
                isCompactMobile && styles.actionButtonsRowMobile,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.navButton,
                  safeQuestionIndex === 0 &&
                    currentInstrumentIndex === 0 &&
                    styles.navButtonDisabled,
                ]}
                onPress={handlePrevious}
                disabled={safeQuestionIndex === 0 && currentInstrumentIndex === 0}
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
                      {isLastQuestion ? 'Finalizar evaluación' : 'Siguiente'}
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

            {/* SOS Urgente Link */}
            <TouchableOpacity
              style={styles.sosLink}
              onPress={() => setShowSOSModal(true)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="phone-in-talk" size={18} color={Colors.error} />
              <Text style={styles.sosLinkText}>
                ¿Necesitas apoyo urgente? Toca aquí 24/7
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tarjetas de acompañamiento Pili y Técnica TIPP (En columna lateral en Desktop >=900px, o apiladas abajo en Móvil) */}
          <View style={isDesktop ? styles.desktopSidebar : styles.mobileSupportSection}>
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
                <Text style={styles.secureTagText}>
                  Espacio seguro de escucha activa
                </Text>
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
        </View>

        <EmergencyDirectoryModal
          visible={showSOSModal}
          onClose={() => setShowSOSModal(false)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.background,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    width: '100%',
  },
  contentContainer: {
    padding: Spacing.gutter,
    paddingBottom: 40,
    alignItems: 'center',
  },
  contentContainerMobile: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 12,
    padding: 24,
  },
  loadingText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 640,
  },
  desktopLayout: {
    maxWidth: 980,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    paddingVertical: 16,
  },
  mobileMainColumn: {
    width: '100%',
  },
  desktopMainColumn: {
    flex: 1,
  },
  desktopSidebar: {
    width: 310,
    gap: 16,
  },
  mobileSupportSection: {
    width: '100%',
    marginTop: 20,
    gap: 14,
  },
  stepperContainer: {
    marginBottom: 14,
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
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  confidentialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  confidentialText: {
    ...Typography.labelSm,
    color: Colors.onTertiaryContainer,
    fontWeight: '600',
    fontSize: 11,
  },
  autoSavePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer + '55',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  autoSaveText: {
    ...Typography.labelSm,
    color: Colors.primary,
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
    marginBottom: 14,
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
  questionCardMobile: {
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  questionText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '700',
    flex: 1,
    lineHeight: 26,
    fontSize: 19,
  },
  questionTextMobile: {
    fontSize: 17,
    lineHeight: 23,
  },
  instructionsText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 14,
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
    paddingHorizontal: 14,
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
    marginTop: 14,
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
    marginTop: 14,
    paddingVertical: 8,
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
    gap: 10,
    marginTop: 4,
  },
  actionButtonsRowMobile: {
    gap: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
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
    paddingHorizontal: 18,
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
    padding: 18,
    alignItems: 'center',
    gap: 10,
  },
  mascotCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '700',
    fontSize: 17,
  },
  sidebarDesc: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
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
    fontSize: 15,
  },
  tippDesc: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 18,
  },
  // Estilos para la vista de Resultados de Evaluación Completada
  resultsWrapper: {
    width: '100%',
    maxWidth: 680,
    paddingVertical: 16,
  },
  resultsCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    width: '100%',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginBottom: 14,
  },
  completedBadgeText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
    fontWeight: '700',
  },
  resultsIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryContainer + '50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  resultsSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  scoresGrid: {
    width: '100%',
    gap: 12,
    marginBottom: 18,
  },
  scoreItemCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '50',
    width: '100%',
  },
  scoreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scoreInstrumentName: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  scoreValueText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreDescText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  recommendationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer + '45',
    borderRadius: BorderRadius.lg,
    padding: 14,
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  recommendationText: {
    ...Typography.bodySm,
    color: Colors.onSecondaryContainer,
    flex: 1,
    lineHeight: 19,
  },
  resultsActionsCol: {
    width: '100%',
    gap: 10,
  },
  secondaryResultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  secondaryResultButtonText: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontWeight: '700',
  },
  emergencyResultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorContainer + '55',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  emergencyResultButtonText: {
    ...Typography.labelSm,
    color: Colors.error,
    fontWeight: '700',
  },
  backHomeLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backHomeLinkText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
});
