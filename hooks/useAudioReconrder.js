/** 커스텀 훅: Expo Audio API를 사용하여 녹음, 재생, 녹음 파일 관리 등 녹음 관련 로직을 캡슐화합니다 */

import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

export default function useAudioRecorder() {
  const [recording, setRecording] = useState(); // 녹음 객체 저장
  const [isRecording, setIsRecording] = useState(false); // 녹음 중인지 상태 (UI 표시용)
  const [permissionResponse, requestPermission] = Audio.usePermissions(); // 권한 관리

  // 1. 녹음 시작 함수
  const startRecording = async () => {
    try {
      // 권한 확인
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        const response = await requestPermission();
        if (response.status !== 'granted') {
          Alert.alert("권한 거부", "마이크 사용 권한이 필요합니다.");
          return;
        }
      }

      // 오디오 모드 설정 (iOS/Android 호환성 위해 필수)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      
      // 녹음 옵션 설정 (STT 인식을 위해 고품질 설정 권장)
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');

    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  };

  // 2. 녹음 중지 함수 (녹음된 파일의 주소를 반환함!)
  const stopRecording = async () => {
    console.log('Stopping recording..');
    
    if (!recording) return null;

    setIsRecording(false);
    
    try {
      await recording.stopAndUnloadAsync(); // 녹음 종료 및 메모리 해제
      const uri = recording.getURI(); // 저장된 파일 위치 가져오기
      
      console.log('Recording stopped and stored at', uri);
      
      setRecording(undefined); // 객체 초기화
      return uri; // ⭐ 중요: 이 URI를 STT API로 보내야 함

    } catch (error) {
      console.error('Failed to stop recording', error);
      return null;
    }
  };

  return {
    recording,
    isRecording,
    startRecording,
    stopRecording,
  };
}
