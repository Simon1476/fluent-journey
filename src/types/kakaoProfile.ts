export interface KakaoAccount {
  access_token: string; // 사용자 인증을 위한 엑세스 토큰
  token_type: string; // 토큰의 타입 (보통 'bearer'로 설정됨)
  refresh_token: string; // 엑세스 토큰을 갱신하기 위한 리프레시 토큰
  expires_in: number; // 엑세스 토큰의 만료 시간 (초 단위)
  scope: string; // 엑세스 토큰이 허용하는 권한 범위
  refresh_token_expires_in: number; // 리프레시 토큰의 만료 시간 (초 단위)
  expires_at: number; // 엑세스 토큰의 만료 시간 (Unix 타임스탬프 형식)
  provider: string; // 인증 제공자 (이 경우 'kakao')
  type: string; // 인증 타입 (이 경우 'oauth')
  providerAccountId: string; // 카카오 계정 ID
}

export interface KakaoProfile {
  id: string; // 카카오 계정의 고유 ID
  connected_at: string; // 카카오와 연결된 시간 (ISO 8601 형식)
  properties: {
    nickname: string; // 카카오 사용자 닉네임
    profile_image: string; // 카카오 사용자 프로필 이미지 URL
    thumbnail_image?: string; // (선택적) 썸네일 이미지 URL
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean; // 사용자 프로필 닉네임에 대한 동의 필요 여부
    profile_image_needs_agreement: boolean; // 사용자 프로필 이미지에 대한 동의 필요 여부
    profile: {
      nickname: string; // 사용자 프로필 닉네임
      thumbnail_image_url: string; // 사용자 프로필 썸네일 이미지 URL
      is_default_image: boolean; // 기본 이미지 여부
      is_default_nickname: boolean; // 기본 닉네임 여부
    };
  };
}
