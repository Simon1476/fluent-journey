import CreateWordListForm from "@/features/wordlists/components/form/CreateWordListForm";

export default async function CreateVocabularyListPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">새 단어장 만들기</h1>
      <CreateWordListForm />
    </div>
  );
}
