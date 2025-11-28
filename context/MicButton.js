import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function MicButton({ onPress, recording }) {
  return (
    <TouchableOpacity
      style={[styles.button, recording && styles.recordingButton]}
      onPress={onPress}
    >
      <Image
        source={require('../assets/mic.png')}
        style={[
          styles.icon,
          { tintColor: recording ? '#ff4444' : '#fff' } // 🔥 색 변경 포인트
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#333333ff',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 녹음 중일 때 버튼 배경도 바꿀 수 있음
  recordingButton: {
    backgroundColor: '#ffe6e6',
  },

  icon: {
    width: 32,
    height: 32,
  },
});
