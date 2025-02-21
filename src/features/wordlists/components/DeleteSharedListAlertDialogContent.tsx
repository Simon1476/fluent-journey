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
import { deleteSharedWordlist } from "../server/actions/wordlists";

interface DeleteAlertProps {
  title?: string;
  description?: string;
  listId: string;
}

export default function DeleteSharedListAlertDialogContent({
  title = "삭제하시겠습니까?",
  description = "이 작업은 되돌릴 수 없으며 영구적으로 삭제됩니다.",
  listId,
}: DeleteAlertProps) {
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
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-red-700"
          onClick={() => {
            startTransition(async () => {
              const data = await deleteSharedWordlist(listId);
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
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
