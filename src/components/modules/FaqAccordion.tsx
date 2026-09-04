import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FaqItem } from '../../types/content.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <View style={styles.headingWrap}>
        <Text style={styles.title}>Preguntas Frecuentes</Text>
        <Text style={styles.subtitle}>
          Resolvemos tus dudas sobre confidencialidad, funcionamiento y respaldo científico.
        </Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <View key={item.id} style={[styles.faqCard, Shadows.soft, isOpen && styles.faqCardOpen]}>
              <TouchableOpacity
                style={styles.questionHeader}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
              >
                <View style={styles.questionLeft}>
                  <MaterialIcons
                    name="help-outline"
                    size={20}
                    color={isOpen ? Colors.primary : Colors.onSurfaceVariant}
                  />
                  <Text style={[styles.questionText, isOpen && styles.questionTextOpen]}>
                    {item.question}
                  </Text>
                </View>
                <View style={[styles.chevronBadge, isOpen && styles.chevronBadgeOpen]}>
                  <MaterialIcons
                    name={isOpen ? 'expand-less' : 'expand-more'}
                    size={22}
                    color={isOpen ? Colors.primary : Colors.onSurfaceVariant}
                  />
                </View>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 24,
    width: '100%',
    alignItems: 'center',
  },
  desktopContainer: {
    maxWidth: 900,
    alignSelf: 'center',
  },
  headingWrap: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 22,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 500,
  },
  list: {
    gap: 12,
    width: '100%',
  },
  faqCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  faqCardOpen: {
    borderColor: Colors.primaryContainer,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  questionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  questionText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  questionTextOpen: {
    color: Colors.primary,
  },
  chevronBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronBadgeOpen: {
    backgroundColor: Colors.primaryContainer,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(202, 196, 205, 0.25)',
  },
  answerText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    fontSize: 14,
  },
});

