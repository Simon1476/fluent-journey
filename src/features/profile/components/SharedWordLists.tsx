import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { Eye, ThumbsUp } from "lucide-react";

interface SharedWordlist {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  description: string | null;
  tags: string[];
  originalId: string;
  isActive: boolean;
}
interface Props {
  sharedLists: SharedWordlist[];
}

export function SharedWordLists({ sharedLists }: Props) {
  return (
    <TabsContent value="sharedLists">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">내가 공유한 단어장</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
          커뮤니티와 단어장을 공유하세요
        </div>
      </div>

      {sharedLists.length === 0 ? (
        <Card className="text-center py-16 bg-white shadow-lg border-none">
          <CardContent className="pt-6">
            <p className="text-gray-500 text-lg">
              아직 공유한 단어장이 없습니다.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              단어장을 공유하여 다른 사람들의 학습을 돕고 피드백을 받아보세요!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedLists.map((list) => (
            <Card
              key={list.id}
              className="flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow bg-white border-none shadow-md overflow-hidden"
            >
              <CardHeader className="pb-2 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-800">
                    {list.name}
                  </CardTitle>
                  <Badge
                    variant={list.isActive ? "outline" : "destructive"}
                    className={
                      list.isActive
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {list.isActive ? "공유중" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-4 space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {list.description || "설명이 없습니다"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {list.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs bg-indigo-50 text-indigo-600 border-indigo-100"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>마지막 업데이트: {formatDate(list.updatedAt)}</span>
                <div className="flex gap-3">
                  <span className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                    <Eye className="w-3 h-3 mr-1" />
                    {/* {list.stats?.viewCount || 0} */}
                  </span>
                  <span className="flex items-center bg-pink-50 text-pink-600 px-2 py-1 rounded-md">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {/* {list.likes?.length || 0} */}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
}
