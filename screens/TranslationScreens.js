import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MicButton from '../components/MicButton';
import ChatMessage from '../components/ChatMessage';
import LanguageSelector from '../components/LanguageSelector';
import { TranslationContext } from '../context/TranslationContext';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { speechToText } from '../services/sttService';
import { translateText } from '../services/translationService';

export default function TranslationScreen() {
  const { sourceLang, setSourceLang, targetLang, setTargetLang } = useContext(TranslationContext);
  const { recording, startRecording, stopRecording, getAudioUri } = useAudioRecorder();
  const [messages, setMessages] = useState([]);

  const handleSwapLanguages = () => {
    const prevSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(prevSource);
  };

  const handleRecord = async () => {
    if (!recording) {
      startRecording();
    } else {
      await stopRecording();
      const audioUri = await getAudioUri();

      const userText = await speechToText(audioUri, sourceLang);
      addMessage(userText, true);

      const translated = await translateText(userText, sourceLang, targetLang);
      addMessage(translated, false);
    }
  };

  const addMessage = (text, isUser) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, isUser }]);
  };

  return (
    <View style={styles.container}>

      {/* ⭐ 상단 언어 선택 + 교환 버튼 */}
      <View style={styles.topSelectorBox}>
        
        {/* Source Selector */}
        <View style={styles.selector}>
          <LanguageSelector
            label="Source"
            value={sourceLang}
            onChange={setSourceLang}
          />
        </View>

        {/* 교환 버튼 */}
        <TouchableOpacity style={styles.swapButton} onPress={handleSwapLanguages}>
          <Text style={styles.swapText}>↔</Text>
        </TouchableOpacity>

        {/* Target Selector */}
        <View style={styles.selector}>
          <LanguageSelector
            label="Target"
            value={targetLang}
            onChange={setTargetLang}
          />
        </View>

      </View>

      {/* 채팅창 */}
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
        style={{ flex: 1 }}
      />

      {/* Mic 버튼 */}
      <MicButton recording={recording} onPress={handleRecord} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff'
  },

  topSelectorBox: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    alignItems: 'center',
  },

  selector: {
    flex: 1,
  },

  swapButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 8,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },

  swapText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  }
});
