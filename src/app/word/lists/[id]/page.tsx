import { auth } from "@/auth";
import { CreateWordModal } from "@/features/wordlists/components/CreateWordModal";
import { getWordListById } from "@/features/wordlists/server/db/wordlists";
import { redirect } from "next/navigation";
import { WordlistGrid } from "@/features/wordlists/components/WordlistGrid";

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
        <CreateWordModal listId={id} />
      </div>
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
