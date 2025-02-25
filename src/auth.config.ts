import { KakaoAccount, KakaoProfile } from "@/types/kakaoProfile";
import { GoogleProfile, GoogleAccount } from "@/types/googleProfile";
import Kakao from "next-auth/providers/kakao";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";

export default {
  providers: [Kakao, Google],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (!account || !profile) return token;

      if (account.provider === "kakao") {
        const kakaoAccount = account as unknown as KakaoAccount;
        const kakaoProfile = profile as unknown as KakaoProfile;
        token.accessToken = kakaoAccount.access_token;
        token.refreshToken = kakaoAccount.refresh_token;
        token.expiresAt = kakaoAccount.expires_at;
        token.userId = kakaoProfile.id;
        token.nickname = kakaoProfile.properties.nickname ?? "";
        token.profileImage = kakaoProfile.properties.profile_image ?? "";
      } else if (account.provider === "google") {
        const googleAccount = account as unknown as GoogleAccount;
        const googleProfile = profile as unknown as GoogleProfile;

        token.accessToken = googleAccount.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = googleAccount.expires_at;
        token.userId = googleProfile.sub;
        token.nickname = googleProfile.name;
        token.profileImage = googleProfile.picture;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.nickname = token.nickname;
      session.user.profileImage = token.profileImage;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
  },
} satisfies NextAuthConfig;
