import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteWordAlertDialogContent } from "./DeleteWordAlertDialogContent";

interface Word {
  id: string;
  english: string;
  korean: string;
  level: string | null;
  example: string | null;
  pronunciation: string | null;
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
          <span>{userWord.english}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{userWord.level}</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <DeleteWordAlertDialogContent
                listId={listId}
                wordId={userWord.id}
              />
            </AlertDialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-2">{userWord.korean}</p>
        {userWord.pronunciation && (
          <p className="text-sm text-gray-500 mb-2">
            [{userWord.pronunciation}]
          </p>
        )}
        {userWord.example && (
          <p className="text-sm text-gray-600 italic">{userWord.example}</p>
        )}
      </CardContent>
    </Card>
  );
}
