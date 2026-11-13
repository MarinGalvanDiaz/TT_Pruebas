export interface QuestionnaireOption {
  label: string;
  value: number;
}

export interface QuestionnaireItem {
  id: number;
  instrument: 'CMASR2' | 'BAI-Y' | 'EBIS' | 'DERS-E';
  text: string;
  scaleType: 'YES_NO' | 'LIKERT_0_3' | 'EBIS_OPTIONS' | 'LIKERT_1_5';
  options: QuestionnaireOption[];
  subscale: string;
  isCritical: boolean;
  isInverted: boolean;
}

export interface QuestionnaireBattery {
  cmasr2: QuestionnaireItem[];
  baiy: QuestionnaireItem[];
  ebis: QuestionnaireItem[];
  derse: QuestionnaireItem[];
  totalQuestions: number;
}

export interface SubmitQuestionnairePayload {
  cmasr2Answers: Record<number, number>;
  baiyAnswers: Record<number, number>;
  ebisAnswers: Record<number, number>;
  derseAnswers: Record<number, number>;
  currentInstrumentIndex?: number;
  currentQuestionIndex?: number;
}

export interface QuestionnaireProgress {
  completed: boolean;
  status: 'NO_INICIADO' | 'EN_PROGRESO' | 'COMPLETADO' | 'ALERTA_CRITICA';
  hasRedFlag?: boolean;
  currentInstrumentIndex: number;
  currentQuestionIndex: number;
  cmasr2Answers: Record<number, number>;
  baiyAnswers: Record<number, number>;
  ebisAnswers: Record<number, number>;
  derseAnswers: Record<number, number>;
  cmasr2Score?: number;
  cmasr2DefScore?: number;
  cmasr2IncScore?: number;
  baiyScore?: number;
  ebisScore?: number;
  derseScore?: number;
  derseF1?: number;
  derseF2?: number;
  derseF3?: number;
  derseF4?: number;
}

export interface QuestionnaireResult {
  status: 'COMPLETADO' | 'ALERTA_CRITICA';
  hasRedFlag: boolean;
  cmasr2Score: number;
  cmasr2DefScore: number;
  cmasr2IncScore: number;
  baiyScore: number;
  ebisScore: number;
  derseScore: number;
  derseF1: number;
  derseF2: number;
  derseF3: number;
  derseF4: number;
  message: string;
}
