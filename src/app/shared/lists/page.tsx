import { auth } from "@/auth";
import { SharedWordlistsGrid } from "@/features/shared-wordlists/components/SharedWordlistsGrid";
import { SearchBar } from "@/features/shared-wordlists/components/filters/SearchBar";
import { TagFilter } from "@/features/shared-wordlists/components/filters/TagFilter";
import { getSharedWordLists } from "@/features/shared-wordlists/server/db/shared-wordlists";
import { redirect } from "next/navigation";

export default async function SharedWordListsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: [] }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const { q } = await searchParams;

  const accountId = session.user.id;
  const lists = await getSharedWordLists(accountId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">공유 단어장 둘러보기</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4">
          <SearchBar placeholder={"단어장 검색..."} />
          <TagFilter />
        </div>

        <SharedWordlistsGrid lists={lists} userId={session?.user?.id} />
      </div>
    </div>
  );
}
