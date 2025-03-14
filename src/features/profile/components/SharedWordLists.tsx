import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { SharedWordListCard } from "./SharedWordListCard";

interface SharedWordlist {
  name: string;
  id: string;
  updatedAt: Date;
  description: string | null;
  tags: string[];
  isActive: boolean;
}

interface SharedWordlistsLikes {
  userId: string;
  listId: string;
}

interface Props {
  sharedLists: SharedWordlist[];
  sharedWordlistsLikes: SharedWordlistsLikes[];
  userId: string | null; // 로그인한 사용자의 ID
}

export function SharedWordLists({
  sharedLists,
  sharedWordlistsLikes,
  userId,
}: Props) {
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
          {sharedLists.map((list) => {
            const likesCount = sharedWordlistsLikes.filter(
              (like) => like.listId === list.id
            ).length;

            const isLiked = sharedWordlistsLikes.some(
              (like) => like.listId === list.id && like.userId === userId
            );
            return (
              <SharedWordListCard
                key={list.id}
                list={list}
                likesCount={likesCount}
                isLiked={isLiked} // isLiked 전달
              />
            );
          })}
        </div>
      )}
    </TabsContent>
  );
}
