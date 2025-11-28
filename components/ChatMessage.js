import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatMessage({ text, isUser }) {
  return (
    <View style={[styles.container, isUser ? styles.right : styles.left]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    maxWidth: '70%',
    backgroundColor: 'white',
  },
  right: {
    backgroundColor: '#dfedfaff',
    alignSelf: 'flex-end',
  },
  left: {
    backgroundColor: '#d0ceceff',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
  },
});
