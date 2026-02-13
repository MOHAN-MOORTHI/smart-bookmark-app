"use client";

import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { ThreeDCard } from "./ThreeDCard";

// We don't need real-time deletion logic here, the parent handles the list state via subscription
// But we can trigger the delete action

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
}

interface BookmarkItemProps {
    bookmark: Bookmark;
}

export default function BookmarkItem({ bookmark }: BookmarkItemProps) {
    const supabase = createClient();

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this bookmark?"
        );
        if (confirmed) {
            const { error } = await supabase
                .from("bookmarks")
                .delete()
                .eq("id", bookmark.id);
            if (error) {
                alert("Error deleting bookmark");
                console.error(error);
            }
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="perspective-1000"
        >
            <ThreeDCard>
                <div className="group relative bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                {bookmark.title}
                            </h3>
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-500 hover:text-gray-300 truncate block mt-1 transition-colors"
                            >
                                {bookmark.url}
                            </a>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 focus:opacity-100 z-10 relative"
                            title="Delete Bookmark"
                            aria-label="Delete Bookmark"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300" />
                </div>
            </ThreeDCard>
        </motion.div>
    );
}
