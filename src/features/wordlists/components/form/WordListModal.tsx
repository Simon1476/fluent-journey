"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  createWordList,
  updateWordList,
} from "@/features/wordlists/server/actions/wordlists";
import { wordListCreateSchema } from "@/features/wordlists/schemas/wordlists";
import { Book, Loader2, Plus } from "lucide-react";

interface WordList {
  id: string;
  title: string;
  description: string | null;
}

interface Props {
  wordlist?: WordList;
  buttonText?: string;
  title?: string;
}

export default function WordListModal({
  wordlist,
  buttonText = "새 단어장 만들기",
  title = "새 단어장 만들기",
}: Props) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof wordListCreateSchema>>({
    resolver: zodResolver(wordListCreateSchema),
    defaultValues: wordlist
      ? {
          ...wordlist,
          description: wordlist.description ?? "",
        }
      : {
          title: "",
          description: "",
        },
  });

  async function onSubmit(values: z.infer<typeof wordListCreateSchema>) {
    const action = wordlist
      ? updateWordList.bind(null, wordlist.id)
      : createWordList;
    const data = await action(values);
    if (data.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
        duration: 1500,
      });
    }

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
        >
          <Book className="w-4 h-4 mr-2 text-indigo-600" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl border-2 border-indigo-100">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold text-indigo-800 flex items-center">
            <Plus className="w-6 h-6 mr-2 text-indigo-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
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
                      className="border border-indigo-200 focus-visible:ring-indigo-400"
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
                      className="min-h-24 border border-indigo-200 focus-visible:ring-indigo-400"
                      {...field}
                      value={field.value ?? ""}
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : wordlist ? (
                "단어장 수정하기"
              ) : (
                "단어장 만들기"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
