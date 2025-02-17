import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Book, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { getWordLists } from "@/features/wordlists/server/db/wordlists";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteWordListButton } from "@/features/wordlists/components/DeleteWordListButton";

export default async function WordListsPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const accountId = session.user.id;
  const lists = await getWordLists(accountId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">내 단어장</h1>
        <Link href="/word/lists/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />새 단어장 만들기
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists?.map((list) => (
          <div key={list.id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <Link
                    className="flex items-center gap-2"
                    key={list.id}
                    href={`/word/lists/${list.id}`}
                  >
                    <Book className="w-5 h-5" />
                    {list.name}
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <DeleteWordListButton
                      listId={list.id}
                      listName={list.name}
                    />
                  </AlertDialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>단어 {list._count.words}개</span>
                  <span>
                    {new Date(list.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {lists?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">아직 만든 단어장이 없습니다.</p>
          <Link href="/word/lists/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />첫 단어장 만들기
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
