/**
 * src/services/translationService.js
 * 텍스트 번역(Text Translation) 서비스를 처리하는 로직을 담당합니다.
 * Naver Papago SMT/NMT API를 사용한다고 가정하고 구현합니다.
 */

// WARNING: 실제 API 키와 엔드포인트는 보안을 위해 .env 파일 등을 사용하여 관리해야 합니다.
// 여기서는 테스트 및 구조 이해를 돕기 위한 Mock 값입니다.
const PAPAGO_API_ENDPOINT = 'https://openapi.naver.com/v1/papago/n2mt'; // Papago NMT (신경망 기반) Endpoint
const PAPAGO_CLIENT_ID = 'YOUR_PAPAGO_CLIENT_ID'; // 실제 Papago Client ID로 대체 필요
const PAPAGO_CLIENT_SECRET = 'YOUR_PAPAGO_CLIENT_SECRET'; // 실제 Papago Client Secret로 대체 필요

/**
 * 주어진 텍스트를 출발 언어에서 도착 언어로 번역합니다.
 * @param {string} textToTranslate - 번역할 원문 텍스트
 * @param {string} sourceLanguage - 출발 언어 코드 (예: 'ko', 'en')
 * @param {string} targetLanguage - 도착 언어 코드 (예: 'en', 'ko')
 * @returns {Promise<string>} 번역된 텍스트 문자열
 */
export async function translateText(textToTranslate, sourceLanguage, targetLanguage) {
    if (!textToTranslate) {
        console.error("Translation Service: 번역할 텍스트가 제공되지 않았습니다.");
        return "";
    }

    // Papago API는 ko-KR이 아닌 'ko' 형태로만 코드를 요구한다고 가정합니다.
    // 만약 ko-KR 형태가 들어오면 'ko'로 단순화합니다.
    const source = sourceLanguage.split('-')[0]; 
    const target = targetLanguage.split('-')[0];

    // 번역할 데이터
    const data = new URLSearchParams({
        source: source,
        target: target,
        text: textToTranslate,
    }).toString();

    console.log(`Papago 번역 요청 시작: ${source} -> ${target}, 텍스트: "${textToTranslate}"`);

    try {
        const response = await fetch(PAPAGO_API_ENDPOINT, {
            method: 'POST',
            headers: {
                // Papago API는 인증 정보를 헤더에 포함해야 합니다.
                'X-Naver-Client-Id': PAPAGO_CLIENT_ID,
                'X-Naver-Client-Secret': PAPAGO_CLIENT_SECRET,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: data,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Papago API 오류: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();

        // Papago 응답 구조: jsonResponse.message.result.translatedText
        const translatedText = jsonResponse.message?.result?.translatedText;
        
        if (!translatedText) {
            console.warn("Translation Service: 번역 결과를 찾을 수 없거나 응답 구조가 잘못되었습니다.", jsonResponse);
            return "번역 실패";
        }

        console.log(`Papago 번역 요청 성공: 번역된 텍스트: "${translatedText}"`);
        return translatedText;

    } catch (error) {
        console.error("Translation Service 요청 중 예외 발생:", error);
        
        // 개발/테스트를 위해 예외 발생 시 Mock 데이터를 반환합니다.
        if (source === 'ko' && target === 'en') {
            return `[Translation Mock: The service is currently running in test mode.]`;
        } else if (source === 'en' && target === 'ko') {
            return `[번역 Mock: 현재 서비스가 테스트 모드로 실행 중입니다.]`;
        } else {
             return "번역 서비스를 사용할 수 없습니다. (Error Mock)";
        }
    }
}
