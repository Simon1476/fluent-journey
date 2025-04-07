"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";
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
import { Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { wordListCreateSchema } from "@/features/wordlists/schemas/wordlists";
import { createWordlist } from "@/features/wordlists/server/actions/wordlists";

export default function CreateVocabularyListForm() {
  const form = useForm<z.infer<typeof wordListCreateSchema>>({
    resolver: zodResolver(wordListCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      words: Array(5).fill({
        english: "",
        korean: "",
        example: "",
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "words",
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof wordListCreateSchema>) {
    const filteredWords =
      values.words?.filter(
        (word) => word.english.trim() !== "" && word.korean.trim() !== ""
      ) || [];

    const dataToSubmit = {
      ...values,
      words: filteredWords,
    };

    const data = await createWordlist(dataToSubmit);

    if (data) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto"
      >
        <div className="space-y-6 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-indigo-900">
                  단어장 제목
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="예: 필수 비즈니스 영어 단어"
                    {...field}
                    className="border-indigo-200 focus:border-indigo-300 rounded-lg p-3"
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-indigo-900">
                  단어장 설명
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="예: 비즈니스 미팅에서 자주 사용되는 영어 단어 모음"
                    className="min-h-24 border-indigo-200 focus:border-indigo-300 rounded-lg p-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-indigo-900">
              단어 카드 ({fields.length}개)
            </h2>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-6 bg-white border border-indigo-100 rounded-xl shadow-sm relative hover:shadow-md transition-shadow duration-300"
            >
              <div className="absolute left-4 top-4 bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="absolute right-4 top-4">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="mt-6 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name={`words.${index}.english`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-800">
                          영단어
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: apple"
                            {...field}
                            className="border-indigo-200 focus:border-indigo-400 rounded-lg p-3"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`words.${index}.korean`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-800">
                          한글 뜻
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: 사과"
                            {...field}
                            className="border-indigo-200 focus:border-indigo-400 rounded-lg p-3"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`words.${index}.example`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-800">
                        예문 (선택사항)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="예: I like to eat apples."
                          {...field}
                          className="border-indigo-200 focus:border-indigo-400 rounded-lg p-3"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full py-6 border border-dashed border-indigo-300 rounded-xl flex items-center justify-center gap-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() =>
              append({
                english: "",
                korean: "",
                example: "",
              })
            }
          >
            <Plus className="h-5 w-5" />
            <span>단어 카드 추가하기 (#{fields.length + 1})</span>
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md hover:shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "단어장 생성중..." : "단어장 생성하기"}
        </Button>
      </form>
    </Form>
  );
}
("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";
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
import { Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { wordListCreateSchema } from "@/features/wordlists/schemas/wordlists";
import { createWordlist } from "@/features/wordlists/server/actions/wordlists";

export default function CreateVocabularyListForm() {
  const form = useForm<z.infer<typeof wordListCreateSchema>>({
    resolver: zodResolver(wordListCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      words: Array(5).fill({
        english: "",
        korean: "",
        example: "",
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "words",
  });

  async function onSubmit(values: z.infer<typeof wordListCreateSchema>) {
    const filteredWords =
      values.words?.filter(
        (word) => word.english.trim() !== "" && word.korean.trim() !== ""
      ) || [];

    const dataToSubmit = {
      ...values,
      words: filteredWords,
    };

    const data = await createWordlist(dataToSubmit);

    if (data) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto"
      >
        <div className="space-y-6 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-indigo-900">
                  단어장 제목
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="예: 필수 비즈니스 영어 단어"
                    {...field}
                    className="border-indigo-200 focus:border-indigo-300 rounded-lg p-3"
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-indigo-900">
                  단어장 설명
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="예: 비즈니스 미팅에서 자주 사용되는 영어 단어 모음"
                    className="min-h-24 border-indigo-200 focus:border-indigo-300 rounded-lg p-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-indigo-900">
              단어 카드 ({fields.length}개)
            </h2>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-6 bg-white border border-indigo-100 rounded-xl shadow-sm relative hover:shadow-md transition-shadow duration-300"
            >
              <div className="absolute left-4 top-4 bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="absolute right-4 top-4">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="mt-6 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name={`words.${index}.english`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-800">
                          영단어
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: apple"
                            {...field}
                            className="border-indigo-200 focus:border-indigo-400 rounded-lg p-3"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`words.${index}.korean`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-800">
                          한글 뜻
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: 사과"
                            {...field}
                            className="border-indigo-200 focus:border-indigo-400 rounded-lg p-3"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`words.${index}.example`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-800">
                        예문 (선택사항)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="예: I like to eat apples."
                          {...field}
                          className="border-indigo-200 focus:border-indigo-400 rounded-lg p-3"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full py-6 border border-dashed border-indigo-300 rounded-xl flex items-center justify-center gap-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() =>
              append({
                english: "",
                korean: "",
                example: "",
              })
            }
          >
            <Plus className="h-5 w-5" />
            <span>단어 카드 추가하기 (#{fields.length + 1})</span>
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          단어장 생성하기
        </Button>
      </form>
    </Form>
  );
}
