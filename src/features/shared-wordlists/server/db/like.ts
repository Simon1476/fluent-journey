import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getProfileTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export async function toggleLike(listId: string, userId: string) {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_listId: {
        userId: userId,
        listId: listId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.likes,
      userId: userId,
    });

    revalidateTag(getProfileTag(userId, "likes"));
    return {
      error: false,
      message: "좋아요를 취소했습니다.",
    };
  } else {
    await prisma.like.create({
      data: {
        userId: userId,
        listId: listId,
      },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.likes,
      userId: userId,
    });

    revalidateTag(getProfileTag(userId, "likes"));

    return {
      error: false,
      message: "좋아요를 추가했습니다.",
    };
  }
}

export async function getLikes(accountId: string) {
  const userId = await getUserId(accountId);
  if (userId == null) return [];

  const cacheFn = dbCache(getLikesInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.likes),
      getUserTag(userId, CACHE_TAGS.likes),
    ],
  });

  return cacheFn();
}

async function getLikesInternal() {
  const likes = await prisma.like.findMany();

  return likes;
}
