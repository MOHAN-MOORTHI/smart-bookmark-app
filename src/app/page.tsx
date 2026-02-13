import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookmarkManager from "@/components/BookmarkManager";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { code, next } = await searchParams;

  if (code && typeof code === "string") {
    const nextPath = typeof next === "string" ? next : "/";
    redirect(`/auth/callback?code=${code}&next=${encodeURIComponent(nextPath)}`);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <BookmarkManager initialBookmarks={bookmarks || []} user={user} />
    </main>
  );
}
