"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/utils";

export async function createWordList(
  accountId: string,
  data: { title: string }
) {
  const userId = await getUserId(accountId);

  const list = await prisma.userWordList.create({
    data: {
      name: data.title,
      userId,
    },
  });

  return list;
}

export async function addWordToList(
  accountId: string,
  listId: string,
  data: {
    english: string;
    korean: string;
    pronunciation?: string;
    level: string;
    example?: string;
  }
) {
  const userId = await getUserId(accountId);

  // 단어장 소유자 확인
  const wordList = await prisma.userWordList.findUnique({
    where: { id: listId },
  });

  if (!wordList || wordList.userId !== userId) {
    throw new Error("접근 권한이 없습니다");
  }

  // 단어 생성 또는 찾기
  const word = await prisma.word.create({
    data: {
      english: data.english,
      korean: data.korean,
      pronunciation: data.pronunciation,
      level: data.level,
      example: data.example,
    },
  });

  // UserWord 생성
  const userWord = await prisma.userWord.create({
    data: {
      wordListId: listId,
      wordId: word.id,
    },
    include: {
      word: true,
    },
  });

  return userWord;
}
