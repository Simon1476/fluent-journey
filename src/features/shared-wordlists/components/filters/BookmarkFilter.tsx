"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function BookmarkFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();

  const bookmarksOnly = searchParams.get("bookmarksOnly") === "true";

  const toggleFavorites = () => {
    const params = new URLSearchParams(searchParams);

    if (bookmarksOnly) {
      params.delete("bookmarksOnly");
    } else {
      params.set("bookmarksOnly", "true");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-4">
      {/* 즐겨찾기 필터 토글 버튼 */}
      <Button
        onClick={toggleFavorites}
        className={`w-[140px] border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 ${
          bookmarksOnly ? "text-indigo-600" : "text-gray-500"
        } hover:text-indigo-800`}
      >
        {bookmarksOnly ? "즐겨찾기 제외" : "즐겨찾기만 보기"}
      </Button>
    </div>
  );
}
