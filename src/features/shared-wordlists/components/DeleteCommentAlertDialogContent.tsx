"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { deleteComment } from "@/features/shared-wordlists/server/actions/comments";

interface Props {
  commentId: string;
}

export default function DeleteCommentAlertDialogContent({ commentId }: Props) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <AlertDialogContent className="bg-white border-4 shadow-lg">
      <AlertDialogHeader>
        <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
        <AlertDialogDescription>
          댓글을 완전히 삭제할까요?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-500 text-red-700 border-0">
          취소
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-red-700"
          onClick={() => {
            startTransition(async () => {
              const data = await deleteComment(commentId);
              if (data.message) {
                toast({
                  title: data.error ? "Error" : "Success",
                  description: data.message,
                  variant: data.error ? "destructive" : "default",
                });
              }
            });
          }}
          disabled={isPending}
        >
          삭제
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
