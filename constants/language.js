/**
 * src/utils/language.js
 *
 * 앱이 지원하는 언어 목록과 API별 언어 코드 변환 함수를 정의합니다.
 *
 * - STT (CLOVA Speech): BCP-47 코드 (예: 'ko-KR') 사용
 * - Papago NMT: ISO 639-1 2자리 코드 (예: 'ko') 사용
 * - TTS (CLOVA CSS): ISO 639-1 2자리 코드 (예: 'ko') 사용
 */

// ----------------------------------------------------
// 1. 지원 언어 목록 (캐노니컬 소스)
// ----------------------------------------------------
// 'code' 필드는 앱과 STT API에서 사용하는 BCP-47 표준 코드입니다.

export const SUPPORTED_LANGUAGES = [
    {
        name: '한국어',
        code: 'ko-KR', // STT, App Code
        papagoCode: 'ko', // Papago/TTS 2자리 코드
        ttsVoice: 'nara', // TTS에 사용할 기본 목소리 이름 (nara, jinho, mihyun 등)
    },
    {
        name: '영어',
        code: 'en-US', // STT, App Code
        papagoCode: 'en', // Papago/TTS 2자리 코드
        ttsVoice: 'danny', // TTS에 사용할 기본 목소리 이름 (danny, clara, matt 등)
    },
    {
        name: '일본어',
        code: 'ja-JP', // STT, App Code
        papagoCode: 'ja', // Papago/TTS 2자리 코드
        ttsVoice: 'yumi', // TTS에 사용할 기본 목소리 이름
    },
    // 필요에 따라 다른 언어를 추가할 수 있습니다.
];

// ----------------------------------------------------
// 2. 언어 코드 매핑 유틸리티 함수
// ----------------------------------------------------

// API 호출을 위한 2자리 언어 코드를 요청할 때 사용할 타입
export const API_CODE_TYPE = {
    PAPAGO: 'papagoCode',
    TTS: 'papagoCode', // Papago와 TTS는 동일한 2자리 코드를 사용
};

/**
 * 앱에서 사용하는 캐노니컬 언어 코드(예: 'ko-KR')를
 * 특정 API가 요구하는 형식의 코드(예: 'ko')로 변환합니다.
 *
 * @param {string} canonicalCode - TranslationContext에서 관리되는 BCP-47 코드 (예: 'ko-KR')
 * @param {string} type - 변환할 API의 코드 타입 (API_CODE_TYPE 중 하나)
 * @returns {string | null} - 변환된 2자리 코드 (예: 'ko') 또는 일치하는 것이 없을 경우 null
 */
export const mapLanguageCode = (canonicalCode, type) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === canonicalCode);

    if (lang && lang[type]) {
        return lang[type];
    }
    
    console.error(`Error: Canonical code "${canonicalCode}" not found or missing required property "${type}" in language list.`);
    return null;
};

/**
 * 앱에서 사용하는 캐노니컬 언어 코드(예: 'ko-KR')에 해당하는
 * TTS 기본 목소리 이름(voice name)을 가져옵니다.
 *
 * @param {string} canonicalCode - BCP-47 코드 (예: 'ko-KR')
 * @returns {string | null} - TTS 목소리 이름 (예: 'nara') 또는 null
 */
export const getTtsVoice = (canonicalCode) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === canonicalCode);
    
    if (lang && lang.ttsVoice) {
        return lang.ttsVoice;
    }

    console.error(`Error: Canonical code "${canonicalCode}" not found or missing ttsVoice property.`);
    return null;
}
