import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius, Shadows } from '../../theme/spacing';

const MONTHS = [
  { value: 1, label: 'Enero', short: 'Ene' },
  { value: 2, label: 'Febrero', short: 'Feb' },
  { value: 3, label: 'Marzo', short: 'Mar' },
  { value: 4, label: 'Abril', short: 'Abr' },
  { value: 5, label: 'Mayo', short: 'May' },
  { value: 6, label: 'Junio', short: 'Jun' },
  { value: 7, label: 'Julio', short: 'Jul' },
  { value: 8, label: 'Agosto', short: 'Ago' },
  { value: 9, label: 'Septiembre', short: 'Sep' },
  { value: 10, label: 'Octubre', short: 'Oct' },
  { value: 11, label: 'Noviembre', short: 'Nov' },
  { value: 12, label: 'Diciembre', short: 'Dic' },
];

export function calculateAgeFromBirthDate(year: number, month: number, day: number): number {
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) {
    age--;
  }
  return age;
}

interface BirthDatePickerProps {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange: (dateString: string, calculatedAge: number) => void;
  minAge?: number;
  maxAge?: number;
  error?: string;
  hint?: string;
}

export const BirthDatePicker: React.FC<BirthDatePickerProps> = ({
  label = 'Fecha de nacimiento',
  value,
  onChange,
  minAge = 10,
  maxAge = 25,
  error,
  hint,
}) => {
  const currentYear = new Date().getFullYear();

  // Parse initial YYYY-MM-DD if provided
  const parsed = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map((n) => parseInt(n, 10));
      return { year: y, month: m, day: d };
    }
    return null;
  }, [value]);

  const [selectedYear, setSelectedYear] = useState<number>(parsed?.year || currentYear - 15);
  const [selectedMonth, setSelectedMonth] = useState<number>(parsed?.month || 6);
  const [selectedDay, setSelectedDay] = useState<number>(parsed?.day || 15);
  const [modalVisible, setModalVisible] = useState(false);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear - minAge; y >= currentYear - maxAge; y--) {
      list.push(y);
    }
    return list;
  }, [currentYear, minAge, maxAge]);

  const daysInMonth = useMemo(() => {
    const count = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth]);

  const currentCalculatedAge = useMemo(() => {
    if (!parsed) return null;
    return calculateAgeFromBirthDate(parsed.year, parsed.month, parsed.day);
  }, [parsed]);

  const previewAge = useMemo(() => {
    const safeDay = Math.min(selectedDay, daysInMonth.length);
    return calculateAgeFromBirthDate(selectedYear, selectedMonth, safeDay);
  }, [selectedYear, selectedMonth, selectedDay, daysInMonth.length]);

  const handleOpen = () => {
    if (parsed) {
      setSelectedYear(parsed.year);
      setSelectedMonth(parsed.month);
      setSelectedDay(parsed.day);
    }
    setModalVisible(true);
  };

  const handleConfirm = () => {
    const safeDay = Math.min(selectedDay, daysInMonth.length);
    const yyyy = String(selectedYear);
    const mm = String(selectedMonth).padStart(2, '0');
    const dd = String(safeDay).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    const age = calculateAgeFromBirthDate(selectedYear, selectedMonth, safeDay);
    onChange(formatted, age);
    setModalVisible(false);
  };

  const monthObj = MONTHS.find((m) => m.value === parsed?.month);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, !!error && styles.labelError]}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.selectorTrigger,
          !!parsed && styles.selectorTriggerActive,
          !!error && styles.selectorTriggerError,
        ]}
        onPress={handleOpen}
        activeOpacity={0.85}
      >
        <View style={styles.leftRow}>
          <View style={styles.calendarIconWrap}>
            <MaterialIcons name="event" size={20} color={Colors.primary} />
          </View>
          {parsed ? (
            <View>
              <Text style={styles.dateDisplayText}>
                {String(parsed.day).padStart(2, '0')} de {monthObj?.label || ''} de {parsed.year}
              </Text>
              <Text style={styles.subText}>Toca para cambiar la fecha</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.placeholderText}>Seleccionar fecha de nacimiento</Text>
              <Text style={styles.subText}>La edad se calcula automáticamente</Text>
            </View>
          )}
        </View>

        <View style={styles.rightRow}>
          {currentCalculatedAge !== null && (
            <View style={styles.agePill}>
              <Text style={styles.agePillNum}>{currentCalculatedAge}</Text>
              <Text style={styles.agePillText}>años</Text>
            </View>
          )}
          <MaterialIcons name="keyboard-arrow-down" size={22} color={Colors.onSurfaceVariant} />
        </View>
      </TouchableOpacity>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!error && !!hint && <Text style={styles.hintText}>{hint}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, Shadows.card]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Selecciona fecha de nacimiento</Text>
                <Text style={styles.modalSubtitle}>
                  Edad calculada: <Text style={styles.modalAgeHighlight}>{previewAge} años</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={22} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <View style={styles.columnsContainer}>
              {/* Día */}
              <View style={styles.column}>
                <Text style={styles.columnHeader}>Día</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {daysInMonth.map((d) => {
                    const active = d === Math.min(selectedDay, daysInMonth.length);
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[styles.optionItem, active && styles.optionItemActive]}
                        onPress={() => setSelectedDay(d)}
                      >
                        <Text style={[styles.optionText, active && styles.optionTextActive]}>
                          {String(d).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Mes */}
              <View style={[styles.column, { flex: 1.4 }]}>
                <Text style={styles.columnHeader}>Mes</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {MONTHS.map((m) => {
                    const active = m.value === selectedMonth;
                    return (
                      <TouchableOpacity
                        key={m.value}
                        style={[styles.optionItem, active && styles.optionItemActive]}
                        onPress={() => setSelectedMonth(m.value)}
                      >
                        <Text style={[styles.optionText, active && styles.optionTextActive]}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Año */}
              <View style={styles.column}>
                <Text style={styles.columnHeader}>Año</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {years.map((y) => {
                    const active = y === selectedYear;
                    return (
                      <TouchableOpacity
                        key={y}
                        style={[styles.optionItem, active && styles.optionItemActive]}
                        onPress={() => setSelectedYear(y)}
                      >
                        <Text style={[styles.optionText, active && styles.optionTextActive]}>
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
              >
                <MaterialIcons name="check" size={18} color="#ffffff" />
                <Text style={styles.confirmBtnText}>Confirmar ({previewAge} años)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
    fontWeight: '600',
    paddingLeft: 4,
  },
  labelError: {
    color: Colors.error,
  },
  selectorTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 56,
  },
  selectorTriggerActive: {
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  selectorTriggerError: {
    borderColor: Colors.error,
    backgroundColor: '#fff8f8',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  calendarIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDisplayText: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    fontWeight: '700',
    fontSize: 15,
  },
  placeholderText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    fontSize: 14,
  },
  subText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    opacity: 0.8,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agePill: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agePillNum: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    fontSize: 13,
  },
  agePillText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 11,
  },
  errorText: {
    ...Typography.labelSm,
    color: Colors.error,
    marginTop: 4,
    paddingLeft: 4,
  },
  hintText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    paddingLeft: 4,
    opacity: 0.8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 27, 31, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 20,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '700',
    fontSize: 17,
  },
  modalSubtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  modalAgeHighlight: {
    color: Colors.primary,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 240,
    marginBottom: 18,
  },
  column: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  columnHeader: {
    ...Typography.labelSmBold,
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    marginBottom: 4,
  },
  columnScroll: {
    flex: 1,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 2,
  },
  optionItemActive: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontSize: 14,
  },
  optionTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...Typography.labelSmBold,
    color: Colors.onSurfaceVariant,
  },
  confirmBtn: {
    flex: 1.6,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    ...Typography.labelSmBold,
    color: '#ffffff',
  },
});
