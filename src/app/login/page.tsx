import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="text-center space-y-6 mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-2 shadow-lg shadow-purple-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Smart Bookmarks
                    </h1>
                    <p className="text-gray-400 text-lg font-light">
                        Your personal, synchronized bookmark collection.
                    </p>
                </div>
                <div className="flex justify-center pt-4">
                    <LoginButton />
                </div>
                <p className="mt-8 text-center text-sm text-gray-500">
                    Secure authentication powered by Supabase
                </p>
            </div>
        </div>
    );
}
