import { z } from "zod";

export const wordListCreateSchema = z.object({
  title: z.string().min(1, "단어장 제목을 입력해주세요"),
  description: z.string().optional(),
  words: z
    .array(
      z.object({
        english: z.string().optional().default(""),
        korean: z.string().optional().default(""),
        example: z.string().optional().default(""),
      })
    )
    .default([]),
});

export const wordListWordSchema = z.object({
  english: z.string(),
  korean: z.string(),
  pronunciation: z.string().nullable(),
  level: z.string().nullable(),
  example: z.string().nullable(),
});

export const addToSharedWordListSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
});
