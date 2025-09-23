"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, getAuth } from "../lib/auth";

const tabs = [
    { href: "/", label: "Suggestions", icon: "💡" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
];

function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { email } = getAuth();

    const handleSignOut = () => {
        clearAuth();
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600">
                    Credit Card Advisor
                </h1>

                <div className="flex items-center gap-6">
                    <nav className="flex gap-6">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-1 font-medium transition ${
                                    pathname === tab.href
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:text-indigo-600"
                                }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </Link>
                        ))}
                    </nav>

                    {email && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{email}</span>
                            <button
                                onClick={handleSignOut}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 max-w-5xl mx-auto p-6 w-full">{children}</main>

            {/* Footer */}
            <footer className="bg-white text-center py-4 text-sm text-gray-500 border-t">
                © {new Date().getFullYear()} Credit Card Advisor. All rights reserved.
            </footer>
        </div>
    );
}

export default Layout;
