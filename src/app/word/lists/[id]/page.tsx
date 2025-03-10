import { auth } from "@/auth";
import { CreateWordModal } from "@/features/wordlists/components/CreateWordModal";
import { getWordListById } from "@/features/wordlists/server/db/wordlists";
import { redirect } from "next/navigation";
import { WordlistGrid } from "@/features/wordlists/components/WordlistGrid";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Flashcards from "@/components/Flashcards";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WordListPage({ params }: Props) {
  const id = (await params).id;

  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const accountId = session.user.id;
  const wordList = await getWordListById(accountId, id);
  if (!wordList) {
    return <div>단어장을 찾을 수 없습니다.</div>;
  }

  // 단어 데이터 형식 변환
  const studyWords = wordList.words.map((userWord) => ({
    id: userWord.id,
    english: userWord.english,
    korean: userWord.korean,
    level: userWord.level,
    example: userWord.example,
    pronunciation: userWord.pronunciation,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center gap-4 mb-8 flex-col sm:flex-row">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:justify-start">
          {wordList.name}
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          {wordList.words.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 h-9 px-3 text-sm font-medium border-gray-200 hover:bg-gray-50"
                >
                  <Brain className="w-4 h-4 text-gray-600" />
                  단어 테스트
                </Button>
              </DialogTrigger>
              <DialogOverlay className="bg-black/50" />
              <DialogContent className="max-w-2xl bg-white sm:rounded">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    단어 학습
                  </DialogTitle>
                </DialogHeader>
                <Flashcards words={studyWords} />
              </DialogContent>
            </Dialog>
          )}
          <CreateWordModal listId={id} />
        </div>
      </div>
      {/* 단어장 목록 */}
      <WordlistGrid words={wordList.words} listId={id} />
      {wordList.words.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">아직 추가된 단어가 없습니다.</p>
          <CreateWordModal listId={id} />
        </div>
      )}
    </div>
  );
}
