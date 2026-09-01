import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TestimonialItem } from '../../types/content.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface NewsCarouselProps {
  items: TestimonialItem[];
}

export const NewsCarousel: React.FC<NewsCarouselProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={280}
      >
        {items.map((item) => {
          const isQuote = item.type === 'Experiencia';
          const iconColor = isQuote ? Colors.secondary : Colors.tertiary;

          return (
            <View key={item.id} style={[styles.card, Shadows.soft]}>
              <View style={styles.header}>
                <MaterialIcons
                  name={isQuote ? 'format-quote' : 'new-releases'}
                  size={22}
                  color={iconColor}
                />
                <Text style={styles.typeLabel}>{item.type}</Text>
              </View>
              <Text style={[styles.bodyText, isQuote && styles.quoteText]}>{item.content}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 260,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  bodyText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  quoteText: {
    fontStyle: 'italic',
  },
});
