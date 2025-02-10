"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const wordFormSchema = z.object({
  english: z.string().min(1, "영단어를 입력해주세요"),
  korean: z.string().min(1, "한글 뜻을 입력해주세요"),
  pronunciation: z.string().optional(),
  level: z.string().min(1, "난이도를 선택해주세요"),
  example: z.string().optional(),
});

interface AddWordModalProps {
  listId: string;
}

export function AddWordModal({ listId }: AddWordModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof wordFormSchema>>({
    resolver: zodResolver(wordFormSchema),
    defaultValues: {
      english: "",
      korean: "",
      pronunciation: "",
      level: "",
      example: "",
    },
  });

  async function onSubmit(values: z.infer<typeof wordFormSchema>) {
    try {
      // TODO: API 구현 필요
      const response = await fetch(`/api/wordlists/${listId}/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("단어 추가 실패");
      }

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("단어 추가 실패:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-50 hover:bg-blue-100 border-blue-200"
        >
          <Book className="w-4 h-4 mr-2 text-blue-600" />
          단어 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl border-2 border-blue-100">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center">
            <Plus className="w-6 h-6 mr-2 text-blue-600" />
            New Vocabulary Entry
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="english"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">English Word</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., apple"
                      {...field}
                      className="border-blue-200 focus:ring-blue-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="korean"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">
                    Korean Meaning
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 사과"
                      {...field}
                      className="border-blue-200 focus:ring-blue-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pronunciation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">Pronunciation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., /ˈæp.əl/"
                      {...field}
                      className="border-blue-200 focus:ring-blue-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">
                    Difficulty Level
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-blue-200 focus:ring-blue-300">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value="BEGINNER"
                        className="hover:bg-blue-600"
                      >
                        Beginner
                      </SelectItem>
                      <SelectItem
                        value="INTERMEDIATE"
                        className="hover:bg-blue-50"
                      >
                        Intermediate
                      </SelectItem>
                      <SelectItem value="ADVANCED" className="hover:bg-blue-50">
                        Advanced
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">
                    Example Sentence
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I enjoy eating fresh apples from the orchard."
                      {...field}
                      className="border-blue-200 focus:ring-blue-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
            >
              단어 추가하기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
