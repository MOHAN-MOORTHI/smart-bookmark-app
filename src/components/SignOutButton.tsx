"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-red-200 bg-red-900/30 border border-red-800 rounded-lg hover:bg-red-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
            Sign Out
        </button>
    );
}
