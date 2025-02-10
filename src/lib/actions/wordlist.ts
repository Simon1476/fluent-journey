"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("인증이 필요합니다");
  }

  const account = await prisma.account.findFirst({
    where: {
      providerAccountId: String(session.user.id),
    },
    select: { userId: true },
  });

  if (!account) {
    throw new Error("유저를 찾을 수 없습니다.");
  }

  return account.userId;
}

export async function createWordList(data: { title: string }) {
  const userId = await getUserId();

  const list = await prisma.userWordList.create({
    data: {
      name: data.title,
      userId,
    },
  });

  return list;
}

export async function getWordLists() {
  const userId = await getUserId();

  const lists = await prisma.userWordList.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: { words: true },
      },
    },
  });
  return lists;
}

export async function getWordListById(id: string) {
  const userId = await getUserId();

  const wordList = await prisma.userWordList.findUnique({
    where: {
      id: id,
    },
    include: {
      words: {
        include: {
          word: true,
        },
      },
    },
  });

  if (!wordList) {
    return null;
  }

  if (wordList.userId !== userId) {
    throw new Error("접근 권한이 없습니다");
  }

  return wordList;
}

export async function addWordToList(
  listId: string,
  data: {
    english: string;
    korean: string;
    pronunciation?: string;
    level: string;
    example?: string;
  }
) {
  const userId = await getUserId();

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
