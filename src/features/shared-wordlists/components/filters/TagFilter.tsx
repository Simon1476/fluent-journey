"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  const updateUrlParams = (newTags: string[]) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleTagSelect = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((t) => t !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newTags);
    updateUrlParams(newTags);
  };

  const clearAllTags = () => {
    setSelectedTags([]);
    updateUrlParams([]);
  };

  useEffect(() => {
    const tagsParam = searchParams?.get("tags");
    if (tagsParam) {
      const tags = tagsParam.split(",").filter(Boolean);
      setSelectedTags(tags);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[140px] border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            >
              태그
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-100">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-3 bg-white" align="start">
            <div className="space-y-2">
              <h4 className="font-medium leading-none mb-3">학습 태그 선택</h4>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <Button
                    key={tag.id}
                    onClick={() => handleTagSelect(tag.id)}
                    className={cn(
                      "px-2.5 py-0.5 h-7 text-sm font-medium transition-colors rounded-full",
                      tag.color,
                      selectedTags.includes(tag.id) && "ring-2 ring-offset-1",
                      !selectedTags.includes(tag.id) && "opacity-70"
                    )}
                    variant="ghost"
                    size="sm"
                  >
                    {tag.id}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllTags}
            className="h-7 px-2 text-gray-500 hover:text-gray-700"
          >
            초기화
          </Button>
        )}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {selectedTags.map((tagId) => {
              const tag = TAGS.find((t) => t.id === tagId);
              return (
                <Badge
                  key={tagId}
                  className={cn(
                    "px-2 py-0.5 text-sm cursor-pointer",
                    tag?.color
                  )}
                  onClick={() => handleTagSelect(tagId)}
                >
                  {tagId} ✕
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
