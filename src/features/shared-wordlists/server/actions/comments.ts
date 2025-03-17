"use server";

import { auth } from "@/auth";
import { getUserId } from "@/lib/utils";
import {
  createComment as createCommentDb,
  updateComment as updateCommentDb,
  deleteComment as deleteCommentDb,
} from "@/features/shared-wordlists/server/db/comments";
import { z } from "zod";
import { commentCreateSchema } from "@/features/shared-wordlists/schemas/comments";

export async function createComment(
  listId: string,
  unsafeData: z.infer<typeof commentCreateSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = commentCreateSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "댓글을 작성하는데 실패했습니다.",
    };
  }

  const result = await createCommentDb(listId, userId, data);

  return {
    error: result.error,
    message: result.message,
  };
}

export async function updateComment(
  commentId: string,
  unsafeData: z.infer<typeof commentCreateSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);
  const errorMessage = "댓글을 수정하는데 실패했습니다.";

  const { success, data } = commentCreateSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true, message: errorMessage };
  }

  const result = await updateCommentDb({ commentId, userId }, data);

  return {
    error: !result.success,
    message: result.success ? "댓글을 수정했습니다." : result.message,
  };
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);
  const errorMessage = "댓글을 삭제하는데 실패했습니다.";

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const result = await deleteCommentDb({ commentId, userId });

  return {
    error: !result.success,
    message: result.success ? "댓글을 삭제했습니다." : result.message,
  };
}
