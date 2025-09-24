"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuth } from "../../lib/auth";
import api from "../../lib/api";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // not used yet
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // ✅ prevent full page refresh
        setError("");

        if (!email) {
            setError("Please enter your email");
            return;
        }

        try {
            // Call backend login
            const res = await api.post("/api/user/login", { email });
            console.log("✅ Login response:", res.data);

            // Save to localStorage
            setAuth({ email });

            // Redirect to Suggestions page
            router.push("/");
        } catch (err) {
            console.error("❌ Login failed:", err);
            setError("Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 sm:p-8 space-y-6">
                <h1 className="text-center">🔑 Login</h1>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password (future use) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Login
                    </button>
                </form>

                <p className="text-center text-xs sm:text-sm text-gray-500">
                    Don’t have an account? Just enter your email and we’ll create one for you.
                </p>
            </div>
        </div>
    );
}
