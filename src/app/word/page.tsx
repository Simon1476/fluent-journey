import { auth } from "@/auth";
import WordStudy from "@/components/word/WordStudy";
import { getWords } from "@/lib/actions/word";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function WordPage() {
  const words = await getWords();

  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">영단어 학습</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <WordStudy initialWords={words} />
      </Suspense>
    </div>
  );
}
