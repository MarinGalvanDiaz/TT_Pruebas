import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/spacing';

export const Footer: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleLink = (type: string) => {
    switch (type) {
      case 'privacidad':
      case 'terminos':
        Linking.openURL('https://liberate.unam.mx/privacidad');
        break;
      case 'contacto':
        Linking.openURL('mailto:contacto@liberate.org?subject=Contacto%20Libérate');
        break;
      case 'facebook':
        Linking.openURL('https://facebook.com/liberate');
        break;
      case 'youtube':
        Linking.openURL('https://youtube.com/@liberate');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.footer}>
      <View style={[styles.innerContent, isDesktop && styles.desktopInnerContent]}>
        {/* Left / Top: Legal & Contact Links */}
        <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => handleLink('privacidad')} style={styles.linkButton}>
            <Text style={styles.linkText}>Aviso de privacidad</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>•</Text>
          <TouchableOpacity onPress={() => handleLink('terminos')} style={styles.linkButton}>
            <Text style={styles.linkText}>Términos</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>•</Text>
          <TouchableOpacity onPress={() => handleLink('contacto')} style={styles.linkButton}>
            <Text style={styles.linkText}>Contacto</Text>
          </TouchableOpacity>
        </View>

        {/* Right / Social Media Links */}
        <View style={styles.socialsRow}>
          <TouchableOpacity
            onPress={() => handleLink('facebook')}
            style={styles.socialButton}
            accessibilityLabel="Facebook"
          >
            <MaterialIcons name="facebook" size={20} color={Colors.onSurfaceVariant} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLink('youtube')}
            style={styles.socialButton}
            accessibilityLabel="YouTube"
          >
            <MaterialIcons name="smart-display" size={20} color={Colors.onSurfaceVariant} />
            <Text style={styles.socialText}>YouTube</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Copyright */}
      <View style={styles.bottomRow}>
        <Text style={styles.copyright}>© TT 2027-A128</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    width: '100%',
    marginTop: 32,
  },
  innerContent: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  desktopInnerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  linkButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  linkText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
  separator: {
    color: Colors.outlineVariant,
    fontSize: 12,
  },
  socialsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  socialText: {
    ...Typography.labelSmBold,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
  bottomRow: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    paddingTop: 16,
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  copyright: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
});

