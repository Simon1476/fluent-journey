"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
// import { z } from "zod";
import {
  CACHE_TAGS,
  // revalidateDbCache,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  // getIdTag,
} from "@/lib/cache";

export async function getSharedWordLists(
  accountId: string,
  q?: string,
  tags?: string[]
) {
  const userId = await getUserId(accountId);

  if (userId == null) return null;

  const cacheFn = dbCache(getSharedWordlistsInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.sharedWordlists),
      getUserTag(userId, CACHE_TAGS.sharedWordlists),
    ],
  });

  return cacheFn(q, tags);
}

export async function getSharedWordListById(id: string) {
  const cacheFn = dbCache(getSharedWordListByIdInternal, {
    tags: [getIdTag(id, CACHE_TAGS.sharedWordlists)],
  });

  return cacheFn(id);
}

// export async function getWordListById(accountId: string, id: string) {
//   const userId = await getUserId(accountId);

//   if (userId == null) return null;

//   const cacheFn = dbCache(getWordlistsByIdInternal, {
//     tags: [
//       getGlobalTag(CACHE_TAGS.wordlists),
//       getUserTag(userId, CACHE_TAGS.wordlists),
//       getIdTag(id, CACHE_TAGS.wordlists),
//     ],
//   });

//   return cacheFn(id);
// }

// export async function createWordlist(
//   userId: string,
//   data: z.infer<typeof wordListCreateSchema>
// ) {
//   const newWordlist = await prisma.userWordList.create({
//     data: {
//       name: data.title,
//       userId,
//     },
//   });

//   revalidateDbCache({
//     tag: CACHE_TAGS.wordlists,
//     id: newWordlist.id,
//     userId,
//   });

//   return newWordlist;
// }

// export async function deleteWordlist(listId: string, userId: string) {
//   try {
//     await prisma.userWordList.delete({
//       where: {
//         id: listId,
//         userId: userId,
//       },
//     });

//     revalidateDbCache({
//       tag: CACHE_TAGS.wordlists,
//       id: listId,
//       userId,
//     });

//     return true;
//   } catch (error) {
//     console.error("Delete wordlist error:", error);
//     return false;
//   }
// }

// export async function createCustomWord(
//   data: z.infer<typeof wordListWordSchema>,
//   userId: string
// ) {
//   const { id } = await prisma.userCustomWord.create({
//     data: {
//       english: data.english,
//       korean: data.korean,
//       pronunciation: data.pronunciation,
//       level: data.level,
//       example: data.example,
//       userId: userId,
//     },
//   });

//   return id;
// }

// export async function createUserWord(listId: string, customWordId: string) {
//   const result = await prisma.userWord.create({
//     data: {
//       wordList: { connect: { id: listId } },
//       customWord: { connect: { id: customWordId } },
//     },
//     include: {
//       customWord: true,
//     },
//   });

//   revalidateDbCache({
//     tag: CACHE_TAGS.wordlists,
//     id: listId,
//   });

//   return result;
// }

// export async function deleteUserWord(
//   listId: string,
//   wordId: string,
//   userId: string
// ) {
//   // 권한 확인
//   const wordList = await getUserWordListInternal(listId, userId);
//   if (!wordList) return false;

//   await deleteUserWordInternal(wordId);

//   revalidateDbCache({
//     tag: CACHE_TAGS.wordlists,
//     id: listId,
//     userId,
//   });

//   return true;
// }

async function getSharedWordlistsInternal(search?: string, tags?: string[]) {
  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              {
                description: { contains: search, mode: "insensitive" as const },
              },
            ],
          }
        : {},
      tags && tags.length > 0
        ? {
            tags: { hasSome: tags },
          }
        : {},
    ],
  };

  return await prisma.sharedWordList.findMany({
    where,
    include: {
      user: true,
      original: true,
      comments: true,
      likes: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getSharedWordListByIdInternal(id: string) {
  // 조회수 증가와 데이터 조회를 트랜잭션으로 처리
  const [_, sharedList] = await prisma.$transaction([
    // 조회수 증가
    prisma.sharedWordList.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    }),
    // 상세 데이터 조회
    prisma.sharedWordList.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        original: {
          include: {
            words: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    }),
  ]);

  return sharedList;
}

// async function getWordlistsByIdInternal(id: string) {
//   return await prisma.userWordList.findUnique({
//     where: { id },
//     include: {
//       words: {
//         include: {
//           word: true,
//           customWord: true,
//         },
//       },
//     },
//   });
// }

// async function getUserWordListInternal(listId: string, userId: string) {
//   return prisma.userWordList.findUnique({
//     where: {
//       id: listId,
//       userId: userId,
//     },
//   });
// }

// async function deleteUserWordInternal(wordId: string) {
//   return prisma.userWord.delete({
//     where: { id: wordId },
//   });
// }
