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

    return {
      error: false,
      message: "단어장을 수정했습니다.",
    };
  } catch (error) {
    console.error("Error updating wordlist in DB:", error);
    return {
      error: true,
      message: "오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}

export async function addToSharedlist(
  userId: string,
  listId: string,
  data: z.infer<typeof addToSharedWordListSchema>
) {
  try {
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
    ]);

    await prisma.sharedWordListStats.upsert({
      where: { listId: newSharedWordlist.id },
      update: {}, // 기존 데이터 유지
      create: {
        listId: newSharedWordlist.id,
        viewCount: 0,
      },
    });

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
      error: true,
      message: "단어장이 성공적으로 공유되었습니다.",
    };
  } catch (error) {
    console.error("Failed to add to shared list:", error);
    return {
      error: false,
      message: "단어장 공유 중 오류가 발생했습니다.",
    };
  }
}

export async function deleteWordlist(listId: string, userId: string) {
  try {
    const wordList = await getUserWordListInternal(listId, userId);

    if (!wordList) {
      return {
        success: false,
        message: "단어장이 존재하지 않습니다.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // 공유된 단어장이 있는 경우 관련 데이터 삭제
      if (wordList.sharedWordList) {
        await tx.sharedWordListStats.deleteMany({
          where: { listId: wordList.sharedWordList.id },
        });

        await tx.sharedWordList.delete({
          where: { id: wordList.sharedWordList.id },
        });
      }

      // 사용자 단어장 삭제
      await tx.userWordList.delete({
        where: { id: listId, userId },
      });
    });

    revalidateDbCache({ tag: CACHE_TAGS.wordlists, id: listId, userId });
    if (wordList.sharedWordList) {
      revalidateDbCache({ tag: CACHE_TAGS.sharedWordlists });
    }

    return {
      error: true,
      message: "단어장이 삭제되었습니다.",
    };
  } catch (error) {
    console.error("Failed to delete wordlist:", error);
    return {
      error: false,
      message: "단어장 삭제 중 오류가 발생했습니다.",
    };
  }
}

export async function copyWordToList(
  listId: string,
  data: z.infer<typeof wordListWordSchema>,
  userId: string
) {
  try {
    await prisma.userWord.create({
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

    return {
      error: false,
      message: "단어장에 단어를 복사했습니다",
    };
  } catch (error) {
    console.error("Error copying word to list:", error);
    return {
      error: true,
      message: "오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}

export async function createUserWord(
  listId: string,
  data: z.infer<typeof wordListWordSchema>,
  userId: string
) {
  try {
    // 먼저 해당 단어장의 공유 상태 확인
    const wordList = await getUserWordListInternal(listId, userId);

    if (!wordList)
      return {
        error: false,
        message: "단어장이 존재 하지 않습니다.",
      };

    await prisma.userWord.create({
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

    // 원본 단어장 캐시 무효화
    revalidateDbCache({
      tag: CACHE_TAGS.wordlists,
      userId: userId,
      id: listId,
    });

    // 공유 단어장이 있다면 해당 캐시도 무효화
    if (wordList.sharedWordList) {
      revalidateDbCache({
        tag: CACHE_TAGS.sharedWordlists,
        id: wordList.sharedWordList.id,
      });
    }

    return {
      error: true,
      message: "단어가 추가되었습니다.",
    };
  } catch (error) {
    console.error("Failed to create user word:", error);
    return {
      error: false,
      message: "단어 추가 중 오류가 발생했습니다.",
    };
  }
}

export async function updateUserWord(
  listId: string,
  wordId: string,
  userId: string,
  data: z.infer<typeof wordListWordSchema>
) {
  try {
    const wordList = await getUserWordListInternal(listId, userId);

    if (!wordList)
      return {
        error: false,
        message: "단어장이 존재 하지 않습니다.",
      };

    await prisma.userWord.update({
      where: { id: wordId },
      data,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.wordlists,
      userId,
      id: listId,
    });

    if (wordList.sharedWordList?.id) {
      revalidateDbCache({
        tag: CACHE_TAGS.sharedWordlists,
        id: wordList.sharedWordList.id,
      });
    }
    return {
      error: false,
      message: "단어를 수정했습니다.",
    };
  } catch (error) {
    console.error("Failed to update user word:", error);
    return {
      error: true,
      message: "오류가 발생했습니다.",
    };
  }
}

export async function deleteUserWord(
  listId: string,
  wordId: string,
  userId: string
) {
  try {
    const wordList = await getUserWordListInternal(listId, userId);

    if (!wordList) {
      return {
        success: false,
        message: "단어장이 존재하지 않습니다.",
      };
    }

    await prisma.userWord.delete({ where: { id: wordId } });

    revalidateDbCache({
      tag: CACHE_TAGS.wordlists,
      id: listId,
      userId,
    });

    if (wordList.sharedWordList?.id) {
      revalidateDbCache({
        tag: CACHE_TAGS.sharedWordlists,
        id: wordList.sharedWordList.id,
      });
    }

    return {
      error: true,
      message: "단어가 삭제되었습니다.",
    };
  } catch (error) {
    console.error("Failed to delete user word:", error);
    return {
      error: false,
      message: "단어 삭제 중 오류가 발생했습니다.",
    };
  }
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
  return await prisma.userWordList.findFirst({
    where: { id: listId, userId },
    include: { sharedWordList: true },
  });
}
