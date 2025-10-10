"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "../lib/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = () => {
        clearAuth();
        router.push("/login");
    };

    const getTitle = () => {
        if (pathname === "/settings") return "Settings";
        return "Suggestions";
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header */}
            <header className="pt-safe-plus sticky top-0 z-50 bg-white border-b shadow-sm grid grid-cols-3 items-center px-4 py-3">
                {/* Left: Toggle icon */}
                <div className="justify-self-start">
                    {pathname === "/settings" ? (
                        <Link
                            href="/"
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                            aria-label="Home"
                        >
                            🏠
                        </Link>
                    ) : (
                        <Link
                            href="/settings"
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                            aria-label="Settings"
                        >
                            ⚙️
                        </Link>
                    )}
                </div>

                {/* Center: Page title */}
                <h1 className="justify-self-center text-base sm:text-lg font-semibold text-gray-800">
                    {getTitle()}
                </h1>

                {/* Right: Sign out */}
                <div className="justify-self-end">
                    <button
                        onClick={handleSignOut}
                        className="btn btn-danger px-3 py-1 text-xs sm:text-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 w-full">{children}</main>

            {/* Footer */}
            <footer className="bg-white text-center py-3 text-xs text-gray-500 border-t">
                © {new Date().getFullYear()} Credit Card Advisor
            </footer>
        </div>
    );
}
