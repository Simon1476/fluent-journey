"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { copyWordToList } from "../server/actions/wordlists";
import { wordListWordSchema } from "../schemas/wordlists";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

type WordList = {
  id: string;
  name: string;
  description?: string | null;
};

interface AddToWordListButtonProps {
  data: {
    english: string;
    korean: string;
    pronunciation: string | null;
    level: string | null;
    example: string | null;
  };
  wordLists: WordList[];
}

export function CopyToWordListButton({
  data,
  wordLists,
}: AddToWordListButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddToList = async (
    listId: string,
    data: z.infer<typeof wordListWordSchema>
  ) => {
    setOpen(false);

    startTransition(async () => {
      const result = await copyWordToList(listId, data);

      if (result) {
        toast({
          title: result.error ? "Error" : "Success",
          description: result.message,
          variant: result.error ? "destructive" : "default",
          duration: 3000,
        });
      }
    });
  };

  if (wordLists.length === 0) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          toast({
            title: "단어 추가하기",
            description: "먼저 단어장을 생성해주세요",
          });
        }}
        disabled={isPending}
        className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-300 hover:border-blue-300 transition-colors"
      >
        <Copy className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-300 hover:border-blue-300 shadow-sm transition-all"
          disabled={isPending}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">단어장에 추가</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border border-blue-100 shadow-lg rounded-lg overflow-hidden"
        align="end"
        side="top"
        sideOffset={8}
      >
        <Command className="bg-white">
          <CommandInput
            placeholder="단어장 검색..."
            className="border-b border-blue-100 text-gray-700 placeholder-gray-400 focus-visible:ring-blue-400"
          />
          <CommandList className="max-h-80">
            <CommandEmpty className="py-6 text-center text-gray-500">
              일치하는 단어장이 없습니다.
            </CommandEmpty>
            <CommandGroup
              heading="내 단어장"
              className="text-blue-700 font-medium px-2 pt-2"
            >
              {wordLists.map((list) => (
                <CommandItem
                  key={list.id}
                  onSelect={() => handleAddToList(list.id, data)}
                  className="cursor-pointer rounded-md data-[selected=true]:bg-blue-100  my-1"
                  disabled={isPending}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {list.name}
                    </span>
                    {list.description && (
                      <span className="text-gray-500 text-xs">
                        {list.description.length > 20
                          ? `${list.description.substring(0, 20)}...`
                          : list.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
