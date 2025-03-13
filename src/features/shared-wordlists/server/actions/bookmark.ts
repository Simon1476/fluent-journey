"use server";

import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { auth } from "@/auth";
import { getUserId } from "@/lib/utils";

export async function toggleBookmark(listId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  if (userId == null) {
    return {
      error: false,
      message: "즐겨찾기 추가를 실패했습니다.",
    };
  }

  const existingBookmark = await prisma.sharedWordListBookmark.findUnique({
    where: {
      userId_listId: {
        userId: userId,
        listId: listId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.sharedWordListBookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.bookmarks,
      userId: userId,
    });

    return {
      error: false,
      message: "즐겨찾기에서 삭제했습니다.",
    };
  } else {
    await prisma.sharedWordListBookmark.create({
      data: {
        userId: userId,
        listId: listId,
      },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.bookmarks,
      userId: userId,
    });

    return {
      error: false,
      message: "즐겨찾기에 추가했습니다.",
    };
  }
}
