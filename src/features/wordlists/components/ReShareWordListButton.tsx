"use client";

import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { addToSharedlist } from "@/features/wordlists/server/actions/wordlists";

interface Props {
  listId: string;
  sharedWordList: {
    id: string;
    name: string;
    description?: string | null;
    tags: string[];
  };
}

export default function ReShareWordListButton({
  listId,
  sharedWordList,
}: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleReShare = async () => {
    setIsLoading(true);
    const result = await addToSharedlist(listId, {
      name: sharedWordList.name,
      description: sharedWordList.description || "",
      tags: sharedWordList.tags,
    });

    toast({
      title: result.error ? "Error" : "Success",
      description: result.message,
      variant: result.error ? "destructive" : "default",
      duration: 1500,
    });

    setIsLoading(false);
  };

  return (
    <Button
      variant="outline"
      className="w-full bg-purple-50 hover:bg-purple-100 border-purple-200"
      onClick={handleReShare}
      disabled={isLoading}
    >
      <Book className="w-4 h-4 mr-2 text-purple-600" />
      {isLoading ? "재공유 중..." : "단어장 재공유하기"}
    </Button>
  );
}
