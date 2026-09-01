import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/spacing';

export const Footer: React.FC = () => {
  const handleLink = (type: string) => {
    if (type === 'contacto') {
      Linking.openURL('mailto:contacto@liberate.org');
    }
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.brandTitle}>Libérate</Text>
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => handleLink('privacidad')} style={styles.linkButton}>
          <Text style={styles.linkText}>Privacidad</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLink('legal')} style={styles.linkButton}>
          <Text style={styles.linkText}>Aviso Legal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLink('contacto')} style={styles.linkButton}>
          <Text style={styles.linkText}>Contacto</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>© 2024 Libérate. Todos los derechos reservados.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'rgba(180, 210, 182, 0.25)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 24,
  },
  brandTitle: {
    ...Typography.labelSmBold,
    color: Colors.onTertiaryContainer,
    marginBottom: 8,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  linkButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  linkText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  copyright: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
});
