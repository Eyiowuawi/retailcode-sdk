import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  StyleSheet, SafeAreaView, Pressable,
} from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  accent: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SelectField({ label, accent, options, value, onChange }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  const hasVal = !!selected;

  return (
    <>
      <TouchableOpacity style={styles.wrapper} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={[styles.label, hasVal && { top: 6, fontSize: 10.5, fontWeight: '700', color: accent }]}>
          {label}
        </Text>
        <View style={[styles.box, open && { borderColor: accent }]}>
          <Text style={[styles.valueText, !hasVal && { color: 'transparent' }]}>
            {selected?.label ?? ' '}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <SafeAreaView style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item.value === value && { backgroundColor: `${accent}14` }]}
                onPress={() => { onChange(item.value); setOpen(false); }}
              >
                <Text style={[styles.optionText, item.value === value && { color: accent, fontWeight: '600' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper:     { marginBottom: 10 },
  label: {
    position: 'absolute', left: 12, top: 16, fontSize: 13.5,
    color: '#9CA3AF', zIndex: 1, backgroundColor: 'transparent',
  },
  box: {
    height: 52, paddingTop: 20, paddingBottom: 6, paddingHorizontal: 12,
    paddingRight: 34, backgroundColor: '#F9FAFB', borderWidth: 1.5,
    borderColor: '#E5E7EB', borderRadius: 6, flexDirection: 'row',
    alignItems: 'flex-end', justifyContent: 'space-between',
  },
  valueText:   { fontSize: 14, fontWeight: '500', color: '#111827', flex: 1 },
  chevron:     { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingBottom: 24, maxHeight: '60%',
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetTitle:  { fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.9, paddingHorizontal: 20, paddingVertical: 12 },
  option:      { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  optionText:  { fontSize: 15, color: '#111827' },
});
