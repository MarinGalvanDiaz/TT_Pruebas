import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PartnerItem } from '../../types/content.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/spacing';

interface PartnersSectionProps {
  partners: PartnerItem[];
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Respaldado por</Text>
      <View style={styles.grid}>
        {partners.map((partner) => (
          <View key={partner.id} style={styles.logoCard}>
            <Text style={styles.logoText}>{partner.logoText}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  logoCard: {
    flex: 1,
    height: 60,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  logoText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    fontWeight: '600',
  },
});
