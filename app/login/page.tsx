"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuth } from "../../lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        // Save session (simple localStorage auth)
        setAuth({ email });

        router.push("/"); // go to suggestions after login
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    🔐 Login to Credit Card Advisor
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                    By signing in, you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </div>
    );
}
