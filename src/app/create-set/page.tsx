import { auth } from "@/auth";
import CreateWordForm from "@/components/word/CreateWordForm";
import { redirect } from "next/navigation";

export default async function CreateWordPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">새로운 단어장 생성하기</h1>
      <CreateWordForm />
    </div>
  );
}
