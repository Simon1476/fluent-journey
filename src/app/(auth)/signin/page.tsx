"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleGoogleSignin, handleKakaoSignin } from "@/actions/authActions";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="space-y-3 text-center pb-6">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent leading-tight">
              Fluent Journey
              <br />
              오신 것을 환영합니다
            </CardTitle>
            <CardDescription className="text-gray-500 text-lg">
              소셜 계정으로 간편하게 시작하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 소셜 로그인 버튼 */}
            <form action={handleGoogleSignin}>
              <Button
                variant="outline"
                className="w-full h-12 relative"
                type="submit"
              >
                <div className="absolute left-4">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                Google로 계속하기
              </Button>
            </form>

            <form action={handleKakaoSignin}>
              <Button
                type="submit"
                className="w-full h-12 relative bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90"
              >
                <div className="absolute left-4">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 3C6.48 3 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.41-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                    />
                  </svg>
                </div>
                카카오로 계속하기
              </Button>
            </form>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div> */}

            {/* <Button
              className="w-full h-12 relative bg-blue-600 hover:bg-blue-700"
              onClick={() => signIn("email", { callbackUrl: "/" })}
            >
              이메일로 계속하기
            </Button> */}
          </CardContent>

          {/* <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-600">
            <p>
              계정이 없으신가요?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                회원가입
              </a>
            </p>
            <p className="text-xs">
              계속 진행하면 EduPath의
              <a href="/terms" className="text-blue-600 hover:underline mx-1">
                서비스 약관
              </a>
              및
              <a href="/privacy" className="text-blue-600 hover:underline mx-1">
                개인정보 처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </CardFooter> */}
        </Card>
      </div>
    </div>
  );
}
