import { auth } from "@/auth";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Plus,
  Book,
  Trash2,
  GraduationCap,
  Clock,
  Award,
  Edit,
} from "lucide-react";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { getWordLists } from "@/features/wordlists/server/db/wordlists";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteWordListButton } from "@/features/wordlists/components/DeleteWordListButton";
import DeleteSharedListAlertDialogContent from "@/features/wordlists/components/DeleteSharedListAlertDialogContent";
import AddToSharedWordListForm from "@/features/wordlists/components/AddToSharedWordListDialogContent";
import WordListModal from "@/features/wordlists/components/form/WordListModal";

export default async function WordListsPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const accountId = session.user.id;
  const lists = await getWordLists(accountId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section with Statistics */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            My Vocabulary Collections
          </h1>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="flex justify-center mb-2">
                <div className="bg-blue-100 rounded-full p-2">
                  <Book className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {lists?.length || 0}
              </p>
              <p className="text-sm text-gray-500">전체 단어장</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="flex justify-center mb-2">
                <div className="bg-indigo-100 rounded-full p-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {lists?.reduce((sum, list) => sum + list.words.length, 0) || 0}
              </p>
              <p className="text-sm text-gray-500">전체 단어수</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="flex justify-center mb-2">
                <div className="bg-purple-100 rounded-full p-2">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {lists?.filter((list) => list.isPublic).length || 0}
              </p>
              <p className="text-sm text-gray-500">공유된 단어장</p>
            </div>
          </div>

          <WordListModal />
        </div>

        {/* Word Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists?.map((list) => (
            <div key={list.id} className="group">
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white group-hover:translate-y-[-4px]">
                <div
                  className={`h-2 w-full ${
                    list.isPublic ? "bg-green-500" : "bg-blue-500"
                  }`}
                ></div>
                <CardHeader className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        list.isPublic ? "bg-green-100" : "bg-blue-100"
                      }`}
                    >
                      <Book
                        className={`w-5 h-5 ${
                          list.isPublic ? "text-green-600" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <Link className="flex-1" href={`/word/lists/${list.id}`}>
                      <h3 className="flex text-xl font-bold text-gray-800 hover:text-blue-600 truncate">
                        {list.name}
                        {list.sharedWordList?.name && (
                          <span className="bg-blue-100 text-blue-600 text-sm rounded-full ml-2 px-2 py-1">
                            {list.sharedWordList.name}
                          </span>
                        )}
                      </h3>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {list.words.length}{" "}
                        {list.words.length === 1 ? "word" : "words"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(list.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 mb-4">
                    <div className="flex-1">
                      <WordListModal
                        wordlist={{
                          id: list.id,
                          title: list.name,
                          description: list.description,
                        }}
                        buttonText="단어장 수정"
                        title="단어장 수정하기"
                      />
                    </div>
                    <Link href={`/word/lists/${list.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Study
                      </Button>
                    </Link>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    {list.isPublic ? (
                      <div className="flex-1">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            >
                              공유 취소
                            </Button>
                          </AlertDialogTrigger>
                          {list.sharedWordList && (
                            <DeleteSharedListAlertDialogContent
                              title="단어장 공유를 그만하시겠습니까?"
                              description="이 작업은 공유 단어장에서 선택한 단어장을 제거합니다."
                              listId={list.id}
                              sharedListId={list.sharedWordList.id}
                            />
                          )}
                        </AlertDialog>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <AddToSharedWordListForm
                          listTitle={list.name}
                          listId={list.id}
                        />
                      </div>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-600 hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <DeleteWordListButton
                        listId={list.id}
                        listName={list.name}
                      />
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {lists?.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-blue-100 max-w-md mx-auto">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Book className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              아직 단어장이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              단어장을 만들어 학습을 시작해보세요
            </p>
            <Link href="/word/lists/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />첫 단어장 만들기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
