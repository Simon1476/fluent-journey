"use server";

import { auth } from "@/auth";
import { getUserId } from "@/lib/utils";
import { toggleLike as toggleLikeDb } from "@/features/profile/server/db/likes";

export async function toggleLike(listId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  if (userId == null) {
    return {
      error: false,
      message: "좋아요 추가를 실패했습니다.",
    };
  }

  const result = await toggleLikeDb(listId, userId);

  return {
    error: result.error,
    message: result.message,
  };
}
