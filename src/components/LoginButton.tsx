"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="flex items-center justify-center px-6 py-3 font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.9998 12.2764C23.9998 11.4849 23.9317 10.724 23.7954 9.99997H12.2725V14.5454H18.8687C18.5772 16.0354 17.6534 17.3117 16.2737 18.2393V21.282H20.2185C22.5454 19.1436 23.9998 15.9399 23.9998 12.2764Z" fill="#4285F4" />
                <path d="M12.2725 24C15.5786 24 18.3562 22.909 20.3708 21.0545L16.426 18.0118C15.3441 18.7308 13.9482 19.1454 12.2725 19.1454C9.07347 19.1454 6.36855 16.9839 5.39077 14.0727H1.32837V17.2181C3.33596 21.1963 7.50255 24 12.2725 24Z" fill="#34A853" />
                <path d="M5.39077 14.0727C5.13286 13.3118 4.98971 12.4936 4.98971 11.6455C4.98971 10.8 5.13286 9.9818 5.39077 9.22091H1.32837V12.3663C0.494727 14 0.0334479 15.8272 0.0334479 11.6454C0.0334479 7.46362 1.32837 10.6363 1.32837 12.3663H1.32837Z" fill="#FBBC05" />
                <path d="M12.2725 4.85452C14.0482 4.85452 15.6582 5.46816 16.9209 6.64998L20.4491 3.1218C18.3472 1.15998 15.5786 7.21448e-05 12.2725 7.21448e-05C7.50255 7.21448e-05 3.33596 2.80373 1.32837 6.78189L5.39077 9.92735C6.36855 7.02543 9.07347 4.85452 12.2725 4.85452Z" fill="#EA4335" />
            </svg>
            Continue with Google
        </button>
    );
}
