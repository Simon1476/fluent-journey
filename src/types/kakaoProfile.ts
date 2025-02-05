export interface KakaoProfile {
  id: string; // 또는 number, id의 타입에 따라 조정
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image?: string; // 선택적 속성
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
      is_default_nickname: boolean;
    };
  };
}
