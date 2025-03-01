"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
// import { z } from "zod";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
  // revalidateDbCache,
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
      stats: true,
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
  const sharedWordlist = await prisma.sharedWordList.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      original: { include: { words: true } },
      comments: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      likes: true,
      _count: { select: { comments: true, likes: true } },
    },
  });

  if (!sharedWordlist) return null;

  return sharedWordlist;
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
