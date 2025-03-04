import { auth } from "@/auth";
import { getUserId } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  const accountId = session?.user.id;
  const userId = await getUserId(accountId);

  if (!userId) {
    return new Response(JSON.stringify({ userId: null }));
  }

  return new Response(JSON.stringify({ userId }));
}
