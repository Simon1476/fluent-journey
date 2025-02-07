"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useToast } from "@/hooks/use-toast";

interface Word {
  id: string;
  english: string;
  korean: string;
  level: string;
  example?: string | null;
  pronunciation?: string | null;
}

interface Props {
  initialWords: Word[];
}

export default function WordStudy({ initialWords }: Props) {
  const [allWords] = useState<Word[]>(initialWords);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [studiedWordIds, setStudiedWordIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isStudying, setIsStudying] = useState(false);

  const { toast } = useToast();

  const getRandomWords = (count: number) => {
    const availableWords = allWords.filter(
      (word) => !studiedWordIds.has(word.id)
    );
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const startNewStudySession = () => {
    const newWords = getRandomWords(10);
    setCurrentWords(newWords);
    setCurrentIndex(0);
    setShowMeaning(false);
    setIsStudying(true);
  };

  const handleNextWord = () => {
    setShowMeaning(false);
    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 현재 학습한 단어들의 ID를 studiedWordIds에 추가
      const newStudiedIds = new Set(studiedWordIds);
      currentWords.forEach((word) => newStudiedIds.add(word.id));
      setStudiedWordIds(newStudiedIds);

      // 학습 세션 종료
      setIsStudying(false);
      setCurrentIndex(0);

      // 남은 학습 가능한 단어 수 확인
      const remainingWords = allWords.length - newStudiedIds.size;
      if (remainingWords > 0) {
        toast({
          title: "학습 완료!",
          description: `아직 ${remainingWords}개의 단어가 남아있습니다.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "학습 완료!",
          description: `모든 단어를 학습했습니다!`,
          variant: "destructive",
        });
        setStudiedWordIds(new Set());
      }
    }
  };

  if (!isStudying) {
    return (
      <Card className="p-6 text-center bg-red-500">
        <h2 className="text-xl font-bold mb-4 ">단어 학습</h2>
        <p className="mb-4">
          학습한 단어 수: {studiedWordIds.size} / {allWords.length}
        </p>
        <Button onClick={startNewStudySession}>
          {studiedWordIds.size === 0
            ? "학습 시작하기"
            : "다음 단어 세트 학습하기"}
        </Button>
      </Card>
    );
  }

  const currentWord = currentWords[currentIndex];
  const progress = ((currentIndex + 1) / currentWords.length) * 100;

  return (
    <Card className="p-6 bg-red-400">
      <div className="mb-4">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500 mt-2">
          {currentIndex + 1} / {currentWords.length} 단어
        </p>
      </div>

      <div className="text-center space-y-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">{currentWord.english}</h2>
          {currentWord.pronunciation && (
            <p className="text-gray-500">[{currentWord.pronunciation}]</p>
          )}
        </div>

        <div className="min-h-[120px] flex flex-col items-center justify-center">
          {showMeaning ? (
            <div className="space-y-4">
              <p className="text-2xl">{currentWord.korean}</p>
              {currentWord.example && (
                <p className="text-gray-600 italic">
                  Example: {currentWord.example}
                </p>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center">
              <Button
                onClick={() => setShowMeaning(true)}
                className="w-full md:w-auto"
              >
                뜻 보기
              </Button>
            </div>
          )}
        </div>
      </div>

      {showMeaning && (
        <div className="flex justify-center gap-4">
          <Button onClick={handleNextWord} className="w-full md:w-auto">
            {currentIndex < currentWords.length - 1 ? "다음 단어" : "학습 완료"}
          </Button>
        </div>
      )}
    </Card>
  );
}
