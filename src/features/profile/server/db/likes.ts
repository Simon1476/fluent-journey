import { getProfileTag } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function toggleLike(listId: string, userId: string) {
  try {
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
        where: { id: existingLike.id },
      });

      revalidateTag(getProfileTag(userId, "likes"));

      return {
        error: false,
        message: "좋아요를 취소했습니다.",
      };
    }

    await prisma.like.create({
      data: {
        userId: userId,
        listId: listId,
      },
    });

    revalidateTag(getProfileTag(userId, "likes"));

    return {
      error: false,
      message: "좋아요를 추가했습니다.",
    };
  } catch (error) {
    console.error("toggleLike error:", error);
    return {
      error: true,
      message: "좋아요 처리 중 오류가 발생했습니다.",
    };
  }
}
