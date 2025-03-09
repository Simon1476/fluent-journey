import { dbCache, getProfileTag } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";

export async function getProfileWordLists(accountId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return [];
  const cacheFn = dbCache(getProfileWordListsInternal, {
    tags: [getProfileTag(userId, "wordlists")], // 문자열 리터럴 사용
  });

  return cacheFn(userId);
}

export async function getProfileSharedWordLists(accountId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return [];
  const cacheFn = dbCache(getProfileSharedWordListsInternal, {
    tags: [getProfileTag(userId, "sharedWordlists")],
  });

  return cacheFn(userId);
}

export async function getProfileBookmarks(accountId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return [];
  const cacheFn = dbCache(getProfileBookmarksInternal, {
    tags: [getProfileTag(userId, "bookmarks")],
  });

  return cacheFn(userId);
}

async function getProfileWordListsInternal(userId: string) {
  const wordlists = await prisma.userWordList.findMany({
    where: { userId },
  });

  return wordlists;
}

async function getProfileSharedWordListsInternal(userId: string) {
  const wordlists = await prisma.sharedWordList.findMany({
    where: { userId },
  });

  return wordlists;
}

async function getProfileBookmarksInternal(userId: string) {
  const bookmarks = await prisma.sharedWordListBookmark.findMany({
    where: { userId },
    include: {
      sharedList: true,
    },
  });

  return bookmarks;
}
