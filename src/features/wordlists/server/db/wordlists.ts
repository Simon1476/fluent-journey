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
  getUserTag,
  getIdTag,
} from "@/lib/cache";

export async function getWordLists(accountId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return [];

  const cacheFn = dbCache(getWordlistsInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.wordlists)],
  });

  return cacheFn(userId);
}

export async function getWordListById(accountId: string, wordListId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return null;

  const cacheFn = dbCache(getWordlistsByIdInternal, {
    tags: [getIdTag(wordListId, CACHE_TAGS.wordlists)],
  });

  return cacheFn(wordListId);
}

export async function createWordlistWithWords(
  userId: string,
  data: z.infer<typeof wordListCreateSchema>
) {
  const newWordlist = await prisma.$transaction(async (prisma) => {
    const wordlist = await prisma.userWordList.create({
      data: {
        name: data.title,
        description: data.description,
        user: { connect: { id: userId } },
      },
    });

    if (data.words && data.words.length > 0) {
      await prisma.userWord.createMany({
        data: data.words.map((word) => ({
          wordListId: wordlist.id,
          userId: userId,
          english: word.english,
          korean: word.korean,
          example: word.example,
        })),
      });
    }

    return wordlist;
  });

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: newWordlist.id,
    userId: newWordlist.userId,
  });

  return newWordlist;
}

export async function createWordlist(
  userId: string,
  data: z.infer<typeof wordListCreateSchema>
) {
  const newWordlist = await prisma.userWordList.create({
    data: {
      name: data.title,
      description: data.description,
      user: { connect: { id: userId } },
    },
  });

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: newWordlist.id,
    userId,
  });

  return newWordlist;
}

export async function updateWordlist(
  { id, userId }: { id: string; userId: string },
  data: z.infer<typeof wordListCreateSchema>
) {
  try {
    const updateWordlist = await prisma.userWordList.update({
      where: { id },
      data: {
        name: data.title,
        description: data.description,
      },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.wordlists,
      id: updateWordlist.id,
      userId,
    });

    return updateWordlist;
  } catch (error) {
    console.error("Error updating wordlist in DB:", error);
    return null;
  }
}

export async function addToSharedlist(
  userId: string,
  listId: string,
  data: z.infer<typeof addToSharedWordListSchema>
) {
  const [updatedWordList, newSharedWordlist] = await prisma.$transaction([
    prisma.userWordList.update({
      where: { id: listId },
      data: { isPublic: true },
    }),

    prisma.sharedWordList.upsert({
      where: { originalId: listId },
      update: {
        isActive: true,
      },
      create: {
        name: data.name,
        description: data.description,
        tags: data.tags || [],
        userId,
        originalId: listId,
      },
    }),

    // 조회수 테이블 (SharedWordListStats) 생성
  ]);

  await prisma.sharedWordListStats.upsert({
    where: { listId: newSharedWordlist.id }, // 수정된 부분: newSharedWordlist.id 사용
    update: {}, // 기존 데이터 유지
    create: {
      listId: newSharedWordlist.id, // 수정된 부분: newSharedWordlist.id 사용
      viewCount: 0,
    },
  });

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

export async function deleteWordlist(listId: string, userId: string) {
  const wordList = await prisma.userWordList.findUnique({
    where: { id: listId, userId },
    include: { sharedWordList: true },
  });

  if (!wordList) {
    return false;
  }

  const isSuccess = await prisma.$transaction(async (tx) => {
    // 공유된 단어장이 있는 경우에만 관련 테이블 삭제
    if (wordList.sharedWordList) {
      // 2-1. SharedWordListStats 삭제
      await tx.sharedWordListStats.deleteMany({
        where: { listId: wordList.sharedWordList.id },
      });

      // 2-2. SharedWordList 삭제
      await tx.sharedWordList.delete({
        where: { id: wordList.sharedWordList.id },
      });
    }

    // 2-3. UserWordList 삭제 (항상 실행)
    await tx.userWordList.delete({
      where: { id: listId, userId },
    });

    return true;
  });

  if (!isSuccess) return false;

  revalidateDbCache({ tag: CACHE_TAGS.wordlists, id: listId, userId });
  if (wordList.sharedWordList) {
    revalidateDbCache({ tag: CACHE_TAGS.sharedWordlists });
  }

  return true;
}

export async function copyWordToList(
  listId: string,
  data: z.infer<typeof wordListWordSchema>,
  userId: string
) {
  try {
    const result = await prisma.userWord.create({
      data: {
        english: data.english,
        korean: data.korean,
        level: data.level,
        pronunciation: data.pronunciation,
        example: data.example,
        wordList: { connect: { id: listId } },
        user: { connect: { id: userId } },
      },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.userWords,
      id: userId,
    });

    // 원본 단어장 캐시 무효화
    revalidateDbCache({
      tag: CACHE_TAGS.wordlists,
      userId: userId,
      id: listId,
    });

    return result;
  } catch (error) {
    console.error("Error copying word to list:", error);
    const errorMessage = "단어를 단어장에 복사하는 데 실패했습니다.";
    return { error: true, message: errorMessage };
  }
}

export async function createUserWord(
  listId: string,
  data: z.infer<typeof wordListWordSchema>,
  userId: string
) {
  // 먼저 해당 단어장의 공유 상태 확인
  const wordList = await prisma.userWordList.findUnique({
    where: { id: listId },
    include: {
      sharedWordList: true,
    },
  });

  const result = await prisma.userWord.create({
    data: {
      english: data.english,
      korean: data.korean,
      level: data.level,
      pronunciation: data.pronunciation,
      example: data.example,
      wordList: { connect: { id: listId } },
      user: { connect: { id: userId } },
    },
  });

  revalidateDbCache({
    tag: CACHE_TAGS.userWords,
    id: userId,
  });

  // 원본 단어장 캐시 무효화
  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    userId: userId,
    id: listId,
  });

  // 공유 단어장이 있다면 해당 캐시도 무효화
  if (wordList?.sharedWordList) {
    revalidateDbCache({
      tag: CACHE_TAGS.sharedWordlists,
      id: wordList.sharedWordList.id,
    });
  }

  return result;
}

export async function updateUserWord(
  listId: string,
  wordId: string,
  userId: string,
  data: z.infer<typeof wordListWordSchema>
) {
  const wordList = await getUserWordListInternal(listId, userId);

  if (!wordList) return false;

  await prisma.userWord.update({
    where: { id: wordId },
    data,
  });

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: listId,
    userId,
  });

  if (wordList.sharedWordList?.id) {
    revalidateDbCache({
      tag: CACHE_TAGS.sharedWordlists,
      id: wordList.sharedWordList?.id,
    });
  }

  return true;
}

export async function deleteUserWord(
  listId: string,
  wordId: string,
  userId: string
) {
  const wordList = await getUserWordListInternal(listId, userId);

  if (!wordList) return false;

  await prisma.userWord.delete({ where: { id: wordId } });

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: listId,
    userId,
  });

  if (wordList.sharedWordList?.id) {
    revalidateDbCache({
      tag: CACHE_TAGS.sharedWordlists,
      id: wordList.sharedWordList?.id,
    });
  }

  return true;
}

async function getWordlistsInternal(userId: string) {
  return await prisma.userWordList.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      words: true,
      sharedWordList: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

async function getWordlistsByIdInternal(id: string) {
  return await prisma.userWordList.findFirst({
    where: { id },
    include: {
      words: true,
      sharedWordList: {
        select: {
          name: true,
        },
      },
    },
  });
}

async function getUserWordListInternal(listId: string, userId: string) {
  return await prisma.userWordList.findUnique({
    where: { id: listId, userId },
    include: { sharedWordList: true },
  });
}
