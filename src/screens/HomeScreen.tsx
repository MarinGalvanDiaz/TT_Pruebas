import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { GradientButton } from '../components/common/GradientButton';
import { VideoPreviewCard } from '../components/modules/VideoPreviewCard';
import { NewsCarousel } from '../components/modules/NewsCarousel';
import { PartnersSection } from '../components/modules/PartnersSection';
import { FaqAccordion } from '../components/modules/FaqAccordion';
import { ContentService } from '../services/content.service';
import { FaqItem, PartnerItem, TestimonialItem } from '../types/content.types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Spacing } from '../theme/spacing';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    const loadContent = async () => {
      const [f, t, p] = await Promise.all([
        ContentService.getFaqs(),
        ContentService.getTestimonials(),
        ContentService.getPartners(),
      ]);
      setFaqs(f);
      setTestimonials(t);
      setPartners(p);
    };
    loadContent();
  }, []);

  return (
    <View style={styles.outerCanvas}>
      <View style={styles.container}>
        <TopAppBar title="Libérate" />
        {isWeb && (
          <WebHeader
            activeScreen="Home"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero / Bienvenida Section */}
          <View style={styles.heroSection}>
            <View style={styles.mascotContainer}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc4p0DHjbu2Tpsui2dWxd7tLeF9-gWKj36yldaXTBLaFNrkWyJRcK60-We95KXNeiO2KThBsmMTD0g-mdAvyYhcgnly5ENDhTyVzEeYDFswEYJa4wmjfBK_fgvWpTyCt6ZdfU8Jm-RofPI3ANAo-eKY08g3fzufUKDDNPxX6B6GiiE-4gvmB9GggXEmd6gcc1Zu_H36iy6vNYvlmBRkE_fioCtnQfNFDir4wE2MClWnqrgGNQg2DqaZQ',
                }}
                style={styles.mascotImage}
              />
            </View>

            <Text style={styles.heroTitle}>Tu espacio seguro para sentirte mejor.</Text>

            <Text style={styles.heroSubtitle}>
              Descubre herramientas creadas para acompañarte en cada momento, sin juicios.
            </Text>

            <GradientButton
              title="Comenzar ahora"
              uppercase
              onPress={() => navigation.navigate('Register')}
              style={styles.heroButton}
            />
          </View>

          {/* Video de Bienvenida */}
          <View style={styles.sectionWrapper}>
            <VideoPreviewCard />
          </View>

          {/* Carrusel de Noticias y Experiencias */}
          <NewsCarousel items={testimonials} />

          {/* Instituciones Respaldantes */}
          <PartnersSection partners={partners} />

          {/* Preguntas Frecuentes */}
          <FaqAccordion items={faqs} />

          {/* Footer */}
          <Footer />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Spacing.maxWidth,
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroSection: {
    backgroundColor: Colors.primaryContainer,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: Spacing.safeMargin,
    paddingTop: 32,
    paddingBottom: 36,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mascotContainer: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 90,
    height: 90,
    opacity: 0.85,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  heroTitle: {
    ...Typography.displayHero,
    color: Colors.onPrimaryContainer,
    textAlign: 'center',
    marginBottom: 12,
    zIndex: 1,
  },
  heroSubtitle: {
    ...Typography.bodyLg,
    color: Colors.onPrimaryContainer,
    opacity: 0.85,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 340,
    zIndex: 1,
  },
  heroButton: {
    minWidth: 200,
    zIndex: 1,
  },
  sectionWrapper: {
    paddingHorizontal: Spacing.safeMargin,
  },
});
