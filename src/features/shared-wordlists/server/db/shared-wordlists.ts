"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";

export async function getSharedWordlistsPages(q?: string, tags?: string[]) {
  const where = {
    isActive: true,
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      tags && tags.length > 0 ? { tags: { hasSome: tags } } : {},
    ],
  };

  return prisma.sharedWordList.count({ where });
}

export async function getSharedWordLists(
  accountId: string,
  currentPage: number,
  q?: string,
  tags?: string[]
) {
  const userId = await getUserId(accountId);

  if (userId == null) return [];

  const cacheFn = dbCache(getSharedWordlistsInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.sharedWordlists),
      getUserTag(userId, CACHE_TAGS.sharedWordlists),
    ],
  });

  return cacheFn(currentPage, q, tags);
}

export async function getSharedWordlistById(id: string) {
  const cacheFn = dbCache(getSharedWordlistByIdInternal, {
    tags: [getIdTag(id, CACHE_TAGS.sharedWordlists)],
  });

  return cacheFn(id);
}

async function getSharedWordlistsInternal(
  currentPage: number,
  search?: string,
  tags?: string[]
) {
  const where = {
    isActive: true,
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

  const sharedWordlists = await prisma.sharedWordList.findMany({
    where,
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
      isActive: true,
      stats: {
        select: {
          viewCount: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * 12,
    take: 12,
  });

  return sharedWordlists;
}

export async function getSharedWordlistByIdInternal(id: string) {
  return prisma.sharedWordList.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      createdAt: true,
      original: {
        select: {
          words: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
}

export async function cancelSharedWordlist(
  listId: string,
  sharedListId: string,
  userId: string
) {
  // 공유된 단어장 비활성화
  await prisma.sharedWordList.update({
    where: {
      id: sharedListId, // 수정된 부분: sharedListId 대신 sharedWordList.id 사용
      userId: userId,
    },
    data: {
      isActive: false,
    },
  });

  // 원본 단어장의 isPublic 상태 업데이트 (공유 취소)
  await prisma.userWordList.update({
    where: {
      id: listId,
      userId: userId,
    },
    data: {
      isPublic: false, // 원본 단어장 공개 취소
    },
  });

  // 4. 캐시 무효화
  revalidateDbCache({
    tag: CACHE_TAGS.sharedWordlists,
    id: sharedListId,
    userId,
  });

  revalidateDbCache({
    tag: CACHE_TAGS.wordlists,
    id: listId,
    userId,
  });

  return true;
}
