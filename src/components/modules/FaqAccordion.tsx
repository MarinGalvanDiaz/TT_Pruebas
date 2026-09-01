import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FaqItem } from '../../types/content.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/spacing';

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preguntas Frecuentes</Text>
      <View style={styles.list}>
        {items.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <View key={item.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.questionHeader}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <MaterialIcons
                  name={isOpen ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={Colors.onSurface}
                />
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
    marginVertical: 16,
    width: '100%',
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    ...Typography.labelSmBold,
    color: Colors.onSurface,
    flex: 1,
    paddingRight: 12,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(202, 196, 205, 0.3)',
  },
  answerText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
});
