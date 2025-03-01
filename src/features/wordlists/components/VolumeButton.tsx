"use client";

import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { speakWord } from "@/lib/speak";

export function VolumeButton({ word }: { word: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full hover:bg-black/5"
      onClick={() => speakWord(word)}
    >
      <Volume2 className="h-4 w-4 text-gray-600" />
    </Button>
  );
}
