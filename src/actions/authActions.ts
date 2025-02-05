"use server";

import { signIn, signOut } from "@/app/auth";

export async function handleKakaoSignin() {
  await signIn("kakao", { redirectTo: "/" });
}

export async function handleKakaoSignout() {
  await signOut({ redirectTo: "/signin" });
}
