import { addWordToList } from "@/lib/actions/wordlist";
import { NextResponse } from "next/server";
import { z } from "zod";

const wordSchema = z.object({
  english: z.string().min(1, "영단어를 입력해주세요"),
  korean: z.string().min(1, "한글 뜻을 입력해주세요"),
  pronunciation: z.string().optional(),
  level: z.string().min(1, "난이도를 선택해주세요"),
  example: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { listId: string } }
) {
  const { listId } = params;

  const body = await request.json();
  const result = wordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ errors: result.error.errors }, { status: 400 });
  }

  await addWordToList(listId, result.data);

  return NextResponse.json(
    { message: "단어가 성공적으로 추가되었습니다." },
    { status: 201 }
  );
}
