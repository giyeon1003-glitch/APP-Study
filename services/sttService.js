/**
 * src/services/sttService.js
 * 음성 인식(Speech-to-Text, STT) 서비스를 처리하는 로직을 담당합니다.
 * CLOVA Speech Recognition (CSR) API를 사용한다고 가정하고 구현합니다.
 */

// WARNING: 실제 API 키와 엔드포인트는 보안을 위해 .env 파일 등을 사용하여 관리해야 합니다.
// 여기서는 테스트 및 구조 이해를 돕기 위한 Mock 값입니다.
const CLOVA_API_ENDPOINT = 'https://api.clova.ai/v1/recognize'; // Mock API Endpoint
const CLOVA_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE'; // 발급받은 실제 Client ID로 대체
const CLOVA_CLIENT_SECRET = 'YOUR_ACTUAL_CLIENT_SECRET_HERE'; // 발급받은 실제 Client Secret로 대체

/**
 * 녹음된 오디오 파일의 URI를 텍스트로 변환합니다.
 * * @param {string} audioUri - 녹음된 오디오 파일의 로컬 URI (예: file:///...)
 * @param {string} languageCode - 음성 언어 코드 (예: 'ko', 'en', 'zh', 'ja')
 * @returns {Promise<string>} 인식된 텍스트 문자열
 */
export async function recognizeSpeech(audioUri, languageCode) {
    if (!audioUri) {
        console.error("STT Service: Audio URI가 제공되지 않았습니다.");
        return "";
    }

    console.log(`STT 요청 시작: URI=${audioUri}, 언어=${languageCode}`);

    try {
        // 1. 오디오 파일을 읽어와서 API 요청에 필요한 형태로 준비합니다.
        // Expo에서는 'expo-file-system' 등을 사용하여 파일 내용을 읽거나, 
        // fetch API가 로컬 파일을 직접 업로드할 수 있는지 확인해야 합니다.
        // 여기서는 가장 일반적인 'multipart/form-data' 형태로 파일을 전송하는 것을 가정합니다.

        // 실제 구현에서는 Expo의 FileSystem을 사용하여 파일을 Blob 형태로 변환해야 할 수 있습니다.
        // const fileInfo = await FileSystem.getInfoAsync(audioUri);
        // if (!fileInfo.exists) throw new Error("Audio file does not exist.");

        // *************************************************************************
        // ********************* 실제 API 호출 부분 (Mocking) **********************
        // *************************************************************************

        // 2. API 호출을 위한 FormData 구성
        const formData = new FormData();
        
        // 오디오 파일 첨부 (RN 환경에서는 File 객체 대신 URI와 MIME 타입 정보를 사용)
        // audioUri가 Expo Assets 또는 로컬 파일 시스템 경로라고 가정합니다.
        formData.append('media', {
            uri: audioUri,
            name: 'audio.wav', // API에서 요구하는 파일명/확장자로 변경
            type: 'audio/wav',  // 녹음 시 사용한 실제 MIME 타입으로 변경
        });

        // 설정 JSON 첨부 (API 요구 사항에 따라 다름)
        const config = {
            language: languageCode, // ko-KR, en-US 등 상세 코드 필요
            // 기타 설정: sample rate, encoding 등
        };
        formData.append('config', JSON.stringify(config));

        // 3. API 요청
        const response = await fetch(CLOVA_API_ENDPOINT, {
            method: 'POST',
            headers: {
                // CLOVA API는 인증 방식을 확인하고 이 헤더를 조정해야 합니다.
                'X-CLOVA-CLIENT-ID': CLOVA_CLIENT_ID,
                'X-CLOVA-CLIENT-SECRET': CLOVA_CLIENT_SECRET,
                // Content-Type은 FormData를 사용할 경우 자동으로 설정됩니다.
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`STT API 오류: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // 4. 인식된 텍스트 추출
        // CLOVA 응답 구조에 따라 'text' 필드에서 텍스트를 추출한다고 가정
        const recognizedText = data.text; 

        if (!recognizedText) {
            console.warn("STT 서비스: 음성을 인식하지 못했습니다.");
            return "";
        }
        
        console.log(`STT 요청 성공: 인식된 텍스트: "${recognizedText}"`);
        return recognizedText;

    } catch (error) {
        console.error("STT 서비스 요청 중 예외 발생:", error);
        
        // 개발/테스트를 위해 예외 발생 시 Mock 데이터를 반환합니다.
        if (audioUri.includes('ko')) {
            return "테스트 음성입니다. 지금부터 번역을 시작합니다.";
        } else if (audioUri.includes('en')) {
            return "This is a test voice. Translation starts now.";
        } else {
            return "음성 인식에 실패했습니다. (Error Mock)";
        }
    }
}

