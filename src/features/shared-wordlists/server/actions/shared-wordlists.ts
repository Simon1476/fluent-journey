"use server";

import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { auth } from "@/auth";
import { getUserId } from "@/lib/utils";
import { cancelSharedWordlist as cancelSharedWordlistDb } from "../db/shared-wordlists";

export async function incrementSharedListViewCount(id: string) {
  const updatedList = await prisma.sharedWordListStats.upsert({
    where: { listId: id },
    create: {
      listId: id,
      viewCount: 1,
    },
    update: {
      viewCount: {
        increment: 1,
      },
    },
    select: { viewCount: true },
  });

  // 캐시 무효화
  revalidateDbCache({ tag: CACHE_TAGS.sharedWordlists, id });

  return updatedList.viewCount;
}

export async function cancelSharedWordlist(
  listId: string,
  sharedListId: string
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const errorMessage = "단어장 공유를 취소하지 못했습니다.";

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await cancelSharedWordlistDb(listId, sharedListId, userId);

  return {
    error: !isSuccess,
    message: isSuccess ? "단어장 공유를 취소 했습니다." : errorMessage,
  };
}
