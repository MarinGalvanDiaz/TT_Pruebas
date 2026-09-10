import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TestimonialItem } from '../../types/content.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface NewsCarouselProps {
  items: TestimonialItem[];
}

export const NewsCarousel: React.FC<NewsCarouselProps> = ({ items }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.container}>
      <View style={styles.headingWrap}>
        <Text style={styles.sectionTitle}>Testimonios</Text>
        <Text style={styles.sectionSubtitle}>
          Experiencias de familias, adolescentes y profesionales que forman parte de Libérate.
        </Text>
      </View>

      {isDesktop ? (
        <View style={styles.desktopGrid}>
          {items.map((item) => (
            <View key={item.id} style={[styles.desktopCard, Shadows.soft]}>
              <View style={styles.quoteIconRow}>
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: item.avatarColor || Colors.primaryContainer },
                  ]}
                >
                  <MaterialIcons
                    name={(item.iconName as any) || 'format-quote'}
                    size={22}
                    color={Colors.onSurface}
                  />
                </View>
                <MaterialIcons name="format-quote" size={28} color={Colors.primary} />
              </View>

              <Text style={styles.testimonialBody}>"{item.content}"</Text>

              <View style={styles.authorSection}>
                <Text style={styles.authorName}>{item.author}</Text>
                <Text style={styles.authorRole}>{item.role}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={290}
        >
          {items.map((item) => (
            <View key={item.id} style={[styles.card, Shadows.soft]}>
              <View style={styles.quoteIconRow}>
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: item.avatarColor || Colors.primaryContainer },
                  ]}
                >
                  <MaterialIcons
                    name={(item.iconName as any) || 'format-quote'}
                    size={20}
                    color={Colors.onSurface}
                  />
                </View>
                <MaterialIcons name="format-quote" size={24} color={Colors.primary} />
              </View>

              <Text style={styles.testimonialBody}>"{item.content}"</Text>

              <View style={styles.authorSection}>
                <Text style={styles.authorName}>{item.author}</Text>
                <Text style={styles.authorRole}>{item.role}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    width: '100%',
    alignItems: 'center',
  },
  headingWrap: {
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 22,
  },
  sectionSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 500,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    paddingVertical: 8,
  },
  card: {
    width: 280,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    justifyContent: 'space-between',
  },
  desktopGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    maxWidth: 1000,
    width: '100%',
  },
  desktopCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    justifyContent: 'space-between',
    minHeight: 220,
  },
  quoteIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialBody: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  authorSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
    paddingTop: 12,
  },
  authorName: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: '700',
  },
  authorRole: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 12,
    marginTop: 2,
  },
});

