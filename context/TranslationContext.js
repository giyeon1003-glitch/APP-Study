/** 상태 관리: 현재 선택된 언어, 대화 기록, 번역 설정 등 앱의 전역 상태를 관리합니다 */
import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
// Languages.js 파일에서 언어 목록 가져오기(경로 주의)
import {SUPPORTED_LANGUAGES} from '..\constants\Lanhuages';
// helper함수 가져오기
import {isValidText} from '../utils/helpers';
// 실제 번역 서비스 가져오기
import {translateText} from '../services/translationService';

// 1. Context 생성 (데이터를 담을 빈 상자 만들기)
const TranslationContext = createContext();

// 2. Provider 컴포넌트 (데이터와 기능을 자식들에게 뿌려주는 역할)
export const TranslationProvider = ({ children }) => {
  
  // --- [State] 변하는 데이터 관리 ---
  const [sourceLang, setSourceLang] = useState(SUPPORTED_LANGUAGES[0].code); // 입력언어(기본: 한국어)
  const [targetLang, setTargetLang] = useState(SUPPORTED_LANGUAGES[1].code); // 번역할 언어(기본: 영어)

  const [messages, setMessages] = useState([]); // 채팅기록(화면에 나타나는 리스트)
  const [isLoadin, setIsLoading] = useState(false); // 로딩중인지 여부 결정

  // --- [Actions] 기능을 수행하는 함수들 ---
  // 메시지 추가 헬퍼 함수
  const addToMessageList = (text, isUser) => {
    const newMessage = {
      id: Date.now().toString(), // 고유 ID
      text: text,
      isUser: isUser, // true면 나(오른쪽), false면 상대방/번역(왼쪽)
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  //  핵심 기능: 메시지 전송 및 번역 요청
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // 1. 사용자 메시지를 먼저 화면에 표시
    addToMessageList(text, true);
    setIsLoading(true);

    try {
      // -----------------------------------------------------------
      // [TODO] 팀원 C가 만든 API 서비스가 완성되면 여기에 연결합니다.
      // 지금은 테스트를 위해 1초 뒤에 "가짜 응답"을 주도록 해놨습니다.
      // -----------------------------------------------------------

      console.log('[번역 요청] ${sourcdLang} -> ${targetLang} : ${text}');
      
      // 번역 서비스 연결
      const translatedResult = await translateText(text, sourceLang, targetLang);

      // 2. 번역된 결과(또는 응답)를 화면에 표시
      addToMessageList(translatedResult, false);

    } catch (error) {
      console.error(error);
      Alert.alert("오류", "번역 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  // 언어 변경 함수
  const changeLanguage = (type, langCode) => {
    if (type === 'source') setSourceLang(langCode);
    else setTargetLang(langCode);
  };

  // 내보낼 데이터와 함수들을 묶음
  const value = {
    messages,
    sourceLang,
    targetLang,
    isLoading,
    handleSendMessage,
    changeLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// 3. 커스텀 훅 (다른 파일에서 쉽게 가져다 쓰기 위함)
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
