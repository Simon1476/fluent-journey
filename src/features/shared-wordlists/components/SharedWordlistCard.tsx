"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Book, MessageSquare, Heart, User, Bookmark } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { toggleBookmark } from "@/features/shared-wordlists/server/actions/bookmark";
import { toggleLike } from "@/features/shared-wordlists/server/actions/like";

interface Props {
  list: {
    id: string;
    name: string;
    description?: string | null;
    tags: string[];
    isActive: boolean;
    stats: {
      viewCount: number;
    } | null;
    _count: {
      comments: number;
      likes: number;
    };
    user: {
      id: string;
      image: string | null;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  isBookmarked: boolean;
  isLiked: boolean;
  likeCount: number;
}

export function SharedWordlistCard({
  list,
  isBookmarked,
  isLiked,
  likeCount,
}: Props) {
  const handleToggle = async () => {
    const data = await toggleBookmark(list.id);
    if (data) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  };
  const handleToggleLike = async () => {
    const data = await toggleLike(list.id); // 좋아요 토글 처리
    if (data) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
      <Link href={`/shared/lists/${list.id}`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-indigo-800">
              <Book className="w-5 h-5 text-indigo-600" />
              {list.name}
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              단어장
            </span>
          </CardTitle>
        </CardHeader>
      </Link>

      <CardContent className="p-4">
        {list.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{list.description}</p>
        )}

        {list.tags && list.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {list.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {list.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                +{list.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              {list._count.comments}
            </span>
            <button
              className={`flex gap-1 items-center text-gray-400 hover:text-indigo-600 transition-colors ${
                isLiked ? "text-indigo-600" : ""
              }`}
              onClick={handleToggleLike}
              aria-label="Toggle Like"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked ? "fill-red-600 text-red-600" : "text-gray-400"
                }`}
              />
              {likeCount ? likeCount : 0}
            </button>

            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-400" />
              {list.stats ? list.stats.viewCount : 0}
            </span>
            <button
              className={`flex items-centertext-gray-400 hover:text-indigo-600 transition-colors ${
                isBookmarked ? "text-indigo-600" : ""
              }`}
              onClick={handleToggle}
              aria-label="Toggle Bookmark"
            >
              <Bookmark
                className={`w-5 h-5 transition-colors ${
                  isBookmarked
                    ? "fill-indigo-600 text-indigo-600"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>
          <span className="flex items-center gap-1 text-xs">
            <User className="w-3 h-3 text-gray-400" />
            {list.user.name || "Anonymous"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
