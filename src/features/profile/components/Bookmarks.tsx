import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { BookmarkCard } from "./BookmarkCard";

interface Bookmarks {
  sharedList: {
    id: string;
    name: string;
    description: string | null;
    tags: string[];
    user: {
      name: string | null;
    };
  };
  id: string;
  createdAt: Date;
}

interface Props {
  bookmarks: Bookmarks[];
}

export function Bookmarks({ bookmarks }: Props) {
  return (
    <TabsContent value="bookmarks">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">내 즐겨찾기</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
          즐겨찾기한 단어장
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <Card className="text-center py-16 bg-white shadow-lg border-none">
          <CardContent className="pt-6">
            <p className="text-gray-500 text-lg">
              아직 즐겨찾기한 단어장이 없습니다.
            </p>
            <Link href="/shared/lists">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                공유 단어장 둘러보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} {...bookmark} />
          ))}
        </div>
      )}
    </TabsContent>
  );
}
