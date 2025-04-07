"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Eye, ThumbsUp } from "lucide-react";
import { toggleLike } from "@/features/profile/server/actions/likes";
import { Button } from "@/components/ui/button";

interface SharedWordlist {
  name: string;
  id: string;
  updatedAt: Date;
  description: string | null;
  tags: string[];
  isActive: boolean;
}

interface SharedWordListCardProps {
  list: SharedWordlist;
  likesCount: number;
  isLiked: boolean;
}

export function SharedWordListCard({
  list,
  likesCount,
  isLiked,
}: SharedWordListCardProps) {
  const handleLikeToggle = async () => {
    const data = await toggleLike(list.id);

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
      <CardHeader className="pb-2 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-gray-800">{list.name}</CardTitle>
          <Badge
            variant={list.isActive ? "outline" : "destructive"}
            className={
              list.isActive
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            }
          >
            {list.isActive ? "공유중" : "비공개"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-4 space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {list.description && <p>{list.description}</p>}
        </p>
        <div className="flex flex-wrap gap-1">
          {list.tags.map((tag, i) => (
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
      <CardFooter className="flex justify-between items-center text-xs text-gray-500 pt-2 pb-2 border-t border-gray-100">
        <span>마지막 업데이트: {formatDate(list.updatedAt)}</span>
        <div className="flex gap-2 items-center">
          <span className="flex items-center bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm">
            <Eye className="w-4 h-4 mr-1.5" />
            <span>10</span>
          </span>
          <Button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
              isLiked
                ? "bg-pink-600 text-white hover:bg-pink-700"
                : "bg-pink-50 text-pink-600 hover:bg-pink-100"
            }`}
            onClick={handleLikeToggle}
          >
            <ThumbsUp className="w-4 h-4" />
            {likesCount || 0}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
