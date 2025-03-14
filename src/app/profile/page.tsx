import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordLists } from "@/features/profile/components/WordLists";
import {
  getProfileBookmarks,
  getProfileLikes,
  getProfileSharedWordLists,
  getProfileWordLists,
  getUserSharedWordListLikes,
} from "@/features/profile/server/db/profile";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SharedWordLists } from "@/features/profile/components/SharedWordLists";
import { Bookmarks } from "@/features/profile/components/Bookmarks";
import { getUserId } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const user = session.user;
  const accountId = session.user.id;
  const userId = await getUserId(accountId);

  const [wordlists, sharedWordlists, bookmarks, likes, sharedWordlistsLikes] =
    await Promise.all([
      getProfileWordLists(accountId),
      getProfileSharedWordLists(accountId),
      getProfileBookmarks(accountId),
      getProfileLikes(accountId),
      getUserSharedWordListLikes(accountId),
    ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={user.image || "No image available"}
                alt={user.name || "User"}
              />
              <AvatarFallback className="text-2xl font-bold bg-indigo-100 text-indigo-800">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">
                {user?.name || "Anonymous User"}
              </h1>
              <p className="text-blue-100 mt-1">단어장 생성자</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/15 rounded-lg p-4 backdrop-blur-sm shadow-lg">
                <p className="text-2xl font-bold text-white">
                  {wordlists.length || 0}
                </p>
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  내 단어장
                </p>
              </div>
              <div className="bg-white/15 rounded-lg p-4 backdrop-blur-sm shadow-lg">
                <p className="text-2xl font-bold text-white">
                  {sharedWordlists.length || 0}
                </p>
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  공유 단어장
                </p>
              </div>
              <div className="bg-white/15 rounded-lg p-4 backdrop-blur-sm shadow-lg">
                <p className="text-2xl font-bold text-white">{likes.length}</p>
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  좋아요
                </p>
              </div>
              <div className="bg-white/15 rounded-lg p-4 backdrop-blur-sm shadow-lg">
                <p className="text-2xl font-bold text-white">
                  {bookmarks.length || 0}
                </p>
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  즐겨찾기
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="wordLists" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-md rounded-lg p-0 overflow-hidden">
            <TabsTrigger
              value="wordLists"
              className="h-10 flex items-center justify-center py-2 px-3 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-blue-600 data-[state=active]:text-white focus:outline-none focus:z-10 relative"
            >
              내 단어장
            </TabsTrigger>
            <TabsTrigger
              value="sharedLists"
              className="h-10 flex items-center justify-center py-2 px-3 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-blue-600 data-[state=active]:text-white focus:outline-none focus:z-10 relative"
            >
              공유 단어장
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="h-10 flex items-center justify-center py-2 px-3 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-blue-600 data-[state=active]:text-white focus:outline-none focus:z-10 relative"
            >
              즐겨찾기
            </TabsTrigger>
          </TabsList>

          <WordLists wordLists={wordlists} />
          <SharedWordLists
            sharedLists={sharedWordlists}
            sharedWordlistsLikes={sharedWordlistsLikes}
            userId={userId}
          />
          <Bookmarks bookmarks={bookmarks} />
        </Tabs>
      </div>
    </div>
  );
}
