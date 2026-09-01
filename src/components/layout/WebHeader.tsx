import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface WebHeaderProps {
  activeScreen?: string;
  onNavigate: (screenName: string) => void;
}

export const WebHeader: React.FC<WebHeaderProps> = ({ activeScreen, onNavigate }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.navItem}>
        <Text style={[styles.navText, activeScreen === 'Home' && styles.activeNavText]}>
          Inicio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate('Breathing')} style={styles.navItem}>
        <Text style={[styles.navText, activeScreen === 'Breathing' && styles.activeNavText]}>
          Respirar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate('Progress')} style={styles.navItem}>
        <Text style={[styles.navText, activeScreen === 'Progress' && styles.activeNavText]}>
          Progreso
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate('Login')} style={styles.navItem}>
        <Text
          style={[
            styles.navText,
            styles.authNavText,
            (activeScreen === 'Login' || activeScreen === 'Register') && styles.activeNavText,
          ]}
        >
          Registro / Ingreso
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    width: '100%',
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  navText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  authNavText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  activeNavText: {
    color: Colors.secondary,
    fontWeight: '700',
  },
});
