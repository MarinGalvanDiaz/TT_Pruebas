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
  type?: 'Experiencia' | 'Novedad';
  content: string;
  author: string;
  role: string;
  iconName?: string;
  avatarColor?: string;
}

export interface InsideFeatureItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  screenTarget?: string;
  bgColor?: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  logoText: string;
  description?: string;
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

