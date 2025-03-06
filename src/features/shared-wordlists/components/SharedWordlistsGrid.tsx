"use client";

import { SharedWordlistCard } from "./SharedWordlistCard";
import { NoSharedWordlists } from "./NoSharedWordlists";

interface SharedWordList {
  id: string;
  name: string;
  description: string | null;
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
}

interface BookMark {
  userId: string;
  id: string;
  createdAt: Date;
  listId: string;
}

interface Like {
  id: string;
  createdAt: Date;
  userId: string;
  listId: string;
}

interface Props {
  lists: SharedWordList[] | null;
  bookmarks: BookMark[];
  likes: Like[];
}

export function SharedWordlistsGrid({ lists, bookmarks, likes }: Props) {
  if (!lists?.length) {
    return <NoSharedWordlists />;
  }

  const bookmarkedSet = new Set(bookmarks.map((bookmark) => bookmark.listId));
  const likedSet = new Set(likes.map((like) => like.listId));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lists
        .filter((list) => list.isActive)
        .map((list) => {
          const listLikes = likes.filter(
            (like) => like.listId === list.id
          ).length;
          return (
            <SharedWordlistCard
              key={list.id}
              list={list}
              isBookmarked={bookmarkedSet.has(list.id)}
              isLiked={likedSet.has(list.id)}
              likeCount={listLikes} // 수정된 부분
            />
          );
        })}
    </div>
  );
}
