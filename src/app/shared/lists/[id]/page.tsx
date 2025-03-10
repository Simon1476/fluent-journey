import { auth } from "@/auth";
import { getSharedWordListById } from "@/features/shared-wordlists/server/db/shared-wordlists";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, BookOpen, Share2, Download } from "lucide-react";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import ViewCounter from "@/features/shared-wordlists/components/ViewCounter";
import { CommentSection } from "@/features/shared-wordlists/components/CommentSection";
import { getCommentsByWordListId } from "@/features/shared-wordlists/server/db/comments";
import PaginatedWordsList from "@/features/shared-wordlists/components/pagination/PaginatedWordsList";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Flashcards from "@/components/Flashcards";

export default async function SharedListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const { id } = await params;

  const sharedList = await getSharedWordListById(id);
  const comments = await getCommentsByWordListId(id);

  if (!sharedList) {
    redirect("/shared/lists");
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      {/* 상단 헤더 섹션 - 모바일 반응형 개선 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* 왼쪽 정보 섹션 */}
            <div className="space-y-4 w-full md:max-w-2xl">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white">
                  <AvatarImage src={sharedList.user.image || ""} />
                  <AvatarFallback className="bg-indigo-400">
                    {sharedList.user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm sm:text-base">
                    {sharedList.user.name}
                  </p>
                  <p className="text-xs opacity-80">
                    {formatDate(sharedList.createdAt)}
                  </p>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {sharedList.name}
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                {sharedList.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {sharedList.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-white/20 hover:bg-white/30 text-white border-none text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 오른쪽 통계 및 버튼 섹션 */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              {/* 통계 정보 */}
              <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm w-full">
                <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center">
                  <ViewCounter id={id} />

                  <div className="flex flex-col items-center">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                    <span className="font-bold text-base sm:text-lg">
                      {sharedList._count.likes}
                    </span>
                    <span className="text-xs opacity-80">Likes</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                    <span className="font-bold text-base sm:text-lg">
                      {sharedList._count.comments}
                    </span>
                    <span className="text-xs opacity-80">Comments</span>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 justify-center sm:justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white text-indigo-700 hover:bg-white/90 text-xs sm:text-sm"
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      단어 테스트
                    </Button>
                  </DialogTrigger>
                  <DialogOverlay className="bg-black/50" />
                  <DialogContent className="max-w-2xl bg-white sm:rounded">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        단어 학습
                      </DialogTitle>
                    </DialogHeader>
                    <Flashcards words={sharedList.original.words} />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/10 text-white hover:bg-white/20 px-2"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/10 text-white hover:bg-white/20 px-2"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 단어장 콘텐츠 */}
      <Tabs
        defaultValue="words"
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <TabsList className="bg-gray-50 p-1 w-full border-b overflow-hidden">
          <TabsTrigger
            value="words"
            className="text-xs sm:text-sm font-medium py-2 sm:py-3 rounded-lg"
          >
            Vocabulary List
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="text-xs sm:text-sm font-medium py-2 sm:py-3 rounded-lg"
          >
            Discussion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="p-4 sm:p-6">
          <PaginatedWordsList words={sharedList.original.words} />
        </TabsContent>

        <CommentSection sharedList={sharedList} comments={comments} />
      </Tabs>
    </div>
  );
}
