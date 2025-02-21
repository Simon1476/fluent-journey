"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import { CACHE_TAGS, dbCache, getGlobalTag, getUserTag } from "@/lib/cache";

export async function getSharedWordLists(accountId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return null;

  const cacheFn = dbCache(getSharedWordlistsInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.sharedWordlists),
      getUserTag(userId, CACHE_TAGS.sharedWordlists),
    ],
  });

  return cacheFn();
}

async function getSharedWordlistsInternal() {
  return await prisma.sharedWordList.findMany({
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
  });
}
