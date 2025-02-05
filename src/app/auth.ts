import { KakaoProfile } from "@/types/kakaoProfile";
import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Kakao],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("account=", account);
      console.log("profile=", profile);
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
});
