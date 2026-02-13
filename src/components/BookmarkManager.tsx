"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import BookmarkItem from "./BookmarkItem";
import SignOutButton from "./SignOutButton";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
    user_id: string;
}

import { User } from "@supabase/supabase-js";

interface BookmarkManagerProps {
    initialBookmarks: Bookmark[];
    user: User;
}

export default function BookmarkManager({
    initialBookmarks,
    user,
}: BookmarkManagerProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);
    const [newUrl, setNewUrl] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const channel = supabase
            .channel("realtime_bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    setBookmarks((current) => [payload.new as Bookmark, ...current]);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    setBookmarks((current) =>
                        current.filter((bookmark) => bookmark.id !== payload.old.id)
                    );
                }
                // Note: UPDATE is not strictly required but handled similarly if needed
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleAddBookmark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl || !newTitle) return;

        setLoading(true);
        const { error } = await supabase.from("bookmarks").insert({
            title: newTitle,
            url: newUrl,
            // user_id is automatically handled by RLS + default value in DB if set up correctly, 
            // but explicitly passing it is safer if the table default isn't set
            user_id: user.id
        });

        if (error) {
            console.error("Error adding bookmark:", error);
            alert("Failed to add bookmark");
        } else {
            setNewUrl("");
            setNewTitle("");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-xl font-bold">SB</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            My Bookmarks
                        </h1>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <SignOutButton />
            </header>

            {/* Add Bookmark Form */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-10 shadow-xl backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add New Bookmark
                </h2>
                <form onSubmit={handleAddBookmark} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="title" className="sr-only">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Bookmark Title (e.g., My Portfolio)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                            required
                        />
                    </div>
                    <div className="flex-[2]">
                        <label htmlFor="url" className="sr-only">URL</label>
                        <input
                            type="url"
                            id="url"
                            placeholder="https://example.com"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            "Add"
                        )}
                    </button>
                </form>
            </div>

            {/* Bookmark List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((bookmark) => (
                    <BookmarkItem key={bookmark.id} bookmark={bookmark} />
                ))}
                {bookmarks.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500 bg-gray-900/20 rounded-2xl border border-gray-800 border-dashed">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>
                        <p className="text-xl font-medium">No bookmarks yet</p>
                        <p className="text-sm mt-2">Add your first bookmark above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
