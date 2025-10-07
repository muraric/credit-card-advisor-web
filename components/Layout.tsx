"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "../lib/auth";

function Layout({ children }: { children: React.ReactNode }) {
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
            <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
                {/* Left: Toggle icon */}
                {pathname === "/settings" ? (
                    <Link
                        href="/"
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                        🏠
                    </Link>
                ) : (
                    <Link
                        href="/settings"
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                        ⚙️
                    </Link>
                )}

                {/* Center: Page title */}
                <h1 className="text-base sm:text-lg font-semibold text-gray-800">
                    {getTitle()}
                </h1>

                {/* Right: Sign out */}
                <button
                    onClick={handleSignOut}
                    className="btn btn-danger px-3 py-1 text-xs sm:text-sm"
                >
                    Sign Out
                </button>
            </header>

            {/* Main content */}
            <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white text-center py-3 text-xs text-gray-500 border-t">
                © {new Date().getFullYear()} Credit Card Advisor
            </footer>
        </div>
    );
}

export default Layout;