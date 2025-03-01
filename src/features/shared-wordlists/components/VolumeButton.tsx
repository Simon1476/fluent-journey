"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakWord } from "@/lib/speak";

export default function VolumeButton({ word }: { word: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-8 h-8"
      onClick={() => speakWord(word)}
    >
      <Volume2 className="w-4 h-4 text-blue-600" />
    </Button>
  );
}
