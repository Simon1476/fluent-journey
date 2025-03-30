import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserId(accountId: string | undefined) {
  const account = await prisma.account.findFirst({
    where: {
      providerAccountId: String(accountId),
    },
    select: { userId: true },
  });

  return account == null ? null : account.userId;
}

export const formatDate = (
  date: Date | string | null,
  formatStr: string = "yyyy-MM-dd"
) => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? parseISO(date) : date;

  return format(parsedDate, formatStr);
};

export function getDisplayName(nickname: string, id: string) {
  const isRealName = /^[가-힣]{2,4}$/.test(nickname); // 한글 이름 형식 감지
  if (isRealName) {
    return `사용자_${id}`; // 실명일 경우 ID로 대체
  }
  return nickname || `사용자_${id}`; // 닉네임이 없으면 ID 사용
}
