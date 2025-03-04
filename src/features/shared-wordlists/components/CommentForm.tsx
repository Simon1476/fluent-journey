"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createComment, updateComment } from "../server/actions/comments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { commentCreateSchema } from "../schemas/comments";

interface Props {
  listId: string;
  editComment: { id: string; content: string } | null;
  onCancelEdit?: () => void;
  onUpdateComment?: () => void;
}

export function CommentForm({
  listId,
  editComment,
  onCancelEdit,
  onUpdateComment,
}: Props) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof commentCreateSchema>>({
    resolver: zodResolver(commentCreateSchema),
    defaultValues: {
      content: editComment?.content || "",
    },
  });

  const isContentChanged = form.watch("content") !== editComment?.content; // 댓글 내용이 수정되었는지 여부 확인

  async function onSubmit(values: z.infer<typeof commentCreateSchema>) {
    const action = editComment
      ? updateComment.bind(null, editComment.id)
      : createComment.bind(null, listId);
    const data = await action(values);

    if (data) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });

      if (!data.error && editComment) {
        onUpdateComment?.();
      }
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="이 단어장은..."
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
          className="w-full sm:w-auto cursor-pointer"
          disabled={!isContentChanged}
        >
          {editComment ? "수정" : "댓글 작성"}
        </Button>
        {editComment && (
          <Button
            type="submit"
            className="w-full sm:w-auto cursor-pointer"
            onClick={onCancelEdit}
          >
            취소
          </Button>
        )}
      </form>
    </Form>
  );
}
