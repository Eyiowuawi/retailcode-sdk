import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormFieldProps extends TextInputProps {
  label: string;
  accent: string;
  hint?: string;
}

export function FormField({ label, accent, hint, style, ...inputProps }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasVal = String(inputProps.value ?? '').length > 0;
  const lifted = focused || hasVal;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, lifted && { top: 6, fontSize: 10.5, fontWeight: '700', color: accent }]}>
        {label}
      </Text>
      <TextInput
        {...inputProps}
        style={[styles.input, focused && { borderColor: accent, backgroundColor: '#fff' }, style]}
        onFocus={e => { setFocused(true); inputProps.onFocus?.(e); }}
        onBlur={e => { setFocused(false); inputProps.onBlur?.(e); }}
        placeholderTextColor="transparent"
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  label: {
    position: 'absolute',
    left: 12,
    top: 16,
    fontSize: 13.5,
    color: '#9CA3AF',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  input: {
    height: 52,
    paddingTop: 20,
    paddingBottom: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  hint: { marginTop: 4, fontSize: 11, color: '#9CA3AF' },
});
