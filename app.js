import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = async () => {
    // TODO: API 연동 코드 작성
    // 예: setTranslated(await translateAPI(input));
    setTranslated("번역 결과 표시 예정");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>번역 앱</Text>

      <TextInput
        style={styles.input}
        placeholder="번역할 문장을 입력하세요"
        value={input}
        onChangeText={setInput}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleTranslate}>
        <Text style={styles.buttonText}>번역하기</Text>
      </TouchableOpacity>

      <View style={styles.outputBox}>
        <Text style={styles.outputLabel}>번역 결과</Text>
        <Text style={styles.output}>{translated}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  outputBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    minHeight: 120,
  },
  outputLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  output: {
    fontSize: 16,
  },
});