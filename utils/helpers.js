/** 유틸리티 함수: 데이터 포맷팅, 언어 코드 변환 등 범용적인 헬퍼 함수들을 모아둡니다. */


// 1. 날짜 포맷팅 (채팅방 시간 표시용) -> "오후 2:30" 형태로 변환
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 오후/오전 표시
  });
};


// 2. 텍스트 유효성 검사 (빈 공백만 있는지 확인)
// 예: "   " -> false, "안녕" -> true
export const isValidText = (text) => {
  return text && text.trim().length > 0;
};

// 3. 파일 전송용 FormData 생성기 (팀원 C를 위한 선물 )
// 오디오 파일 URI를 서버에 보낼 수 있는 FormData 객체로 변환해줍니다.
export const createAudioFormData = (uri, fieldName = 'file') => {
  const fileName = uri.split('/').pop(); // 파일명 추출
  const fileType = fileName.split('.').pop(); // 확장자 추출 (m4a, mp4 등)

  const formData = new FormData();
  formData.append(fieldName, {
    uri: uri,
    name: fileName,
    type: `audio/${fileType}`, // 예: audio/m4a
  });

  return formData;
};

// 4. 강제 지연 (테스트용)
// API가 아직 없을 때, 마치 로딩이 걸리는 것처럼 시뮬레이션할 때 사용
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
