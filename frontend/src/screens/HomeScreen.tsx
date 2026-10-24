import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { VideoPreviewCard } from '../components/modules/VideoPreviewCard';
import { AppDownloadBanner } from '../components/modules/AppDownloadBanner';
import { InsideFeaturesSection } from '../components/modules/InsideFeaturesSection';
import { NewsCarousel } from '../components/modules/NewsCarousel';
import { PartnersSection } from '../components/modules/PartnersSection';
import { FaqAccordion } from '../components/modules/FaqAccordion';
import { ContentService } from '../services/content.service';
import {
  FaqItem,
  PartnerItem,
  TestimonialItem,
  InsideFeatureItem,
} from '../types/content.types';
import { UserRole } from '../types/auth.types';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { setSelectedRole } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWeb = Platform.OS === 'web';

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [insideFeatures, setInsideFeatures] = useState<InsideFeatureItem[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const [sectionYMap, setSectionYMap] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const loadContent = async () => {
      const [f, t, p, feat] = await Promise.all([
        ContentService.getFaqs(),
        ContentService.getTestimonials(),
        ContentService.getPartners(),
        ContentService.getInsideFeatures(),
      ]);
      setFaqs(f);
      setTestimonials(t);
      setPartners(p);
      setInsideFeatures(feat);
    };
    loadContent();
  }, []);

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    navigation.navigate('Register');
  };

  const handleNavigateSection = (sectionId: string) => {
    const yPos = sectionYMap[sectionId];
    if (yPos !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yPos - 20, animated: true });
    }
  };

  const handleFeatureNavigation = (targetScreen?: string) => {
    if (targetScreen) {
      navigation.navigate(targetScreen);
    }
  };

  return (
    <View style={styles.outerCanvas}>
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        {/* Mobile top bar (mobile native / narrow screen) */}
        {!isDesktop && <TopAppBar title="Libérate" />}

        {/* Web Header for desktop / web browser */}
        {isWeb && (
          <WebHeader
            activeScreen="Home"
            onNavigate={(screen) => navigation.navigate(screen)}
            onNavigateSection={handleNavigateSection}
          />
        )}

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Hero Section with Reference Mockup Layout */}
          <View style={[styles.heroWrapper, isDesktop && styles.desktopHeroWrapper]}>
            <View style={[styles.heroContentContainer, isDesktop && styles.desktopHeroContent]}>
              {/* Left/Main Hero Texts */}
              <View style={[styles.heroTextSection, isDesktop && styles.desktopHeroTextSection]}>
                <View style={styles.heroBadge}>
                  <MaterialIcons name="spa" size={16} color={Colors.primary} />
                  <Text style={styles.heroBadgeText}>Acompañamiento Socioemocional</Text>
                </View>

                <Text style={[styles.heroTitle, isDesktop && styles.desktopHeroTitle]}>
                  Qué es Libérate, en qué consiste el proyecto.
                </Text>

                <Text style={[styles.heroSubtitle, isDesktop && styles.desktopHeroSubtitle]}>
                  Prevención y acompañamiento emocional para adolescentes y sus familias.
                </Text>

                {/* Call to Action: Role Selection */}
                <View style={styles.roleSelectionBox}>
                  <Text style={styles.roleSelectionPrompt}>Elige tu rol para comenzar:</Text>
                  <View style={[styles.rolesRow, isDesktop && styles.desktopRolesRow]}>
                    <TouchableOpacity
                      style={[styles.roleButton, styles.roleAdolescente, Shadows.soft]}
                      onPress={() => handleRoleSelection('ADOLESCENTES')}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={require('../../assets/images/mascot_skater.png')}
                        style={styles.roleThumb}
                      />
                      <Text style={styles.roleButtonText}>Soy adolescente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.roleButton, styles.roleFamilia, Shadows.soft]}
                      onPress={() => handleRoleSelection('FAMILIAS')}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={require('../../assets/images/mascots_teal_duo_crop.png')}
                        style={styles.roleThumb}
                      />
                      <Text style={styles.roleButtonText}>Soy familia</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.roleButton, styles.roleProfesional, Shadows.soft]}
                      onPress={() => handleRoleSelection('PSICOLOGOS')}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={require('../../assets/images/mascots_green_duo_crop.png')}
                        style={styles.roleThumb}
                      />
                      <Text style={styles.roleButtonText}>Soy profesional</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Right / Hero Video Explicativo */}
              <View style={[styles.heroVideoSection, isDesktop && styles.desktopHeroVideoSection]}>
                <VideoPreviewCard />
              </View>
            </View>
          </View>

          {/* Banner: Disponible como App (solo visible en versión web de escritorio) */}
          {isWeb && isDesktop && <AppDownloadBanner />}

          {/* Sección: Qué encontrarán dentro (Lecturas, Ejercicios, Seguimiento) */}
          <InsideFeaturesSection
            items={insideFeatures}
            onSelectItem={handleFeatureNavigation}
          />

          {/* Sección: Testimonios (Carrusel / Grid Responsivo) */}
          <NewsCarousel items={testimonials} />

          {/* Sección: Colaboradores e Instituciones (UNAM, IPN, LABPSIIT) */}
          <View
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              setSectionYMap((prev) => ({ ...prev, colaboradores: y }));
            }}
          >
            <PartnersSection partners={partners} />
          </View>

          {/* Sección: Preguntas Frecuentes */}
          <View
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              setSectionYMap((prev) => ({ ...prev, faqs: y }));
            }}
          >
            <FaqAccordion items={faqs} />
          </View>

          {/* Footer Completo */}
          <Footer />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.surface,
  },
  desktopContainer: {
    maxWidth: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  heroWrapper: {
    backgroundColor: Colors.primaryContainer,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    width: '100%',
    alignItems: 'center',
  },
  desktopHeroWrapper: {
    paddingHorizontal: 40,
    paddingTop: 36,
    paddingBottom: 48,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  heroContentContainer: {
    width: '100%',
    maxWidth: 1200,
    alignItems: 'center',
  },
  desktopHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 36,
  },
  heroTextSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  desktopHeroTextSection: {
    flex: 1,
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginBottom: 14,
  },
  heroBadgeText: {
    ...Typography.labelSmBold,
    color: Colors.onPrimaryContainer,
    fontSize: 12,
  },
  heroTitle: {
    ...Typography.displayHero,
    color: Colors.onPrimaryContainer,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 10,
  },
  desktopHeroTitle: {
    textAlign: 'left',
    fontSize: 34,
    lineHeight: 42,
    maxWidth: 580,
  },
  heroSubtitle: {
    ...Typography.bodyLg,
    color: Colors.onPrimaryContainer,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 480,
    fontSize: 15,
    lineHeight: 22,
  },
  desktopHeroSubtitle: {
    textAlign: 'left',
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 540,
  },
  roleSelectionBox: {
    width: '100%',
    alignItems: 'center',
  },
  roleSelectionPrompt: {
    ...Typography.headlineMd,
    color: Colors.onPrimaryContainer,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  rolesRow: {
    width: '100%',
    gap: 10,
  },
  desktopRolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    gap: 10,
    backgroundColor: '#ffffff',
  },
  roleAdolescente: {
    backgroundColor: '#ffffff',
  },
  roleFamilia: {
    backgroundColor: '#ffffff',
  },
  roleProfesional: {
    backgroundColor: '#ffffff',
  },
  roleThumb: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  roleButtonText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: '700',
  },
  heroVideoSection: {
    width: '100%',
    alignItems: 'center',
  },
  desktopHeroVideoSection: {
    flex: 1,
    maxWidth: 520,
    width: '100%',
  },
});

