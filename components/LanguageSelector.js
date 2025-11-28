import React from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';

export default function LanguageSelector({ label, value, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* 둥근 테두리 박스 */}
      <View style={styles.selectorBox}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Korean" value="ko" />
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Japanese" value="ja" />
          <Picker.Item label="Chinese" value="zh" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },

  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },

  selectorBox: {
    borderWidth: 1,
    borderColor: '#d4d4d4ff',
    borderRadius: 30,       // 둥근 모서리
    overflow: 'hidden',     // Picker가 튀어나오는 문제 방지
    backgroundColor: '#c5c5c5ff',
  },

  picker: {
    width: '100%',
    height: 48,             // 높이 맞추기
  },
});
