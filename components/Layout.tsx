"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { href: "/", label: "Suggestions", icon: "💡" },
    { href: "/cards", label: "Manage Cards", icon: "💳" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Top Navigation */}
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600">
                    Credit Card Advisor
                </h1>
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
            </header>

            {/* Page Content */}
            <main className="flex-1 max-w-3xl mx-auto p-6 w-full">{children}</main>

            {/* Footer */}
            <footer className="bg-white text-center py-4 text-sm text-gray-500 border-t">
                © {new Date().getFullYear()} Credit Card Advisor. All rights reserved.
            </footer>
        </div>
    );
}