import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

export type SegmentOption = 'registro' | 'ingreso';

interface SegmentedControlProps {
  selected: SegmentOption;
  onSelect: (option: SegmentOption) => void;
  style?: ViewStyle;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  selected,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.tab,
          selected === 'registro' && styles.activeTab,
          selected === 'registro' && Shadows.soft,
        ]}
        onPress={() => onSelect('registro')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabText,
            selected === 'registro' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          Registro
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          selected === 'ingreso' && styles.activeTab,
          selected === 'ingreso' && Shadows.soft,
        ]}
        onPress={() => onSelect('ingreso')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabText,
            selected === 'ingreso' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          Ingreso
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    padding: 4,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: Colors.surfaceContainerLowest,
  },
  tabText: {
    ...Typography.labelSm,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  inactiveTabText: {
    color: Colors.onSurfaceVariant,
  },
});
