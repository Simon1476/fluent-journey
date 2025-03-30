"use client";

import { useEffect, useState, useTransition } from "react";
import { Eye } from "lucide-react";
import { incrementSharedListViewCount } from "@/features/shared-wordlists/server/actions/shared-wordlists";

interface ViewCounterProps {
  id: string;
}

export default function ViewCounter({ id }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(0);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const newCount = await incrementSharedListViewCount(id);
      setViewCount(newCount);
    });
  }, [id]);

  return (
    <div className="flex flex-col items-center">
      <Eye className="w-5 h-5 mb-1" />
      <span className="font-bold text-lg">{viewCount}</span>
      <span className="text-xs opacity-80">Views</span>
    </div>
  );
}
