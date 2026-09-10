import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform, Image } from 'react-native';
import { TopAppBar } from '../components/layout/TopAppBar';
import { WebHeader } from '../components/layout/WebHeader';
import { Footer } from '../components/layout/Footer';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Shadows, Spacing } from '../theme/spacing';

interface BreathingScreenProps {
  navigation: any;
}

export const BreathingScreen: React.FC<BreathingScreenProps> = ({ navigation }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhala' | 'Mantén' | 'Exhala' | 'Listo'>('Listo');
  const [scaleAnim] = useState(new Animated.Value(1));
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isActive) {
      const cycle = () => {
        setPhase('Inhala');
        Animated.timing(scaleAnim, {
          toValue: 1.45,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setPhase('Mantén');
          timer = setTimeout(() => {
            setPhase('Exhala');
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }).start(() => {
              if (isActive) {
                cycle();
              }
            });
          }, 4000);
        });
      };
      cycle();
    } else {
      setPhase('Listo');
      scaleAnim.setValue(1);
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <View style={styles.outerCanvas}>
      <View style={styles.container}>
        <TopAppBar title="Respirar - Aire" />
        {isWeb && (
          <WebHeader
            activeScreen="Breathing"
            onNavigate={(screen) => navigation.navigate(screen)}
          />
        )}

        <View style={styles.content}>
          <Text style={styles.title}>Ejercicio de Calma 4-4-4</Text>
          <Text style={styles.subtitle}>
            Sincroniza tu respiración con el círculo para reducir el estrés.
          </Text>

          <View style={styles.circleContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                Shadows.mascot,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Text style={styles.phaseText}>{phase}</Text>
            </Animated.View>
          </View>

          {/* Compañeros de Respiración Mascotas */}
          <View style={[styles.mascotCompanionCard, Shadows.soft]}>
            <Image
              source={require('../../assets/images/mascots_green_duo_crop.png')}
              style={styles.mascotGuideImage}
            />
            <View style={styles.mascotGuideTextWrap}>
              <Text style={styles.mascotGuideName}>Kiko & Zen te acompañan</Text>
              <Text style={styles.mascotGuideHint}>
                {phase === 'Inhala'
                  ? 'Inhala profundo llenando tus pulmones de aire fresco...'
                  : phase === 'Mantén'
                  ? 'Sostén la respiración y encuentra tu calma...'
                  : phase === 'Exhala'
                  ? 'Suelta todo el aire despacio y relaja tus hombros...'
                  : 'Presiona "Iniciar respiración" cuando estés listo.'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, Shadows.button]}
            onPress={() => setIsActive(!isActive)}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name={isActive ? 'pause' : 'play-arrow'}
              size={28}
              color={Colors.onPrimary}
            />
            <Text style={styles.actionButtonText}>
              {isActive ? 'Pausar ejercicio' : 'Iniciar respiración'}
            </Text>
          </TouchableOpacity>
        </View>

        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    backgroundColor: Colors.surface,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: Spacing.safeMargin,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 16,
  },
  circleContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.secondaryContainer,
    borderWidth: 3,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    ...Typography.headlineMd,
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
    fontSize: 20,
  },
  mascotCompanionCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    maxWidth: 380,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  mascotGuideImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  mascotGuideTextWrap: {
    flex: 1,
  },
  mascotGuideName: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontSize: 14,
    marginBottom: 2,
  },
  mascotGuideHint: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.xl,
    marginTop: 20,
  },
  actionButtonText: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
    fontSize: 16,
  },
});
