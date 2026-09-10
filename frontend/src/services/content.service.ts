import { apiClient } from '../api/client';
import { Endpoints } from '../api/endpoints';
import {
  FaqItem,
  PartnerItem,
  TestimonialItem,
  ExerciseItem,
  InsideFeatureItem,
} from '../types/content.types';

// Mock data directly aligned with the landing page design document
const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '¿Qué es Libérate y en qué consiste el proyecto?',
    answer:
      'Libérate es una iniciativa de investigación y desarrollo tecnológico enfocada en la prevención y el acompañamiento emocional de adolescentes y sus familias, ofreciendo herramientas accesibles y contenidos especializados.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: '¿Es completamente anónimo y confidencial?',
    answer:
      'Sí, la privacidad es fundamental. Los registros personales y actividades emocionales se gestionan bajo estrictos protocolos de protección de datos.',
    category: 'Privacidad',
  },
  {
    id: 'faq-3',
    question: '¿Quiénes respaldan la investigación?',
    answer:
      'Cuenta con la colaboración y respaldo de investigadoras e investigadores de la UNAM, el IPN y el LABPSIIT, gracias al Programa UNAM-PAPIME (PE309026).',
    category: 'Institucional',
  },
  {
    id: 'faq-4',
    question: '¿Cómo puedo acceder desde mi celular?',
    answer:
      'Puedes usar esta versión web responsiva directamente en cualquier navegador o descargar la app disponible para iOS en App Store y para Android en Google Play.',
    category: 'Uso',
  },
];

const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    type: 'Experiencia',
    content:
      'Testimonio de una familia sobre su experiencia con Libérate: Nos ha brindado herramientas claras para comunicarnos mejor y comprender los momentos difíciles sin juzgarnos.',
    author: 'Familia Martínez',
    role: 'Familia participante',
    iconName: 'people',
    avatarColor: '#b4d2b6',
  },
  {
    id: 'test-2',
    type: 'Experiencia',
    content:
      'Testimonio de un profesional sobre su experiencia con Libérate: Es un recurso clínico y pedagógico invaluable para el acompañamiento socioemocional y la psicoeducación.',
    author: 'Dra. Gabriela Soto',
    role: 'Profesional en Psicología Clínica',
    iconName: 'psychology',
    avatarColor: '#b5e7fe',
  },
  {
    id: 'test-3',
    type: 'Experiencia',
    content:
      'Encontrar ejercicios de respiración guiada y lecturas pensadas para lo que sentimos me ayudó a recuperar la calma en momentos de mucha presión escolar.',
    author: 'Mateo R.',
    role: 'Adolescente (16 años)',
    iconName: 'face',
    avatarColor: '#d1c4e9',
  },
];

const MOCK_PARTNERS: PartnerItem[] = [
  {
    id: 'p-unam',
    name: 'Universidad Nacional Autónoma de México',
    logoText: 'UNAM',
    description: 'Facultad de Psicología y Dirección General de Asuntos del Personal Académico (DGAPA)',
    websiteUrl: 'https://www.unam.mx',
  },
  {
    id: 'p-ipn',
    name: 'Instituto Politécnico Nacional',
    logoText: 'IPN',
    description: 'Investigación y Colaboración Tecnológica Interinstitucional',
    websiteUrl: 'https://www.ipn.mx',
  },
  {
    id: 'p-labpsiit',
    name: 'Laboratorio de Psicología e Innovación Tecnológica',
    logoText: 'LABPSIIT',
    description: 'Desarrollo de Soluciones Digitales en Salud Mental',
    websiteUrl: 'https://labpsiit.unam.mx',
  },
];

const MOCK_INSIDE_FEATURES: InsideFeatureItem[] = [
  {
    id: 'feat-lecturas',
    title: 'Lecturas',
    subtitle: 'Contenidos por rol',
    iconName: 'menu-book',
    screenTarget: 'Register',
    bgColor: '#d1c4e9',
  },
  {
    id: 'feat-ejercicios',
    title: 'Ejercicios',
    subtitle: 'Actividades prácticas',
    iconName: 'self-improvement',
    screenTarget: 'Breathing',
    bgColor: '#b5e7fe',
  },
  {
    id: 'feat-seguimiento',
    title: 'Seguimiento',
    subtitle: 'Progreso personal',
    iconName: 'insights',
    screenTarget: 'Progress',
    bgColor: '#b4d2b6',
  },
];

const MOCK_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex-1',
    title: 'Respiración 4-4-4 (Caja)',
    subtitle: 'Regula tu ritmo cardíaco y calma la ansiedad',
    category: 'Aire',
    durationSeconds: 180,
    steps: ['Inhala profundamente (4s)', 'Mantén el aire (4s)', 'Exhala lentamente (4s)', 'Descansa (4s)'],
  },
  {
    id: 'ex-2',
    title: 'Respiración Profunda 4-7-8',
    subtitle: 'Ideal para conciliar el sueño y reducir estrés',
    category: 'Calma',
    durationSeconds: 240,
    steps: ['Inhala por la nariz (4s)', 'Retén el aire (7s)', 'Exhala completamente por la boca (8s)'],
  },
];

export const ContentService = {
  async getFaqs(): Promise<FaqItem[]> {
    try {
      const response = await apiClient.get<FaqItem[]>(Endpoints.content.faqs);
      return response.data;
    } catch {
      return MOCK_FAQS;
    }
  },

  async getTestimonials(): Promise<TestimonialItem[]> {
    try {
      const response = await apiClient.get<TestimonialItem[]>(Endpoints.content.testimonials);
      return response.data;
    } catch {
      return MOCK_TESTIMONIALS;
    }
  },

  async getPartners(): Promise<PartnerItem[]> {
    try {
      const response = await apiClient.get<PartnerItem[]>(Endpoints.content.partners);
      return response.data;
    } catch {
      return MOCK_PARTNERS;
    }
  },

  async getInsideFeatures(): Promise<InsideFeatureItem[]> {
    return MOCK_INSIDE_FEATURES;
  },

  async getExercises(): Promise<ExerciseItem[]> {
    try {
      const response = await apiClient.get<ExerciseItem[]>(Endpoints.exercises.list);
      return response.data;
    } catch {
      return MOCK_EXERCISES;
    }
  },
};

