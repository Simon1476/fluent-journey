import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Wordlist {
  id: string;
  name: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  description: string | null;
  isPublic: boolean;
  viewCount: number;
}
interface Props {
  wordLists: Wordlist[];
}

export function WordLists({ wordLists }: Props) {
  return (
    <TabsContent value="wordLists">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">내 단어장</h2>
        <Link href="/wordlists/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> 단어장 생성하기
          </Button>
        </Link>
      </div>

      {wordLists.length === 0 ? (
        <Card className="text-center py-16 bg-white shadow-lg border-none">
          <CardContent className="pt-6">
            <p className="text-gray-500 text-lg">아직 단어장이 없습니다.</p>
            <Link href="/create-set">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> 단어장 생성하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordLists.map((list) => (
            <Card
              key={list.id}
              className="cursor-pointer hover:shadow-xl transition-shadow bg-white border-none shadow-md overflow-hidden"
            >
              <CardHeader className="pb-2 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-800">
                    {list.name}
                  </CardTitle>
                  <Badge
                    variant={list.isPublic ? "outline" : "secondary"}
                    className={
                      list.isPublic
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {list.isPublic ? "공유중" : "비공개"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-4">
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {list.description && <p>{list.description}</p>}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {list.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-600 border-blue-100"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>마지막 업데이트: {formatDate(list.updatedAt)}</span>
                {/* <span>{list.words?.length || 0} words</span> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
}
