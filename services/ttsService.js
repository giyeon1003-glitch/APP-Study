/**
 * src/services/ttsService.js
 * 텍스트 음성 변환(Text-to-Speech, TTS) 서비스를 처리하는 로직을 담당합니다.
 * Naver CLOVA Speech Synthesis (CSS) API를 사용한다고 가정하고 구현합니다.
 */

// WARNING: 실제 API 키와 엔드포인트는 보안을 위해 .env 파일 등을 사용하여 관리해야 합니다.
// Papago와 마찬가지로 네이버 개발자 센터에서 TTS API를 신청하여 키를 발급받아야 합니다.
const CLOVA_TTS_API_ENDPOINT = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';
const CLOVA_TTS_CLIENT_ID = 'YOUR_TTS_CLIENT_ID'; // 실제 TTS Client ID로 대체 필요
const CLOVA_TTS_CLIENT_SECRET = 'YOUR_TTS_CLIENT_SECRET'; // 실제 TTS Client Secret로 대체 필요

/**
 * 주어진 텍스트를 음성 파일(바이너리 데이터)로 변환합니다.
 * @param {string} textToSpeak - 음성으로 변환할 텍스트
 * @param {string} languageCode - 음성 언어 코드 (예: 'ko', 'en', 'ja')
 * @returns {Promise<ArrayBuffer>} TTS API로부터 받은 음성 데이터의 ArrayBuffer
 */
export async function synthesizeSpeech(textToSpeak, languageCode) {
    if (!textToSpeak) {
        console.error("TTS Service: 변환할 텍스트가 제공되지 않았습니다.");
        return null;
    }

    // 1. Papago와 마찬가지로 단순화된 2자리 언어 코드를 사용합니다.
    const lang = languageCode.split('-')[0];

    // 2. TTS 음성 선택 (API가 요구하는 보이스 이름. 언어별로 적절히 선택해야 함)
    // 실제 API 연동 시 언어별로 지원하는 보이스 이름 리스트를 확인해야 합니다.
    let voiceName;
    if (lang === 'ko') {
        voiceName = 'nara'; // 한국어 여성 목소리 예시
    } else if (lang === 'en') {
        voiceName = 'danny'; // 영어 남성 목소리 예시
    } else if (lang === 'ja') {
        voiceName = 'yumi'; // 일본어 여성 목소리 예시
    } else {
        console.warn(`TTS Service: 지원하지 않는 언어 코드(${languageCode}). 기본값 사용.`);
        voiceName = 'mijin'; // 기본값
    }
    
    // 3. API 요청 파라미터 구성
    const params = new URLSearchParams({
        speaker: voiceName,
        text: textToSpeak,
        format: 'mp3', // mp3 또는 wav 포맷 요청
    }).toString();

    console.log(`CLOVA TTS 요청 시작: 언어=${lang}, 보이스=${voiceName}, 텍스트: "${textToSpeak}"`);

    try {
        const response = await fetch(CLOVA_TTS_API_ENDPOINT, {
            method: 'POST',
            headers: {
                // 인증 정보는 헤더에 포함
                'X-NCP-APIGW-API-KEY-ID': CLOVA_TTS_CLIENT_ID,
                'X-NCP-APIGW-API-KEY': CLOVA_TTS_CLIENT_SECRET,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            // 오류 발생 시, 텍스트 응답을 통해 오류 메시지를 확인
            const errorText = await response.text();
            throw new Error(`CLOVA TTS API 오류: ${response.status} - ${errorText}`);
        }

        // TTS API는 음성 데이터를 바이너리 형태로 반환합니다.
        const audioData = await response.arrayBuffer();
        
        console.log(`CLOVA TTS 요청 성공: 음성 데이터 수신 완료 (크기: ${audioData.byteLength} bytes)`);

        // ArrayBuffer 형태로 음성 데이터를 반환합니다.
        // 이 데이터를 React Native의 Expo Audio API를 사용해 재생해야 합니다.
        return audioData;

    } catch (error) {
        console.error("TTS Service 요청 중 예외 발생:", error);
        
        // 개발/테스트를 위해 예외 발생 시 null 또는 에러 표시를 반환합니다.
        return null;
    }
}

// 참고: 이 synthesizeSpeech 함수는 번역된 텍스트를 얻은 후,
// src/screens/TranslationScreen.js에서 호출되어 Expo Audio API로 재생됩니다.
