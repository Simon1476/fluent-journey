"use server";

import { signIn, signOut } from "@/auth";

export async function handleKakaoSignin() {
  await signIn("kakao", { redirectTo: "/" });
}

export async function handleKakaoSignout() {
  await signOut({ redirectTo: "/signin" });
}

export async function handleGoogleSignin() {
  await signIn("google", { redirectTo: "/" });
}

export async function handleGoogleSignout() {
  await signOut({ redirectTo: "/signin" });
}
