"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createWordList } from "@/features/wordlists/server/actions/wordlists";
import { wordListCreateSchema } from "@/features/wordlists/schemas/wordlists";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Loader2 } from "lucide-react";
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
    <Card className="w-full max-w-md mx-auto shadow-md border border-gray-200">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <Book className="w-5 h-5 text-indigo-600" />새 단어장 만들기
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 제목 입력 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    단어장 제목
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: TOEIC 필수 단어"
                      className="border border-gray-200 focus-visible:ring-indigo-400"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    기억하기 쉬운 명확한 제목을 사용하세요
                  </FormDescription>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* 설명 입력 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    설명 (선택사항)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="단어장에 대한 설명을 입력해주세요"
                      className="min-h-24 border border-gray-200 focus-visible:ring-indigo-400"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    학습 목적이나 특별한 팁을 포함하면 좋습니다
                  </FormDescription>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* 제출 버튼 (로딩 상태 적용) */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                "단어장 만들기"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
