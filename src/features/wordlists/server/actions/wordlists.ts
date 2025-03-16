"use server";

import { auth } from "@/auth";
import { getUserId } from "@/lib/utils";
import {
  addToSharedWordListSchema,
  wordListCreateSchema,
} from "@/features/wordlists/schemas/wordlists";
import { wordListWordSchema } from "@/features/wordlists/schemas/wordlists";
import { z } from "zod";
import { redirect } from "next/navigation";
import {
  createUserWord as createUserWordDb,
  updateUserWord as updateUserWordDb,
  deleteUserWord as deleteUserWordDb,
  deleteWordlist as deleteWordlistDb,
  updateWordlist as updateWordlistDb,
  addToSharedlist as addToSharedlistDb,
  copyWordToList as copyWordToListDb,
  createWordlistWithWords as createWordlistWithWordsDb,
} from "@/features/wordlists/server/db/wordlists";

export async function createWordlist(
  unsafeData: z.infer<typeof wordListCreateSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = wordListCreateSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "단어장을 생성하는 동안 오류가 발생했습니다.",
    };
  }

  const { id } = await createWordlistWithWordsDb(userId, data);

  redirect(`/word/lists/${id}`);
}

export async function updateWordlist(
  id: string,
  unsafeData: z.infer<typeof wordListCreateSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);
  const { success, data } = wordListCreateSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "단어장을 수정하는 동안 오류가 발생했습니다",
    };
  }

  const result = await updateWordlistDb({ id, userId }, data);

  return {
    error: result.error,
    message: result.message,
  };
}

export async function copyWordToList(
  listId: string,
  unsafeData: z.infer<typeof wordListWordSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = wordListWordSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "단어장에 단어를 복사하지 못했습니다.",
    };
  }

  const result = await copyWordToListDb(listId, data, userId);

  return {
    error: result.error,
    message: result.message,
  };
}

export async function createWord(
  listId: string,
  unsafeData: z.infer<typeof wordListWordSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = wordListWordSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "단어장에 단어를 추가하지 못했습니다.",
    };
  }

  const result = await createUserWordDb(listId, data, userId);

  return {
    error: result.error,
    message: result.message,
  };
}

export async function updateWord(
  listId: string,
  wordId: string,
  unsafeData: z.infer<typeof wordListWordSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = wordListWordSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "단어를 수정하지 못했습니다.",
    };
  }

  const result = await updateUserWordDb(listId, wordId, userId, data);

  return {
    error: result.error,
    message: result.message,
  };
}

export async function deleteWord(listId: string, wordId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  if (userId == null) {
    return { error: true, message: "단어를 삭제하지 못했습니다." };
  }

  const result = await deleteUserWordDb(listId, wordId, userId);

  return {
    error: result.error,
    message: result.message,
  };
}

export async function addToSharedlist(
  listId: string,
  unsafeData: z.infer<typeof addToSharedWordListSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const { success, data } = addToSharedWordListSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "공유 단어장에 단어장을 공유하지 못했습니다.",
    };
  }

  const result = await addToSharedlistDb(userId, listId, data);

  return {
    error: result.error,
    message: result.message,
  };
}

export async function deleteWordlist(listId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const errorMessage = "단어장을 삭제하지 못했습니다.";

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const result = await deleteWordlistDb(listId, userId);

  return {
    error: result.error,
    message: result.message,
  };
}
