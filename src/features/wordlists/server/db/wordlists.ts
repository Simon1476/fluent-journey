"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import {
  addToSharedWordListSchema,
  wordListCreateSchema,
  wordListWordSchema,
} from "@/features/wordlists/schemas/wordlists";
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

  if (userId == null) return null;

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

  if (userId == null) return null;

  const cacheFn = dbCache(getWordlistsByIdInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.wordlists),
      getUserTag(userId, CACHE_TAGS.wordlists),
      getIdTag(id, CACHE_TAGS.wordlists),
    ],
  });

  return cacheFn(id);
}

export async function createWordlist(
  userId: string,
  data: z.infer<typeof wordListCreateSchema>
) {
  const newWordlist = await prisma.userWordList.create({
    data: {
      name: data.title,
      userId,
    },
  });

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: newWordlist.id,
    userId,
  });

  return newWordlist;
}

export async function addToSharedlist(
  userId: string,
  listId: string,
  data: z.infer<typeof addToSharedWordListSchema>
) {
  // 트랜잭션으로 처리하여 두 작업이 모두 성공하거나 모두 실패하도록 합니다
  const [updatedWordList, newSharedWordlist] = await prisma.$transaction([
    // 원본 단어장을 public으로 업데이트
    prisma.userWordList.update({
      where: { id: listId },
      data: { isPublic: true },
    }),

    // 공유 단어장 생성
    prisma.sharedWordList.create({
      data: {
        name: data.name,
        description: data.description,
        tags: data.tags || [],
        userId,
        originalId: listId,
      },
    }),
  ]);

  // 캐시 무효화
  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: updatedWordList.id,
    userId,
  });

  revalidateDbCache({
    tag: CACHE_TAGS.sharedWordlists,
    id: newSharedWordlist.id,
    userId,
  });

  return {
    error: false,
    message: "단어장이 성공적으로 공유되었습니다.",
  };
}

export async function deleteSharedWordlist(listId: string, userId: string) {
  console.log("listId=", listId);
  console.log("userId=", userId);
  try {
    // 트랜잭션으로 처리
    const [, updatedWordList] = await prisma.$transaction([
      // 공유 단어장 삭제
      prisma.sharedWordList.delete({
        where: {
          id: listId,
          userId: userId, // 권한 확인
        },
      }),

      // 원본 단어장 isPublic 상태 업데이트
      prisma.userWordList.update({
        where: {
          id: listId,
          userId: userId,
        },
        data: {
          isPublic: false,
        },
      }),
    ]);

    revalidateDbCache({
      tag: CACHE_TAGS.sharedWordlists,
      id: listId,
      userId,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.wordlists,
      id: updatedWordList.id,
      userId,
    });

    return true;
  } catch (error) {
    console.error("Delete shared wordlist error:", error);
    return false;
  }
}

export async function deleteWordlist(listId: string, userId: string) {
  try {
    await prisma.userWordList.delete({
      where: {
        id: listId,
        userId: userId,
      },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.wordlists,
      id: listId,
      userId,
    });

    return true;
  } catch (error) {
    console.error("Delete wordlist error:", error);
    return false;
  }
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
    orderBy: {
      createdAt: "desc",
    },
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
