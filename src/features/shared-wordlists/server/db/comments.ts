import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "@/lib/cache";
import { z } from "zod";
import { commentCreateSchema } from "../../schemas/comments";
import { Prisma } from "@prisma/client";

export async function getCommentsByWordListId(id: string) {
  const cacheFn = dbCache(getCommentsByWordListIdInternal, {
    tags: [getIdTag(id, CACHE_TAGS.comments)],
  });

  return cacheFn(id);
}

async function getCommentsByWordListIdInternal(id: string) {
  const comments = await prisma.comment.findMany({
    where: { listId: id },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments;
}

export async function createComment(
  listId: string,
  userId: string,
  data: z.infer<typeof commentCreateSchema>
) {
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: userId,
      listId: listId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // 캐시 무효화
  revalidateDbCache({
    tag: CACHE_TAGS.sharedWordlists,
    id: listId,
  });

  revalidateDbCache({
    tag: CACHE_TAGS.comments,
    id: listId,
  });

  return comment;
}

export async function updateComment(
  { commentId, userId }: { commentId: string; userId: string },
  data: z.infer<typeof commentCreateSchema>
) {
  try {
    const comment = await prisma.comment.update({
      where: { id: commentId, userId }, // 본인 댓글만 수정 가능
      data: { content: data.content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // 캐시 무효화
    revalidateDbCache({
      tag: CACHE_TAGS.sharedWordlists,
      userId,
      id: comment.listId,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.comments,
      id: comment.listId,
    });
    return { success: true, comment };
  } catch (error) {
    console.error("댓글 업데이트 실패:", error);
    return {
      success: false,
      message: "댓글을 수정하는 중 오류가 발생했습니다.",
    };
  }
}

export async function deleteComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  try {
    const comment = await prisma.comment.delete({
      where: { id: commentId, userId },
    });

    revalidateDbCache({
      tag: CACHE_TAGS.sharedWordlists,
      userId,
      id: comment.listId,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.comments,
      id: comment.listId,
    });

    return {
      success: true,
      message: "댓글이 삭제되었습니다.",
    };
  } catch (error) {
    console.error("댓글 삭제 실패:", error);

    let errorMessage = "댓글을 삭제하는데 실패했습니다.";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        errorMessage = "이미 삭제되었거나 존재하지 않는 댓글입니다.";
      }
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
