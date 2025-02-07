import { prisma } from "@/lib/prisma";

export async function getWords() {
  const words = await prisma.word.findMany({
    select: {
      id: true,
      english: true,
      korean: true,
      level: true,
      example: true,
      pronunciation: true,
    },
  });
  return words;
}

// 다른 단어 관련 데이터베이스 함수들
export async function createWord(data: {
  english: string;
  korean: string;
  pronunciation?: string;
  level: string;
  example?: string;
}) {
  const word = await prisma.word.create({
    data: {
      english: data.english,
      korean: data.korean,
      level: data.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      example: data.example,
    },
  });
  return word;
}

export async function updateWord() {
  /* ... */
}
export async function deleteWord() {
  /* ... */
}
