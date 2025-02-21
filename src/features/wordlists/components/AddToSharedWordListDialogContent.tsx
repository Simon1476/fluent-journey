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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { addToSharedlist } from "@/features/wordlists/server/actions/wordlists";
import { addToSharedWordListSchema } from "@/features/wordlists/schemas/wordlists";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Book, Plus } from "lucide-react";

const TAGS = [
  { id: "TOEIC", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { id: "TOEFL", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
  {
    id: "비즈니스",
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  },
  { id: "여행", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { id: "일상", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
  { id: "학술", color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { id: "초급", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { id: "중급", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
  { id: "고급", color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
];

export default function AddToSharedWordListForm({
  listTitle,
  listId,
}: {
  listTitle: string;
  listId: string;
}) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof addToSharedWordListSchema>>({
    resolver: zodResolver(addToSharedWordListSchema),
    defaultValues: {
      name: listTitle,
      description: "",
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof addToSharedWordListSchema>) {
    const data = await addToSharedlist(listId, values);
    if (data.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
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
          className="bg-blue-50 hover:bg-blue-100 border-blue-200"
        >
          <Book className="w-4 h-4 mr-2 text-blue-600" />
          단어장 공유하기
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>공유 단어장 제목</FormLabel>
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

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>태그 선택</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <Button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const currentTags = field.value || [];
                            const newTags = currentTags.includes(tag.id)
                              ? currentTags.filter((t) => t !== tag.id)
                              : [...currentTags, tag.id];
                            field.onChange(newTags);
                          }}
                          className={cn(
                            "rounded-full px-4 py-1 font-medium transition-colors",
                            tag.color,
                            field.value?.includes(tag.id)
                              ? "ring-2 ring-offset-2"
                              : "opacity-70"
                          )}
                          variant="ghost"
                          size="sm"
                        >
                          {tag.id}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((tagId) => (
                      <Badge
                        key={tagId}
                        className={cn(
                          "px-3 py-1",
                          TAGS.find((t) => t.id === tagId)?.color
                        )}
                      >
                        {tagId}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              단어장 공유하기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
