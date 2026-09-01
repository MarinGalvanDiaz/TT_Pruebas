/**
 * Spring Boot Compatible DTOs & Types for Application Content
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface TestimonialItem {
  id: string;
  type: 'Experiencia' | 'Novedad';
  content: string;
  iconName: string;
  author?: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  logoText: string;
  websiteUrl?: string;
}

export interface ExerciseItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Aire' | 'Calma' | 'Cuerpo';
  durationSeconds: number;
  steps: string[];
}

export interface MoodLog {
  id: string;
  userId: string;
  moodLevel: number; // 1 to 5
  note?: string;
  createdAt: string;
}
