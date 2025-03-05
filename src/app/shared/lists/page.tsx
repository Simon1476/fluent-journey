import { auth } from "@/auth";
import { SharedWordlistsGrid } from "@/features/shared-wordlists/components/SharedWordlistsGrid";
import { BookmarkFilter } from "@/features/shared-wordlists/components/filters/BookmarkFilter";
import { SearchBar } from "@/features/shared-wordlists/components/filters/SearchBar";
import { TagFilter } from "@/features/shared-wordlists/components/filters/TagFilter";
import { getBookmarks } from "@/features/shared-wordlists/server/db/bookmark";
import { getSharedWordLists } from "@/features/shared-wordlists/server/db/shared-wordlists";
import { redirect } from "next/navigation";

export default async function SharedWordListsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tags?: string; bookmarksOnly?: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const { q, tags, bookmarksOnly } = await searchParams;

  const selectedTags = tags ? tags.split(",") : [];
  const accountId = session.user.id;

  const lists = await getSharedWordLists(accountId, q, selectedTags);
  const bookmarks = await getBookmarks(accountId);

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
          <SharedWordlistsGrid lists={filteredLists} bookmarks={bookmarks} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {q ? `'${q}' 검색 결과가 없습니다.` : "공유된 단어장이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
