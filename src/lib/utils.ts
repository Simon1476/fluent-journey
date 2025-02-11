import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserId(accountId: string) {
  const account = await prisma.account.findFirst({
    where: {
      providerAccountId: String(accountId),
    },
    select: { userId: true },
  });

  if (!account) {
    throw new Error("유저를 찾을 수 없습니다.");
  }

  return account.userId;
}
