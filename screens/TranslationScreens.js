import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import MicButton from '../components/MicButton';
import ChatMessage from '../components/ChatMessage';
import { TranslationContext } from '../context/TranslationContext'; 
import useAudioRecorder from '../hooks/useAudioRecorder'; // 녹음
import { speechToText } from '../services/sttService';
import { translateText } from '../services/translationService';
import { playTTS } from '../services/ttsService';

export default function TranslationScreen() {
  const { sourceLang, targetLang } = useContext(TranslationContext);
  const { recording, startRecording, stopRecording, getAudioUri } = useAudioRecorder();
  const [messages, setMessages] = useState([]);

  // 녹음버튼 눌렀을 때 동작 처리
  const handleRecord = async () => {
    if (!recording) {
      startRecording();
    } else {
      await stopRecording();
      const audioUri = await getAudioUri(); // 녹음된 파일의 경로 가져오기

      // 1) 음성 > 텍스트(STT)
      // STT API 요청
      const userText = await speechToText(audioUri, sourceLang); 
      addMessage(userText, true); // 채팅창에 사용자가 말한 문장 추가(True는 사용자의 말풍선)

      const translated = await translateText(userText, sourceLang, targetLang);
      addMessage(translated, false);
    }
  };

  const addMessage = (text, isUser) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, isUser }]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <ChatMessage
            text={item.text}
            isUser={item.isUser}
            lang={item.isUser ? sourceLang : targetLang}
            />
            )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
      />

      <MicButton recording={recording} onPress={handleRecord} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
