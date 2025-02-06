import { KakaoProfile } from "@/types/kakaoProfile";
import Kakao from "next-auth/providers/kakao";

import type { NextAuthConfig } from "next-auth";

export default {
  providers: [Kakao],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const kakaoProfile = profile as unknown as KakaoProfile;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.userId = kakaoProfile.id;
        token.nickname = kakaoProfile.properties.nickname;
        token.profileImage = kakaoProfile.properties.profile_image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.nickname = token.nickname;
      session.user.profileImage = token.profileImage;

      return session;
    },
  },
} satisfies NextAuthConfig;
