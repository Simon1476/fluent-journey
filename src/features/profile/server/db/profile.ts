import { dbCache, getProfileTag, getUserTag } from "@/lib/cache";
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

export async function getProfileLikes(accountId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return [];
  const cacheFn = dbCache(getProfileLikesInternal, {
    tags: [getUserTag(userId, "likes")],
  });

  return cacheFn(userId);
}

export async function getUserSharedWordListsLikeCount(accountId: string) {
  const userId = await getUserId(accountId);

  if (userId == null) return [];
  const cacheFn = dbCache(getUserSharedWordListLikeCountInternal, {
    tags: [getProfileTag(userId, "likes")],
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
    select: {
      name: true,
      id: true,
      updatedAt: true,
      description: true,
      tags: true,
      isActive: true,
    },
  });

  return wordlists;
}

async function getProfileBookmarksInternal(userId: string) {
  const bookmarks = await prisma.sharedWordListBookmark.findMany({
    where: { userId },
    include: {
      sharedList: {
        select: {
          id: true,
          name: true,
          description: true,
          tags: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return bookmarks;
}

async function getProfileLikesInternal(userId: string) {
  const likes = await prisma.like.findMany({
    where: { userId: userId },
    select: {
      listId: true,
    },
  });

  return likes;
}

async function getUserSharedWordListLikeCountInternal(userId: string) {
  const sharedWordlists = await prisma.sharedWordList.findMany({
    where: { userId },
    select: {
      id: true,
    },
  });

  // sharedWordlists의 id를 배열로 변환
  const sharedWordlistIds = sharedWordlists.map((wordlist) => wordlist.id);

  const wordlists = await prisma.like.findMany({
    where: {
      listId: { in: sharedWordlistIds }, // sharedWordListId 대신 listId 사용
    },
  });

  return wordlists;
}
