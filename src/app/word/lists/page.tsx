import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Book, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { getWordLists } from "@/features/wordlists/server/db/wordlists";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteWordListButton } from "@/features/wordlists/components/DeleteWordListButton";
import DeleteSharedListAlertDialogContent from "@/features/wordlists/components/DeleteSharedListAlertDialogContent";
import AddToSharedWordListForm from "@/features/wordlists/components/AddToSharedWordListDialogContent";
import { formatDate } from "@/lib/utils";

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
                  <div className="flex gap-1 items-center">
                    {list.isPublic ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100 border-red-200"
                          >
                            <Book className="w-4 h-4 mr-2 text-red-600" />
                            공유 취소하기
                          </Button>
                        </AlertDialogTrigger>
                        {list.sharedWordList && (
                          <DeleteSharedListAlertDialogContent
                            title="공유를 취소하시겠습니까?"
                            description="이 작업은 공유한 작업장을 삭제 합니다"
                            listId={list.id}
                            sharedListId={list.sharedWordList.id}
                          />
                        )}
                      </AlertDialog>
                    ) : (
                      <AddToSharedWordListForm
                        listTitle={list.name}
                        listId={list.id}
                      />
                    )}
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
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>단어 {list.words.length}개</span>
                  <span>{formatDate(list.createdAt)}</span>
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
