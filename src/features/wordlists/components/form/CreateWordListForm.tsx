"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createWordList } from "@/features/wordlists/server/actions/wordlists";
import { useSession } from "next-auth/react";

const WordListSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
});

export default function CreateWordListForm() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/signin");
  }

  const accountId = session?.user.id;

  const form = useForm<z.infer<typeof WordListSchema>>({
    resolver: zodResolver(WordListSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof WordListSchema>) {
    if (!accountId) return;
    try {
      const list = await createWordList(accountId, values);
      router.push(`/word/lists/${list.id}`);
    } catch (error) {
      console.error("단어장 생성 실패:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>단어장 제목</FormLabel>
              <FormControl>
                <Input placeholder="예: TOEIC 필수 단어" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택사항)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="단어장에 대한 설명을 입력해주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          단어장 만들기
        </Button>
      </form>
    </Form>
  );
}
