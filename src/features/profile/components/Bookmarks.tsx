import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { BookMarked, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Bookmarks {
  sharedList: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    description: string | null;
    tags: string[];
    originalId: string;
    isActive: boolean;
  };
  id: string;
  createdAt: Date;
  userId: string;
  listId: string;
}
interface Props {
  bookmarks: Bookmarks[];
}

export function Bookmarks({ bookmarks }: Props) {
  console.log(bookmarks);
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
              You havent bookmarked any word lists yet.
            </p>
            <Link href="/shared/lists">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Browse Shared Lists
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks?.map((bookmark) => (
            <Card
              key={bookmark.id}
              className="cursor-pointer hover:shadow-xl transition-shadow bg-white border-none shadow-md overflow-hidden"
            >
              <CardHeader className="pb-2 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <Link href={`/shared/${bookmark.sharedList.id}`}>
                    <CardTitle className="text-lg text-gray-800 hover:text-blue-600 transition-colors">
                      {bookmark.sharedList.name}
                    </CardTitle>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove bookmark</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-4">
                <div className="flex items-center text-sm text-gray-600 mb-3 bg-gray-50 px-2 py-1 rounded-md">
                  <span>By </span>
                  <span className="font-medium ml-1 text-gray-800">
                    {"Anonymous"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {bookmark.sharedList.description || "No description"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {bookmark.sharedList.tags.map((tag, i) => (
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
              <CardFooter className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>
                  Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                </span>
                <BookMarked className="h-3 w-3 text-blue-500" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
}
