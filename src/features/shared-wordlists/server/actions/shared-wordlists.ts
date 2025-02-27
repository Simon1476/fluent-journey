"use server";

import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

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
