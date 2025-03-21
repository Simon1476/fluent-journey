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
import { deleteWord } from "../server/actions/wordlists";

interface Props {
  title?: string;
  description?: string;
  listId: string;
  wordId: string;
}

export function DeleteWordAlertDialogContent({
  title = "삭제하시겠습니까?",
  description = "이 작업은 되돌릴 수 없으며 영구적으로 삭제됩니다.",
  listId,
  wordId,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <AlertDialogContent className="bg-white border-4 shadow-lg">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-500 text-red-700 border-0">
          취소
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-red-700"
          onClick={() => {
            startTransition(async () => {
              const data = await deleteWord(listId, wordId);
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
