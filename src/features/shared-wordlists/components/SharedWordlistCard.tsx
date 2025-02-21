"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { FavoriteButton } from "./FavoriteButton";
// import { WordlistTags } from "./WordlistTags";
import { Eye, Book } from "lucide-react";
import Link from "next/link";

interface Props {
  list: {
    id: string;
    name: string;
    description?: string | null;
    tags: string[];
    viewCount: number;
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
  userId?: string;
}

export function SharedWordlistCard({ list, userId }: Props) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/shared/lists/${list.id}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              {list.name}
            </span>
            {/* {userId && <FavoriteButton listId={list.id} />} */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{list.description}</p>
          {/* <WordlistTags tags={list.tags} /> */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>{list._count.comments} words</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {list.viewCount}
              </span>
            </div>
            <span>by {list.user.name}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
