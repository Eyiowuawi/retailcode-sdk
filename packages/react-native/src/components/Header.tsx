import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatPhone } from '@retailcode/core';

interface HeaderProps {
  title: string;
  subtitle: string;
  msisdn: string;
  accent: string;
  onClose: () => void;
}

export function Header({ title, subtitle, msisdn, accent, onClose }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close">
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.accountBar, { backgroundColor: accent }]}>
        <View style={styles.dot} />
        <View>
          <Text style={styles.accLabel}>YOUR PHONE NUMBER</Text>
          <Text style={styles.accNo}>{formatPhone(msisdn)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 14 },
  top:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  titleBlock:  { flex: 1, marginRight: 12 },
  title:       { fontSize: 19, fontWeight: '700', color: '#111827', letterSpacing: -0.3 },
  subtitle:    { fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 18 },
  closeBtn:    { width: 28, height: 28, backgroundColor: '#F3F4F6', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  closeX:      { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  accountBar:  { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 14, borderRadius: 6 },
  dot:         { width: 8, height: 8, backgroundColor: '#4ADE80', borderRadius: 4, marginRight: 10 },
  accLabel:    { fontSize: 9.5, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.6, marginBottom: 1 },
  accNo:       { fontSize: 14, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
});
