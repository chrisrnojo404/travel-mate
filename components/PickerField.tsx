import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { colors, radius } from '@/constants/theme';

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
  },
  picker: {
    color: colors.textPrimary,
  },
  item: {
    color: colors.textPrimary,
  },
});
