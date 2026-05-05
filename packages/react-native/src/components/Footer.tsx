import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Footer() {
  return (
    <View style={styles.row}>
      <Text style={styles.lock}>🔒</Text>
      <Text style={styles.text}>Secured by <Text style={styles.bold}>Retailcode</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 18, gap: 4 },
  lock: { fontSize: 10, opacity: 0.4 },
  text: { fontSize: 11, color: '#D1D5DB' },
  bold: { fontWeight: '700' },
});
