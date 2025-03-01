"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteWordAlertDialogContent } from "./DeleteWordAlertDialogContent";
import { Badge } from "@/components/ui/badge";
import { UpdateWordModal } from "./UpdateWordModal";
import VolumeButton from "@/features/shared-wordlists/components/VolumeButton";

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
      {words.map((userWord, index) => (
        <WordlistCard
          key={userWord.id}
          userWord={userWord}
          listId={listId}
          index={index}
        />
      ))}
    </div>
  );
}

export function WordlistCard({
  userWord,
  listId,
  index,
}: {
  userWord: Word;
  listId: string;
  index: number;
}) {
  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-lg
      ${
        index % 3 === 0
          ? "bg-gradient-to-br from-blue-50 to-indigo-50"
          : index % 3 === 1
          ? "bg-gradient-to-br from-emerald-50 to-teal-50"
          : "bg-gradient-to-br from-amber-50 to-orange-50"
      }`}
    >
      <CardHeader className="p-4 border-b bg-white/50 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-800">
                {userWord.english}
              </h3>
              {userWord.level && (
                <Badge variant="secondary" className="text-xs">
                  {userWord.level}
                </Badge>
              )}
            </div>
            {userWord.pronunciation && (
              <p className="text-sm text-gray-500 font-mono">
                [{userWord.pronunciation}]
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <VolumeButton word={userWord.english} />
            <UpdateWordModal listId={listId} word={userWord} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
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
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-lg text-gray-700">{userWord.korean}</p>
        {userWord.example && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600 italic leading-relaxed">
              &quot;{userWord.example}&quot;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
