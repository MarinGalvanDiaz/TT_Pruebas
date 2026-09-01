import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
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
    backgroundColor: Colors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Spacing.maxWidth,
    backgroundColor: Colors.surface,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: Spacing.safeMargin,
    alignItems: 'center',
    paddingTop: 32,
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 36,
  },
  circleContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  breathingCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
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
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.xl,
    marginTop: 32,
  },
  actionButtonText: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
    fontSize: 16,
  },
});
