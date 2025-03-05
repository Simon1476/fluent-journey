import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import { getUserId } from "@/lib/utils";

export async function getBookmarks(accountId: string) {
  const userId = await getUserId(accountId);
  if (userId == null) return [];

  const cacheFn = dbCache(getBookmarksInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.bookmarks)],
  });

  return cacheFn(userId);
}

async function getBookmarksInternal(userId: string) {
  const bookmarks = await prisma.sharedWordListBookmark.findMany({
    where: {
      userId: userId,
    },
  });

  return bookmarks;
}
