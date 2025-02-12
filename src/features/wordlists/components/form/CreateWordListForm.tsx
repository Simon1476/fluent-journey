"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
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

import { createWordList } from "@/features/wordlists/server/actions/wordlists";
import { wordListCreateSchema } from "@/features/wordlists/schemas/wordlists";
export default function CreateWordListForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof wordListCreateSchema>>({
    resolver: zodResolver(wordListCreateSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof wordListCreateSchema>) {
    const data = await createWordList(values);
    if (data.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
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
