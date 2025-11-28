import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { playTTS } from '../services/ttsService';

export default function ChatMessage({ text, isUser, lang }) {
  return (
    <View style={[
      styles.container, 
      isUser ? styles.right : styles.left
    ]}>
      
      {/* 텍스트 */}
      <Text style={styles.text}>{text}</Text>

      {/* 왼쪽 말풍선(번역문)에만 음성재생 버튼 이미지 표시 */}
      {!isUser && (
        <TouchableOpacity 
          style={styles.speakerButton}
          onPress={() => playTTS(text, lang)}
        >
          <Image 
            source={require('../assets/voice.png')}
            style={styles.speakerIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    maxWidth: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    backgroundColor: '#cfe9ff',
    alignSelf: 'flex-end',
  },
  left: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
    flexShrink: 1,
  },
  speakerButton: {
    marginLeft: 8,
  },
  speakerIcon: {
    width: 22,      // 이미지 크기 조절
    height: 22,
  },
});

