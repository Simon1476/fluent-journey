"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VolumeButton from "@/features/shared-wordlists/components/VolumeButton";
import CustomPagination from "@/components/CustomPagination";
import { CopyToWordListButton } from "@/features/wordlists/components/CopyToWordListButton";

const ITEMS_PER_PAGE = 15;

interface Word {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  wordListId: string;
  english: string;
  korean: string;
  level: string | null;
  example: string | null;
  pronunciation: string | null;
  status: string | null;
  lastReviewed: Date | null;
  reviewCount: number;
  note: string | null;
}

interface WordList {
  id: string;
  name: string;
  description?: string | null;
}

interface Props {
  words: Word[];
  wordLists: WordList[];
}
export default function PaginatedWordsList({ words = [], wordLists }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleWords = words.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (words.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p className="text-gray-500">No words found in this list.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 단어 목록 컨테이너 - 동적 높이와 최소 높이 모두 설정 */}
      <div className="grid gap-4 min-h-96">
        {visibleWords.map((word, index) => {
          const globalIndex = startIndex + index;
          const data = {
            english: word.english,
            korean: word.korean,
            example: word.example,
            pronunciation: word.pronunciation,
            level: word.level,
          };

          return (
            <Card
              key={word.id || globalIndex}
              className="overflow-hidden border-0 shadow-sm hover:shadow transition-all duration-200"
            >
              <div
                className={`flex items-stretch ${
                  globalIndex % 2 === 0
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                    : "bg-gradient-to-r from-amber-50 to-yellow-50"
                }`}
              >
                <div className="min-w-16 bg-opacity-10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-300">
                    {globalIndex + 1}
                  </span>
                </div>
                <CardHeader className="py-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {word.english}
                      </h3>
                      <p className="text-gray-500 text-sm">{word.korean}</p>
                    </div>
                    <div>
                      <VolumeButton word={word.english} />
                      <CopyToWordListButton wordLists={wordLists} data={data} />
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="py-3 px-6 bg-white border-t text-sm italic text-gray-600">
                {word.example ? `"${word.example}"` : <span>&nbsp;</span>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 페이지네이션 컨트롤 */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
