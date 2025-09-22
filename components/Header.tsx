"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full flex justify-between items-center py-3 border-b">
            {/* App Title */}
            <h1 className="text-xl sm:text-2xl font-bold">💳 Credit Card Advisor</h1>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex gap-6 items-center">
                <Link href="/" className="text-gray-600 hover:text-black">
                    Home
                </Link>
                <Link href="/settings" className="text-gray-600 hover:text-black">
                    ⚙️ Settings
                </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden p-2 rounded-md border border-gray-300"
                aria-label="Menu"
            >
                {menuOpen ? "✖️" : "☰"}
            </button>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-14 right-4 bg-white border rounded-lg shadow-lg w-40 p-2 flex flex-col">
                    <Link
                        href="/"
                        className="p-2 hover:bg-gray-100 rounded"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/settings"
                        className="p-2 hover:bg-gray-100 rounded"
                        onClick={() => setMenuOpen(false)}
                    >
                        ⚙️ Settings
                    </Link>
                </div>
            )}
        </header>
    );
}
