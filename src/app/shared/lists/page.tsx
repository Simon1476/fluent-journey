import { auth } from "@/auth";
import { PaginationWithLinks } from "@/components/pagination-with-links";
import { getProfileLikes } from "@/features/profile/server/db/profile";
import { SharedWordlistsGrid } from "@/features/shared-wordlists/components/SharedWordlistsGrid";
import { BookmarkFilter } from "@/features/shared-wordlists/components/filters/BookmarkFilter";
import { SearchBar } from "@/features/shared-wordlists/components/filters/SearchBar";
import { TagFilter } from "@/features/shared-wordlists/components/filters/TagFilter";
import { getBookmarks } from "@/features/shared-wordlists/server/db/bookmark";
import { getLikes } from "@/features/shared-wordlists/server/db/like";
import {
  getSharedWordLists,
  getSharedWordlistsPages,
} from "@/features/shared-wordlists/server/db/shared-wordlists";
import { redirect } from "next/navigation";

const pageSize = 12; // 한 페이지당 표시할 개수

export default async function SharedWordListsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tags?: string;
    bookmarksOnly?: string;
    page: string;
  }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const { q, tags, bookmarksOnly, page } = await searchParams;
  const selectedTags = tags ? tags.split(",") : [];
  const accountId = session.user.id;
  const currentPage = Number(page) || 1;

  const [totalItems, lists, bookmarks, likes, userLikes] = await Promise.all([
    getSharedWordlistsPages(q, selectedTags),
    getSharedWordLists(accountId, currentPage, q, selectedTags),
    getBookmarks(accountId),
    getLikes(accountId),
    getProfileLikes(accountId),
  ]);

  const filteredLists =
    bookmarksOnly === "true"
      ? lists.filter((list) =>
          bookmarks.some((bookmark) => bookmark.listId === list.id)
        )
      : lists;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">공유 단어장 둘러보기</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <SearchBar placeholder="단어장 검색..." />
          <div className="flex gap-2">
            <TagFilter />
            <BookmarkFilter />
          </div>
        </div>

        {filteredLists && filteredLists.length > 0 ? (
          <SharedWordlistsGrid
            lists={filteredLists}
            bookmarks={bookmarks}
            likes={likes}
            userLikes={userLikes}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {q ? `'${q}' 검색 결과가 없습니다.` : "공유된 단어장이 없습니다."}
            </p>
          </div>
        )}
      </div>

      <PaginationWithLinks
        pageSize={pageSize}
        totalCount={totalItems}
        page={currentPage}
      />
    </div>
  );
}
