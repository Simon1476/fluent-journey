import { auth } from "@/auth";
import { getSharedWordListById } from "@/features/shared-wordlists/server/db/shared-wordlists";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, BookOpen, Share2, Download } from "lucide-react";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import ViewCounter from "@/features/shared-wordlists/components/ViewCounter";
import VolumeButton from "@/features/shared-wordlists/components/VolumeButton";

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
  if (!sharedList) {
    redirect("/shared/lists");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* 상단 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={sharedList.user.image || ""} />
                  <AvatarFallback className="bg-indigo-400">
                    {sharedList.user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{sharedList.user.name}</p>
                  <p className="text-xs opacity-80">
                    {formatDate(sharedList.createdAt)}
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-bold">{sharedList.name}</h1>
              <p className="text-white/80">{sharedList.description}</p>

              <div className="flex flex-wrap gap-2">
                {sharedList.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <ViewCounter id={id} />

                  <div className="flex flex-col items-center">
                    <Heart className="w-5 h-5 mb-1" />
                    <span className="font-bold text-lg">
                      {sharedList._count.likes}
                    </span>
                    <span className="text-xs opacity-80">Likes</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="font-bold text-lg">
                      {sharedList._count.comments}
                    </span>
                    <span className="text-xs opacity-80">Comments</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-white text-indigo-700 hover:bg-white/90">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study Now
                </Button>
                <Button
                  variant="ghost"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4" />
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
            className="text-sm font-medium py-3 rounded-lg"
          >
            Vocabulary List
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="text-sm font-medium py-3 rounded-lg"
          >
            Discussion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="p-6">
          <div className="grid gap-4">
            {sharedList.original.words.map((word, index) => {
              return (
                <Card
                  key={word.id}
                  className="overflow-hidden border-0 shadow-sm hover:shadow transition-all duration-200"
                >
                  <div
                    className={`flex items-stretch ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                        : "bg-gradient-to-r from-amber-50 to-yellow-50"
                    }`}
                  >
                    <div className="min-w-16 bg-opacity-10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-300">
                        {index + 1}
                      </span>
                    </div>
                    <CardHeader className="py-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {word.english}
                          </h3>
                          <p className="text-gray-500 text-sm">{word.korean}</p>
                        </div>
                        <VolumeButton word={word.english} />
                      </div>
                    </CardHeader>
                  </div>
                  {word?.example && (
                    <CardContent className="py-3 px-6 bg-white border-t text-sm italic text-gray-600">
                      &quot;{word.example}&quot;
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="p-6">
          <div className="space-y-4">
            {sharedList.comments.length > 0 ? (
              sharedList.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarImage src={comment.user.image || ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {comment.user.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
