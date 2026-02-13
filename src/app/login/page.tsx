"use client";

import OAuthButton from "@/components/OAuthButton";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    useEffect(() => {
        if (code) {
            router.push(`/auth/callback?code=${code}&next=${encodeURIComponent(next)}`);
        }
    }, [code, next, router]);

    if (code) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white text-xl font-light tracking-widest animate-pulse">Authenticating...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 overflow-hidden relative selection:bg-blue-500/30">
            {/* Background gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        rotate: [0, 10, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-blue-600 rounded-full blur-[150px] opacity-20"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        rotate: [0, -10, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-purple-600 rounded-full blur-[150px] opacity-20"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl ring-1 ring-white/10"
            >
                <div className="text-center space-y-8 mb-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/30 mb-2 ring-4 ring-white/5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </motion.div>

                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl font-black text-white tracking-tighter mb-4"
                        >
                            Smart<span className="text-blue-500">Bookmarks</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-gray-400 text-lg font-light leading-relaxed"
                        >
                            Your personal, synchronized bookmark collection.
                        </motion.p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col gap-4 pt-2"
                >
                    <OAuthButton provider="google" />
                    <OAuthButton provider="github" />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-10 text-center text-xs text-gray-500 font-medium uppercase tracking-widest"
                >
                    Secure • Fast • Realtime
                </motion.p>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
