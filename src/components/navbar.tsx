"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NAV_ITEMS } from "@/constants/index";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                EduPath
              </span>
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) =>
              !item.requiresAuth || (item.requiresAuth && session) ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ) : null
            )}
          </nav>

          {/* 인증 버튼 / 프로필 */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={session.user.profileImage}
                        alt="프로필 이미지"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {session.user.nickname || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">
                      {session.user?.nickname || "사용자"}
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 shadow-lg border border-gray-200 dark:border-gray-800"
                >
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer focus:bg-gray-100 focus:text-gray-900",
                      "data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900"
                    )}
                  >
                    프로필 설정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer focus:bg-gray-100 focus:text-gray-900",
                      "data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900"
                    )}
                  >
                    학습 통계
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer focus:bg-gray-100 focus:text-gray-900",
                      "data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900"
                    )}
                  >
                    <Link href="/word/lists/create" className="w-full">
                      단어장 생성
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer focus:bg-gray-100 focus:text-gray-900",
                      "data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900"
                    )}
                  >
                    <Link href="/word/lists" className="w-full">
                      단어장 목록
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer text-red-600",
                      "focus:bg-red-50 focus:text-red-700",
                      "data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700"
                    )}
                    onClick={() => signOut()}
                  >
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/signin">로그인</Link>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  무료로 시작하기
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              {NAV_ITEMS.map((item) =>
                !item.requiresAuth || (item.requiresAuth && session) ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 px-2 py-1 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : null
              )}
              {!session && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <Link href="/signin" className="w-full justify-start">
                    로그인
                  </Link>
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                    무료로 시작하기
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
