"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Plus } from "lucide-react";
import Link from "next/link";

export function NoSharedWordlists() {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-blue-100 p-3">
          <Share2 className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          아직 공유된 단어장이 없습니다
        </h3>
        <p className="text-gray-500 max-w-sm">
          첫 번째로 단어장을 공유해보세요! 다른 사람들과 함께 학습하면 더
          효과적입니다.
        </p>
        <div className="flex gap-3">
          <Link href="/word/lists">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />내 단어장 공유하기
            </Button>
          </Link>
          <Link href="/create-set">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />새 단어장 만들기
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
