import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";

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
