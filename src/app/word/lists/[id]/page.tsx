import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddWordModal } from "@/components/word/AddWordModal";
import { getWordListById } from "@/features/wordlists/server/db/wordlists";
import { redirect } from "next/navigation";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{wordList.name}</h1>
        <AddWordModal listId={id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wordList.words.map((userWord) => (
          <Card key={userWord.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{userWord.word.english}</span>
                <span className="text-sm text-gray-500">
                  {userWord.word.level}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-2">{userWord.word.korean}</p>
              {userWord.word.pronunciation && (
                <p className="text-sm text-gray-500 mb-2">
                  [{userWord.word.pronunciation}]
                </p>
              )}
              {userWord.word.example && (
                <p className="text-sm text-gray-600 italic">
                  {userWord.word.example}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {wordList.words.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">아직 추가된 단어가 없습니다.</p>
          <AddWordModal listId={id} />
        </div>
      )}
    </div>
  );
}
