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
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    ),
                    className: "bg-[#24292F] text-white border-transparent hover:bg-[#24292F]/90 focus:ring-[#24292F]",
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
