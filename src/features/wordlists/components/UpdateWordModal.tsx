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
import { Plus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { wordListWordSchema } from "@/features/wordlists/schemas/wordlists";
import { updateWord } from "../server/actions/wordlists";

interface Props {
  listId: string;
  word: {
    id: string;
    english: string;
    korean: string;
    pronunciation: string | null;
    level: string | null;
    example: string | null;
  };
}

export function UpdateWordModal({
  listId,
  word: { id, english, korean, pronunciation, level, example },
}: Props) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof wordListWordSchema>>({
    resolver: zodResolver(wordListWordSchema),
    defaultValues: {
      english,
      korean,
      pronunciation,
      level,
      example,
    },
  });

  async function onSubmit(values: z.infer<typeof wordListWordSchema>) {
    const result = await updateWord(listId, id, values);

    if (result) {
      toast({
        title: result.error ? "Error" : "Success",
        description: result.message,
        variant: result.error ? "destructive" : "default",
        duration: 1500,
      });
    }

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className=" hover:bg-blue-100 border-blue-200">
          <Edit className="w-4 h-4 mr-2 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl border-2 border-blue-100">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center">
            <Plus className="w-6 h-6 mr-2 text-blue-600" />
            단어 수정하기
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="english"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">단어</FormLabel>
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
                  <FormLabel className="text-blue-700">뜻</FormLabel>
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
                      value={field.value || ""}
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
                    defaultValue={field.value || ""}
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
                  <FormLabel className="text-blue-700">예문</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I enjoy eating fresh apples from the orchard."
                      {...field}
                      value={field.value || ""}
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
              단어 수정하기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
