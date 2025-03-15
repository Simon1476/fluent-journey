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
import { deleteWordList } from "../server/actions/wordlists";

interface Props {
  listId: string;
  listName: string;
}

export function DeleteWordListButton({ listId, listName }: Props) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  return (
    <AlertDialogContent className="bg-white border-4 shadow-lg">
      <AlertDialogHeader>
        <AlertDialogTitle>단어장 삭제</AlertDialogTitle>
        <AlertDialogDescription>
          &quot;{listName}&quot; 단어장을 삭제하시겠습니까? 이 작업은 되돌릴 수
          없습니다.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-500 text-red-700 border-0">
          취소
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-red-700"
          onClick={() => {
            startDeleteTransition(async () => {
              const data = await deleteWordList(listId);
              if (data.message) {
                toast({
                  title: data.error ? "Error" : "Success",
                  description: data.message,
                  variant: data.error ? "destructive" : "default",
                });
              }
            });
          }}
          disabled={isDeletePending}
        >
          삭제
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
