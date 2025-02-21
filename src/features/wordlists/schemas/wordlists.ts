import { z } from "zod";

export const wordListCreateSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
});

export const wordListWordSchema = z.object({
  english: z.string(),
  korean: z.string(),
  pronunciation: z.string().optional(),
  level: z.string(),
  example: z.string().optional(),
});

export const addToSharedWordListSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
});
