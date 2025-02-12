"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import { wordListWordSchema } from "@/features/wordlists/schemas/wordlists";
import { z } from "zod";

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
          customWord: true,
        },
      },
    },
  });

  return wordList;
}

export async function createCustomWord(
  data: z.infer<typeof wordListWordSchema>,
  userId: string
) {
  const { id } = await prisma.userCustomWord.create({
    data: {
      english: data.english,
      korean: data.korean,
      pronunciation: data.pronunciation,
      level: data.level,
      example: data.example,
      userId: userId,
    },
  });

  return id;
}

export async function createUserWord(listId: string, customWordId: string) {
  return await prisma.userWord.create({
    data: {
      wordListId: listId,
      customWordId: customWordId,
    },
    include: {
      customWord: true,
    },
  });
}
