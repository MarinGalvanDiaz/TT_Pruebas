export type ClinicalAnswer = 'SI' | 'NO' | 'NO_SE';

export type DerivationType = 'NONE' | 'GENERAL' | 'PRIORITARIA';

export type TutorFlowState =
  | 'INVITACION_ENVIADA'
  | 'DATOS_CONFIRMADOS'
  | 'CONSENTIMIENTO_ACEPTADO'
  | 'CONSENTIMIENTO_RECHAZADO'
  | 'TAMIZAJE_COMPLETADO'
  | 'DERIVACION_GENERAL'
  | 'DERIVACION_PRIORITARIA'
  | 'SINTOMAS_COMPLETADOS'
  | 'FINALIZADO_DESBLOQUEADO';

export interface InviteTutorPayload {
  nombreAdolescente: string;
  edadAdolescente: number;
  emailTutor: string;
  emailAdolescente?: string;
}

export interface ConfirmTutorDataPayload {
  token: string;
  telefonoTutor: string;
  autorizaWhatsapp: boolean;
}

export interface TutorConsentPayload {
  token: string;
  nombreFirma: string;
  acepto: boolean;
}

export interface TutorBlockAPayload {
  token: string;
  nombreAdolescente: string;
  fechaNacimiento: string; // YYYY-MM-DD
  emailAdolescente: string;
  tieneDispositivo: boolean;
  nacionalidad?: string;
}

export interface TutorBlockBPayload {
  token: string;
  neurodesarrollo: ClinicalAnswer;
  atencionActual: ClinicalAnswer;
  otroDiagnostico: ClinicalAnswer;
  violencia: ClinicalAnswer;
}

export interface TutorSymptomsPayload {
  token: string;
  respuestasLikertJson: string;
}

export interface TutorFlowStatus {
  token?: string;
  estado: TutorFlowState;
  emailTutor: string;
  telefonoTutor?: string;
  autorizaWhatsapp: boolean;
  consentimientoFirmado: boolean;
  consentimientoFirmaNombre?: string;
  adolescenteNombre?: string;
  adolescenteFechaNacimiento?: string;
  adolescenteEdad?: number;
  adolescenteEmail?: string;
  adolescenteTieneDispositivo?: boolean;
  adolescenteNacionalidad?: string;
  derivacionTipo: DerivationType;
  cuentaDesbloqueada: boolean;
  expiresAt?: string;
  reenviosCount: number;
}

export interface SendDirectoryPayload {
  email: string;
  nombre?: string;
}

