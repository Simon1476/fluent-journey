"use client";

import { SharedWordlistCard } from "./SharedWordlistCard";
import { NoSharedWordlists } from "./NoSharedWordlists";

interface SharedWordList {
  id: string;
  name: string;
  description: string | null;
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
}

interface Props {
  lists: SharedWordList[] | null;
  userId?: string;
}

export function SharedWordlistsGrid({ lists, userId }: Props) {
  if (!lists?.length) {
    return <NoSharedWordlists />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lists.map((list) => (
        <SharedWordlistCard key={list.id} list={list} userId={userId} />
      ))}
    </div>
  );
}
