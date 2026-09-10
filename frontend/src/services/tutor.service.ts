import { apiClient } from '../api/client';
import { Endpoints } from '../api/endpoints';
import {
  InviteTutorPayload,
  ConfirmTutorDataPayload,
  TutorConsentPayload,
  TutorBlockAPayload,
  TutorBlockBPayload,
  TutorSymptomsPayload,
  TutorFlowStatus,
  SendDirectoryPayload,
} from '../types/tutor.types';
import { ApiResponse } from '../types/auth.types';

export const TutorService = {
  /**
   * Pantalla 03: Inicia invitación para tutor legal de menor de edad
   */
  async initiateInvite(payload: InviteTutorPayload): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.invite,
      payload
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 04 y 05: Reenvía correo de invitación (cooldown 2 min)
   */
  async resendInvite(token: string): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.resend,
      { token }
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Obtiene estado actual del flujo por token
   */
  async getStatus(token: string): Promise<TutorFlowStatus> {
    const response = await apiClient.get<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.status(token)
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 06 (Paso 1): Confirma teléfono y autorización de WhatsApp
   */
  async confirmData(payload: ConfirmTutorDataPayload): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.confirmData,
      payload
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 08 (Paso 2): Consentimiento informado firmado
   */
  async submitConsent(payload: TutorConsentPayload): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.consent,
      payload
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 09 (Paso 3, Bloque A): Datos del adolescente
   */
  async submitBlockA(payload: TutorBlockAPayload): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.blockA,
      payload
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 10 (Paso 3, Bloque B): Tamizaje clínico
   */
  async submitBlockB(payload: TutorBlockBPayload): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.blockB,
      payload
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 14 (Paso 4): Evaluación de síntomas
   */
  async submitSymptoms(payload: TutorSymptomsPayload): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.symptoms,
      payload
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 15: Conclusión y desbloqueo de cuenta del adolescente
   */
  async completeFlow(token: string): Promise<TutorFlowStatus> {
    const response = await apiClient.post<ApiResponse<TutorFlowStatus>>(
      Endpoints.tutorFlow.complete,
      { token }
    );
    return response.data.data! as TutorFlowStatus;
  },

  /**
   * Pantalla 12: Envía directorio por correo
   */
  async sendDirectory(payload: SendDirectoryPayload): Promise<void> {
    await apiClient.post<ApiResponse<void>>(
      Endpoints.tutorFlow.sendDirectory,
      payload
    );
  },
};
