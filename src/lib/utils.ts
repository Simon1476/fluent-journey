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
