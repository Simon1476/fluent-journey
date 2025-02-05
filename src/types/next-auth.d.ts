import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nickname: string;
      profileImage: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    nickname: string;
    profileImage: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
