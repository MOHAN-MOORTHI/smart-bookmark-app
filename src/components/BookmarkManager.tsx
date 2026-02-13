"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import BookmarkItem from "./BookmarkItem";
import SignOutButton from "./SignOutButton";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
    user_id: string;
}

interface BookmarkManagerProps {
    initialBookmarks: Bookmark[];
    user: User;
}

export default function BookmarkManager({
    initialBookmarks,
    user,
}: BookmarkManagerProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(
        initialBookmarks || []
    );
    const [newUrl, setNewUrl] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
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
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleAddBookmark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl || !newTitle) return;

        // Basic URL validation
        try {
            new URL(newUrl);
        } catch {
            alert("Please enter a valid URL (e.g., https://example.com)");
            return;
        }

        setLoading(true);
        const { error } = await supabase.from("bookmarks").insert({
            title: newTitle,
            url: newUrl,
            user_id: user.id,
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

    const filteredBookmarks = bookmarks.filter(
        (bookmark) =>
            bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-2 ring-white/10">
                        <span className="text-xl font-bold text-white">SB</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-white">
                            My Bookmarks
                        </h1>
                        <p className="text-sm text-gray-400 font-medium tracking-wide">
                            {user.email}
                        </p>
                    </div>
                </div>
                <SignOutButton />
            </header>

            {/* Add Bookmark Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 mb-12 shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

                <h2 className="text-xl font-semibold text-white mb-6 flex items-center relative z-10">
                    <div className="p-2 bg-green-500/10 rounded-lg mr-3">
                        <svg
                            className="w-5 h-5 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </div>
                    Add New Bookmark
                </h2>
                <form
                    onSubmit={handleAddBookmark}
                    className="flex flex-col md:flex-row gap-5 relative z-10"
                >
                    <div className="flex-1 group">
                        <label htmlFor="title" className="sr-only">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Title (e.g., Design Inspiration)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-950/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all outline-none group-hover:border-gray-600"
                            required
                        />
                    </div>
                    <div className="flex-[2] group">
                        <label htmlFor="url" className="sr-only">
                            URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            placeholder="https://example.com"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-950/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all outline-none group-hover:border-gray-600"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            "Add"
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 relative"
            >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search bookmarks by title or URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/30 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all outline-none"
                />
            </motion.div>

            {/* Bookmark List */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                <AnimatePresence mode="popLayout" initial={false}>
                    {filteredBookmarks.map((bookmark) => (
                        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
                    ))}
                </AnimatePresence>
                {filteredBookmarks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-20 text-center text-gray-500 bg-gray-900/10 rounded-3xl border border-gray-800/30 border-dashed"
                    >
                        <p className="text-xl font-medium text-gray-500">
                            {searchQuery ? "No bookmarks match your search" : "No bookmarks yet"}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
