import { Platform, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { colors, radius, spacing } from '@/constants/theme';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerFieldProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
}

export function PickerField({ selectedValue, onValueChange, items }: PickerFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Picker
        dropdownIconColor={colors.textPrimary}
        itemStyle={styles.item}
        selectedValue={selectedValue}
        onValueChange={(value) => onValueChange(String(value))}
        mode="dropdown"
        style={styles.picker}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 58,
    justifyContent: 'center',
  },
  picker: {
    color: colors.textPrimary,
    minHeight: 58,
    ...Platform.select({
      web: {
        fontSize: 16,
        fontWeight: '600',
        paddingLeft: spacing.sm,
        paddingRight: spacing.xl,
        backgroundColor: colors.cardDark,
      },
      default: {},
    }),
  },
  item: {
    color: colors.textPrimary,
    fontSize: 16,
  },
});
