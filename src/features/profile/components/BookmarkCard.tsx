"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookMarked, User, X } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { toggleBookmark } from "@/features/shared-wordlists/server/actions/bookmark";
import { toast } from "@/hooks/use-toast";

interface Bookmark {
  id: string;
  createdAt: Date;
  sharedList: {
    id: string;
    name: string;
    description: string | null;
    tags: string[];
    user: { name: string | null };
  };
}

export function BookmarkCard({ createdAt, sharedList }: Bookmark) {
  const handleCancelBookmark = async () => {
    const data = await toggleBookmark(sharedList.id);

    if (data) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
        duration: 1500,
      });
    }
  };

  return (
    <Card className="flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow bg-white border-none shadow-md overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <Link href={`/shared/lists/${sharedList.id}`}>
            <CardTitle className="text-lg text-gray-800 hover:text-blue-600 transition-colors">
              {sharedList.name}
            </CardTitle>
          </Link>
          <div className="flex items-center">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="h-3.5 w-3.5 text-gray-500" />
              <span className="font-medium text-gray-700">
                {sharedList.user?.name || "Anonymous"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
              onClick={handleCancelBookmark}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">즐겨찾기 제거</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {sharedList.description || "설명이 없습니다."}
        </p>

        <div className="flex flex-wrap gap-1">
          {sharedList.tags.map((tag, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs bg-indigo-50 text-indigo-600 border-indigo-100"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-500 p-4 border-t border-gray-100">
        <span>추가 날짜 {formatDate(createdAt)}</span>
        <BookMarked className="h-3 w-3 text-blue-500" />
      </CardFooter>
    </Card>
  );
}
