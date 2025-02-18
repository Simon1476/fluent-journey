"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WordCard {
  id: string;
  english: string;
  korean: string;
  level: string;
  example?: string | null;
  pronunciation?: string | null;
}

interface FlashcardsProps {
  words: WordCard[];
}

export default function Flashcards({ words }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? words.length - 1 : prev - 1));
    setShowFront(true);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1));
    setShowFront(true);
  };

  const currentWord = words[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4 p-2 sm:p-4">
      <div className="text-sm text-gray-500">
        Card {currentIndex + 1} of {words.length}
      </div>

      <div className="flex items-center w-full justify-between gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-blue-50"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>

        <Card
          className="flex-1 h-32 sm:h-48 cursor-pointer transition-all duration-300 transform hover:shadow-lg max-w-md mx-auto"
          onClick={() => setShowFront(!showFront)}
        >
          <div className="h-full flex flex-col items-center justify-center p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">
              {showFront ? currentWord.english : currentWord.korean}
            </div>
            {showFront && currentWord.pronunciation && (
              <div className="text-xs sm:text-sm text-gray-500">
                {currentWord.pronunciation}
              </div>
            )}
            <div className="mt-2 sm:mt-4 text-xs text-blue-600">
              Click to {showFront ? "see meaning" : "see word"}
            </div>
          </div>
        </Card>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-blue-50"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {currentWord.example && (
        <div className="w-full max-w-md text-xs sm:text-sm text-gray-600 text-center mt-2 sm:mt-4 px-4">
          <span className="font-medium">Example:</span> {currentWord.example}
        </div>
      )}

      <div className="flex gap-2 mt-2 sm:mt-4">
        <div
          className={`px-2 py-1 rounded text-xs ${
            currentWord.level === "BEGINNER"
              ? "bg-green-100 text-green-700"
              : currentWord.level === "INTERMEDIATE"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {currentWord.level.toLowerCase()}
        </div>
      </div>
    </div>
  );
}
