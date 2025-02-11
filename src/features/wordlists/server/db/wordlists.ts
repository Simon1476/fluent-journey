"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";

export async function getWordLists(accountId: string) {
  const userId = await getUserId(accountId);

  const lists = await prisma.userWordList.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: { words: true },
      },
    },
  });
  return lists;
}

export async function getWordListById(accountId: string, id: string) {
  const userId = await getUserId(accountId);

  const wordList = await prisma.userWordList.findUnique({
    where: {
      id: id,
    },
    include: {
      words: {
        include: {
          word: true,
        },
      },
    },
  });

  if (!wordList) {
    return null;
  }

  if (wordList.userId !== userId) {
    throw new Error("접근 권한이 없습니다");
  }

  return wordList;
}
