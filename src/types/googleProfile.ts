export interface GoogleProfile {
  iss: string; // 토큰 발급자 (Google의 경우 "https://accounts.google.com")
  azp: string; // Authorized party (Google 클라이언트 ID)
  aud: string; // Audience (Google 클라이언트 ID, 애플리케이션 ID와 동일해야 함)
  sub: string; // 사용자의 Google 고유 ID (providerAccountId와 동일)
  email: string; // 사용자의 이메일 주소
  email_verified: boolean; // 이메일 인증 여부
  at_hash: string; // 액세스 토큰의 해시값 (보안용)
  name: string; // 사용자의 전체 이름
  picture: string; // 프로필 이미지 URL
  given_name: string; // 사용자의 이름 (이름 필드와 동일한 경우도 있음)
  iat: number; // ID 토큰 발급 시간 (Unix Timestamp)
  exp: number; // ID 토큰 만료 시간 (Unix Timestamp)
}

export interface GoogleAccount {
  access_token: string; // 액세스 토큰 (OAuth 인증 후 API 요청 시 사용)
  expires_in: number; // 토큰의 유효 시간(초 단위)
  scope: string; // 인증된 API 접근 범위 (예: 프로필, 이메일 등)
  token_type: string; // 토큰 유형 (일반적으로 "bearer")
  id_token: string; // OpenID Connect ID 토큰 (JWT 형식)
  expires_at: number; // 토큰 만료 시간 (Unix Timestamp)
  provider: string; // 인증 제공자 (예: "google")
  type: string; // 인증 방식 (예: "oidc" - OpenID Connect)
  providerAccountId: string; // 제공자의 사용자 고유 ID (Google의 경우 `sub` 값과 동일)
}
