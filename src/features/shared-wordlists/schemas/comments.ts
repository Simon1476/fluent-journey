import { z } from "zod";

export const commentCreateSchema = z.object({
  content: z
    .string()
    .min(1, "댓글을 입력해주세요")
    .max(500, "댓글은 500자를 넘을 수 없습니다"),
});
