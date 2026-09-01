import { apiClient } from '../api/client';
import { Endpoints } from '../api/endpoints';
import { FaqItem, PartnerItem, TestimonialItem, ExerciseItem } from '../types/content.types';

// Mock data directly from the Stitch screens design
const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '¿Es completamente anónimo?',
    answer: 'Sí, tu privacidad es nuestra prioridad. No compartimos tus datos personales ni tus registros emocionales con terceros.',
  },
  {
    id: 'faq-2',
    question: '¿Puedo usarlo sin conexión?',
    answer: 'Algunas herramientas básicas y ejercicios de respiración están disponibles offline, pero se recomienda conexión a internet para la experiencia completa y sincronización.',
  },
  {
    id: 'faq-3',
    question: '¿Cómo me ayuda con mi bienestar?',
    answer: 'Libérate ofrece ejercicios guiados de respiración táctil, registro de estado de ánimo, y contacto con profesionales de la salud mental.',
  },
];

const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    type: 'Experiencia',
    content: '"Las olas me ayudan a calmarme cuando siento que todo es demasiado."',
    iconName: 'format-quote',
    author: 'Usuario anónimo',
  },
  {
    id: 'test-2',
    type: 'Novedad',
    content: "Nuevos ejercicios de respiración disponibles en la sección 'Aire'.",
    iconName: 'new-releases',
    author: 'Equipo Libérate',
  },
  {
    id: 'test-3',
    type: 'Experiencia',
    content: '"Tener un espacio seguro y sin juicios ha cambiado mi rutina diaria."',
    iconName: 'format-quote',
    author: 'Comunidad',
  },
];

const MOCK_PARTNERS: PartnerItem[] = [
  {
    id: 'p-1',
    name: 'Institución de Salud Mental 1',
    logoText: 'Alianza por la Salud Mental',
  },
  {
    id: 'p-2',
    name: 'Institución Educativa y Juvenil 2',
    logoText: 'Fundación Bienestar Joven',
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

  async getExercises(): Promise<ExerciseItem[]> {
    try {
      const response = await apiClient.get<ExerciseItem[]>(Endpoints.exercises.list);
      return response.data;
    } catch {
      return MOCK_EXERCISES;
    }
  },
};
