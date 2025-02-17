"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import { wordListWordSchema } from "@/features/wordlists/schemas/wordlists";
import { z } from "zod";
import {
  CACHE_TAGS,
  revalidateDbCache,
  dbCache,
  getGlobalTag,
  getUserTag,
  getIdTag,
} from "@/lib/cache";

export async function getWordLists(accountId: string) {
  const userId = await getUserId(accountId);

  const cacheFn = dbCache(getWordlistsInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.wordlists),
      getUserTag(userId, CACHE_TAGS.wordlists),
    ],
  });

  return cacheFn(userId);
}

export async function getWordListById(accountId: string, id: string) {
  const userId = await getUserId(accountId);

  const cacheFn = dbCache(getWordlistsByIdInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.wordlists),
      getUserTag(userId, CACHE_TAGS.wordlists),
      getIdTag(id, CACHE_TAGS.wordlists),
    ],
  });

  return cacheFn(id);
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
  const result = await prisma.userWord.create({
    data: {
      wordList: { connect: { id: listId } },
      customWord: { connect: { id: customWordId } },
    },
    include: {
      customWord: true,
    },
  });

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: listId,
  });

  return result;
}

export async function deleteUserWord(
  listId: string,
  wordId: string,
  userId: string
) {
  // 권한 확인
  const wordList = await getUserWordListInternal(listId, userId);
  if (!wordList) return false;

  await deleteUserWordInternal(wordId);

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: listId,
    userId,
  });

  return true;
}

async function getWordlistsInternal(userId: string) {
  return await prisma.userWordList.findMany({
    where: { userId },
    include: {
      _count: {
        select: { words: true },
      },
    },
  });
}

async function getWordlistsByIdInternal(id: string) {
  return await prisma.userWordList.findUnique({
    where: { id },
    include: {
      words: {
        include: {
          word: true,
          customWord: true,
        },
      },
    },
  });
}

async function getUserWordListInternal(listId: string, userId: string) {
  return prisma.userWordList.findUnique({
    where: {
      id: listId,
      userId: userId,
    },
  });
}

async function deleteUserWordInternal(wordId: string) {
  return prisma.userWord.delete({
    where: { id: wordId },
  });
}
