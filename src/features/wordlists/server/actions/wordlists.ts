"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import { wordListCreateSchema } from "@/features/wordlists/schemas/wordlists";
import { wordListWordSchema } from "@/features/wordlists/schemas/wordlists";
import { z } from "zod";
import { redirect } from "next/navigation";
import {
  createCustomWord as createCustomWordDb,
  createUserWord as createUserWordDb,
  deleteUserWord as deleteUserWordDb,
} from "@/features/wordlists/server/db/wordlists";

export async function createWordList(
  unsafeData: z.infer<typeof wordListCreateSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = wordListCreateSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "단어장을 생성하는 동안 오류가 발생했습니다.",
    };
  }

  const { id } = await prisma.userWordList.create({
    data: {
      name: data.title,
      userId,
    },
  });

  redirect(`/word/lists/${id}`);
}

export async function createWord(
  listId: string,
  unsafeData: z.infer<typeof wordListWordSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = wordListWordSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "단어장에 단어를 추가하지 못했습니다.",
    };
  }

  const customWordId = await createCustomWordDb(data, userId);
  await createUserWordDb(listId, customWordId);

  return {
    error: false,
    message: "단어장에 단어를 추가했습니다.",
  };
}

export async function deleteWord(listId: string, wordId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const errorMessage = "단어를 삭제하지 못했습니다.";
  const isSuccess = await deleteUserWordDb(listId, wordId, userId);

  return {
    error: !isSuccess,
    message: isSuccess ? "성공적으로 단어를 삭제 했습니다." : errorMessage,
  };
}
