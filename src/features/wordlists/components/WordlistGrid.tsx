import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteWordAlertDialogContent } from "@/features/wordlists/components/DeleteWordButton";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Word {
  id: string;
  word: {
    id: string;
    english: string;
    korean: string;
    level: string;
    isOfficial: boolean;
    pronunciation: string | null;
    example: string | null;
  } | null;
  customWord: {
    id: string;
    english: string;
    korean: string;
    level: string;
    pronunciation: string | null;
    example: string | null;
  } | null;
}

interface WordlistGridProps {
  words: Word[];
  listId: string;
}

export function WordlistGrid({ words, listId }: WordlistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {words.map((userWord) => (
        <WordlistCard key={userWord.id} userWord={userWord} listId={listId} />
      ))}
    </div>
  );
}

export function WordlistCard({
  userWord,
  listId,
}: {
  userWord: Word;
  listId: string;
}) {
  return (
    <Card key={userWord.id}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{userWord.word?.english || userWord.customWord?.english}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {userWord.word?.level || userWord.customWord?.level}
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <DeleteWordAlertDialogContent
                wordId={userWord.id}
                listId={listId}
              />
            </AlertDialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-2">
          {userWord.word?.korean || userWord.customWord?.korean}
        </p>
        {(userWord.word?.pronunciation ||
          userWord.customWord?.pronunciation) && (
          <p className="text-sm text-gray-500 mb-2">
            [
            {userWord.word?.pronunciation || userWord.customWord?.pronunciation}
            ]
          </p>
        )}
        {(userWord.word?.example || userWord.customWord?.example) && (
          <p className="text-sm text-gray-600 italic">
            {userWord.word?.example || userWord.customWord?.example}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
