"use client";

import { createClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";

interface OAuthButtonProps {
    provider: Provider;
}

export default function OAuthButton({ provider }: OAuthButtonProps) {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: provider === 'google' ? {
                    access_type: "offline",
                    prompt: "consent",
                } : undefined,
            },
        });
    };

    const getProviderConfig = () => {
        switch (provider) {
            case "google":
                return {
                    text: "Continue with Google",
                    icon: (
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.9998 12.2764C23.9998 11.4849 23.9317 10.724 23.7954 9.99997H12.2725V14.5454H18.8687C18.5772 16.0354 17.6534 17.3117 16.2737 18.2393V21.282H20.2185C22.5454 19.1436 23.9998 15.9399 23.9998 12.2764Z" fill="#4285F4" />
                            <path d="M12.2725 24C15.5786 24 18.3562 22.909 20.3708 21.0545L16.426 18.0118C15.3441 18.7308 13.9482 19.1454 12.2725 19.1454C9.07347 19.1454 6.36855 16.9839 5.39077 14.0727H1.32837V17.2181C3.33596 21.1963 7.50255 24 12.2725 24Z" fill="#34A853" />
                            <path d="M5.39077 14.0727C5.13286 13.3118 4.98971 12.4936 4.98971 11.6455C4.98971 10.8 5.13286 9.9818 5.39077 9.22091H1.32837V12.3663C0.494727 14 0.0334479 15.8272 0.0334479 11.6454C0.0334479 7.46362 1.32837 10.6363 1.32837 12.3663H1.32837Z" fill="#FBBC05" />
                            <path d="M12.2725 4.85452C14.0482 4.85452 15.6582 5.46816 16.9209 6.64998L20.4491 3.1218C18.3472 1.15998 15.5786 7.21448e-05 12.2725 7.21448e-05C7.50255 7.21448e-05 3.33596 2.80373 1.32837 6.78189L5.39077 9.92735C6.36855 7.02543 9.07347 4.85452 12.2725 4.85452Z" fill="#EA4335" />
                        </svg>
                    ),
                    className: "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
                };
            case "github":
                return {
                    text: "Continue with GitHub",
                    icon: (
                        <svg className="w-6 h-6 mr-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    ),
                    className: "bg-[#24292e] text-white border-transparent hover:bg-[#1b1f23] focus:ring-gray-500",
                };
            default:
                return { text: `Login with ${provider}`, icon: null, className: "bg-white text-gray-900 border-gray-300" };
        }
    };

    const config = getProviderConfig();

    return (
        <button
            onClick={handleLogin}
            className={`w-full flex items-center justify-center px-6 py-3 font-semibold rounded-xl shadow-sm border transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.className}`}
        >
            {config.icon}
            {config.text}
        </button>
    );
}
