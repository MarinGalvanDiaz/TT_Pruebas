import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { InsideFeatureItem } from '../../types/content.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface InsideFeaturesSectionProps {
  items: InsideFeatureItem[];
  onSelectItem?: (targetScreen?: string) => void;
}

export const InsideFeaturesSection: React.FC<InsideFeaturesSectionProps> = ({
  items,
  onSelectItem,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Qué encontrarán dentro</Text>
      <Text style={styles.sectionSubtitle}>
        Herramientas intuitivas y diseñadas con sustento científico para tu bienestar.
      </Text>

      <View style={[styles.grid, isDesktop && styles.desktopGrid]}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              Shadows.soft,
              isDesktop && styles.desktopCard,
            ]}
            activeOpacity={0.85}
            onPress={() => onSelectItem?.(item.screenTarget)}
          >
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: item.bgColor || Colors.primaryContainer },
              ]}
            >
              <MaterialIcons
                name={(item.iconName as any) || 'star'}
                size={32}
                color={Colors.onSurface}
              />
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

            <View style={styles.exploreRow}>
              <Text style={styles.exploreText}>Explorar</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 24,
    alignItems: 'center',
  },
  sectionHeading: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 22,
  },
  sectionSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 500,
  },
  grid: {
    width: '100%',
    gap: 16,
  },
  desktopGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 1000,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  desktopCard: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'space-between',
    padding: 24,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 14,
    fontSize: 14,
  },
  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  exploreText: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    fontSize: 13,
  },
});
