import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PartnerItem } from '../../types/content.types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

interface PartnersSectionProps {
  partners: PartnerItem[];
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handlePartnerPress = (partner: PartnerItem) => {
    if (partner.websiteUrl) {
      Linking.openURL(partner.websiteUrl);
    }
  };

  return (
    <View style={[styles.container, Shadows.soft, isDesktop && styles.desktopContainer]}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="verified" size={22} color={Colors.primary} />
        </View>
        <Text style={styles.title}>
          Cuenta con el respaldo y colaboración de investigadoras e investigadores de las siguientes instituciones
        </Text>
      </View>

      <View style={[styles.grid, isDesktop && styles.desktopGrid]}>
        {partners.map((partner) => (
          <TouchableOpacity
            key={partner.id}
            style={[styles.logoCard, isDesktop && styles.desktopLogoCard]}
            onPress={() => handlePartnerPress(partner)}
            activeOpacity={0.8}
          >
            <Text style={styles.logoAcronym}>{partner.logoText}</Text>
            <Text style={styles.logoFullName} numberOfLines={2}>
              {partner.name}
            </Text>
            {partner.description ? (
              <Text style={styles.logoDescription} numberOfLines={2}>
                {partner.description}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      {/* Programa UNAM-PAPIME Badge / Credit */}
      <View style={styles.papimeBanner}>
        <MaterialIcons name="school" size={20} color={Colors.onTertiaryContainer} />
        <Text style={styles.papimeText}>
          Investigación realizada gracias al Programa UNAM-PAPIME
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  desktopContainer: {
    maxWidth: 1000,
    alignSelf: 'center',
    padding: 32,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    maxWidth: 620,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  desktopGrid: {
    flexDirection: 'row',
    gap: 16,
    maxWidth: 900,
  },
  logoCard: {
    flex: 1,
    minWidth: 140,
    minHeight: 100,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  desktopLogoCard: {
    padding: 18,
    minHeight: 110,
  },
  logoAcronym: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  logoFullName: {
    ...Typography.labelSm,
    color: Colors.onSurface,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  logoDescription: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    fontSize: 10,
    marginTop: 4,
    opacity: 0.8,
  },
  papimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.tertiaryContainer,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    maxWidth: '100%',
  },
  papimeText: {
    ...Typography.labelSmBold,
    color: Colors.onTertiaryContainer,
    fontSize: 12,
    textAlign: 'center',
  },
});

