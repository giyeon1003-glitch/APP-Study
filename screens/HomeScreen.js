import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LanguageSelector from '../components/LanguageSelector';
import { TranslationContext } from '../context/TranslationContext';

export default function HomeScreen({ navigation }) {
  const { sourceLang, setSourceLang, targetLang, setTargetLang } = useContext(TranslationContext);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Language Settings</Text>

      <Image 
        source={require('../assets/translations_100.png')}
        style={styles.image}
      />

      <View style={{ width: '100%' }}>
        <LanguageSelector
          label="Source Language"
          value={sourceLang}
          onChange={setSourceLang}
        />

        {/* Source → Target 간 간격 */}
        <View style={{ height: 15 }} />

        <LanguageSelector
          label="Target Language"
          value={targetLang}
          onChange={setTargetLang}
        />
      </View>

      {/* 둥근 버튼 */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={() => navigation.navigate("Translation")}
      >
        <Text style={styles.startButtonText}>Start Translation</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,

    // 전체 화면을 세로 중앙에 고정
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 35,  
  },

  image: {
    width: 140,
    height: 140,
    marginBottom: 35,   
    resizeMode: 'contain',
  },

  startButton: {
    marginTop: 25,         // Target 아래 여백
    backgroundColor: '#021325ff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,      // 둥근 모서리 크기
    alignItems: 'center',
    width: '100%',
  },

  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
