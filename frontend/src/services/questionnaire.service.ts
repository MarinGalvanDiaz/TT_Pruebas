import { Platform } from 'react-native';
import { apiClient } from '../api/client';
import { Endpoints } from '../api/endpoints';
import {
  QuestionnaireBattery,
  QuestionnaireProgress,
  QuestionnaireResult,
  SubmitQuestionnairePayload,
} from '../types/questionnaire.types';
import { ApiResponse } from '../types/auth.types';

const LOCAL_DRAFT_PREFIX = 'liberate_questionnaire_draft_';
let memoryDraftCache: Record<string, QuestionnaireProgress> = {};

const normalizeNumericMap = (raw?: Record<any, any>): Record<number, number> => {
  if (!raw || typeof raw !== 'object') return {};
  const result: Record<number, number> = {};
  Object.entries(raw).forEach(([k, v]) => {
    const numKey = Number(k);
    const numVal = Number(v);
    if (!Number.isNaN(numKey) && !Number.isNaN(numVal)) {
      result[numKey] = numVal;
    }
  });
  return result;
};

export const QuestionnaireService = {
  /**
   * Obtiene la batería completa de los 4 instrumentos clínicos
   */
  async getInitialBattery(): Promise<QuestionnaireBattery> {
    const response = await apiClient.get<QuestionnaireBattery>(
      Endpoints.questionnaires.initial
    );
    return response.data;
  },

  /**
   * Verifica si el usuario actual ya completó su evaluación inicial
   */
  async getStatus(): Promise<boolean> {
    const response = await apiClient.get<{ completed: boolean }>(
      Endpoints.questionnaires.status
    );
    return response.data.completed;
  },

  /**
   * Recupera el progreso guardado del adolescente en el backend
   */
  async getProgress(): Promise<QuestionnaireProgress | null> {
    try {
      const response = await apiClient.get<ApiResponse<QuestionnaireProgress>>(
        Endpoints.questionnaires.progress
      );
      if (response.data?.success && response.data.data) {
        const d = response.data.data;
        return {
          ...d,
          cmasr2Answers: normalizeNumericMap(d.cmasr2Answers),
          baiyAnswers: normalizeNumericMap(d.baiyAnswers),
          ebisAnswers: normalizeNumericMap(d.ebisAnswers),
          derseAnswers: normalizeNumericMap(d.derseAnswers),
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Guarda automáticamente las respuestas parciales y la pregunta actual en el backend
   */
  async saveProgress(
    payload: SubmitQuestionnairePayload
  ): Promise<QuestionnaireProgress | null> {
    const response = await apiClient.put<ApiResponse<QuestionnaireProgress>>(
      Endpoints.questionnaires.saveProgress,
      payload
    );
    return response.data?.data || null;
  },

  /**
   * Guarda un respaldo local instantáneo (localStorage en web / memoria en nativo)
   * para que aún si el usuario actualiza la página inmediatamente no pierda su selección
   */
  saveLocalDraft(userKey: string, payload: SubmitQuestionnairePayload): void {
    const key = `${LOCAL_DRAFT_PREFIX}${userKey || 'current'}`;
    const draft: QuestionnaireProgress = {
      completed: false,
      status: 'EN_PROGRESO',
      currentInstrumentIndex: payload.currentInstrumentIndex ?? 0,
      currentQuestionIndex: payload.currentQuestionIndex ?? 0,
      cmasr2Answers: payload.cmasr2Answers || {},
      baiyAnswers: payload.baiyAnswers || {},
      ebisAnswers: payload.ebisAnswers || {},
      derseAnswers: payload.derseAnswers || {},
      updatedAt: new Date().toISOString(),
    };
    memoryDraftCache[key] = draft;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage?.setItem(key, JSON.stringify(draft));
      } catch {
        // Ignorar errores de cuota
      }
    }
  },

  /**
   * Obtiene el respaldo local instantáneo
   */
  getLocalDraft(userKey: string): QuestionnaireProgress | null {
    const key = `${LOCAL_DRAFT_PREFIX}${userKey || 'current'}`;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage?.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...parsed,
            cmasr2Answers: normalizeNumericMap(parsed.cmasr2Answers),
            baiyAnswers: normalizeNumericMap(parsed.baiyAnswers),
            ebisAnswers: normalizeNumericMap(parsed.ebisAnswers),
            derseAnswers: normalizeNumericMap(parsed.derseAnswers),
          };
        }
      } catch {
        // Ignorar errores de parseo
      }
    }
    return memoryDraftCache[key] || null;
  },

  /**
   * Limpia el borrador local una vez que se envía la evaluación completa
   */
  clearLocalDraft(userKey: string): void {
    const key = `${LOCAL_DRAFT_PREFIX}${userKey || 'current'}`;
    delete memoryDraftCache[key];
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage?.removeItem(key);
      } catch {
        // Ignorar
      }
    }
  },

  /**
   * Envía las respuestas acumuladas finales de los instrumentos clínicos
   */
  async submitInitial(
    payload: SubmitQuestionnairePayload
  ): Promise<QuestionnaireResult> {
    const response = await apiClient.post<ApiResponse<QuestionnaireResult>>(
      Endpoints.questionnaires.submit,
      payload
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al procesar la evaluación');
    }
    return response.data.data;
  },
};
