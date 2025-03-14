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

export async function createWordList(
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

export async function updateWordList(
  id: string,
  unsafeData: z.infer<typeof wordListCreateSchema>
) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);
  const errorMessage = "단어장을 수정하는 동안 오류가 발생했습니다";
  const { success, data } = wordListCreateSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: errorMessage,
    };
  }

  const isSuccess = await updateWordlistDb({ id, userId }, data);

  return {
    error: !isSuccess,
    message: isSuccess ? "단어장을 업데이트 했습니다." : errorMessage,
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

  await copyWordToListDb(listId, data, userId);

  return {
    error: false,
    message: "단어장에 단어를 복사했습니다.",
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

  await createUserWordDb(listId, data, userId);

  return {
    error: false,
    message: "단어장에 단어를 추가했습니다.",
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
  const errorMessage = "단어를 수정하지 못했습니다.";

  const { success, data } = wordListWordSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: errorMessage,
    };
  }

  const isSuccess = await updateUserWordDb(listId, wordId, userId, data);

  return {
    error: !isSuccess,
    message: isSuccess ? "단어를 수정 했습니다." : errorMessage,
  };
}

export async function deleteWord(listId: string, wordId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);
  const errorMessage = "단어를 삭제하지 못했습니다.";

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteUserWordDb(listId, wordId, userId);

  return {
    error: !isSuccess,
    message: isSuccess ? "성공적으로 단어를 삭제 했습니다." : errorMessage,
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

  await addToSharedlistDb(userId, listId, data);

  return {
    error: false,
    message: "단어장에 단어를 추가했습니다.",
  };
}

export async function deleteWordList(listId: string) {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  const errorMessage = "단어장을 삭제하지 못했습니다.";

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteWordlistDb(listId, userId);

  return {
    error: !isSuccess,
    message: isSuccess ? "성공적으로 단어장을 삭제 했습니다." : errorMessage,
  };
}
