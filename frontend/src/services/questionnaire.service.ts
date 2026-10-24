import { apiClient } from '../api/client';
import { Endpoints } from '../api/endpoints';
import {
  QuestionnaireBattery,
  QuestionnaireResult,
  SubmitQuestionnairePayload,
} from '../types/questionnaire.types';
import { ApiResponse } from '../types/auth.types';

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
   * Envía las respuestas acumuladas de los instrumentos clínicos
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

