"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { saveAuth } from "../../lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async () => {
        try {
            if (isRegister) {
                await api.post("/api/auth/register", { email, password, name });
                alert("Registration successful. Please log in.");
                setIsRegister(false);
                return;
            }

            const res = await api.post("/api/auth/login", { email, password });
            saveAuth(res.data.token, res.data.email);
            router.push("/");
        } catch (err: any) {
            alert(err.response?.data?.error || "Error logging in");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">
                    {isRegister ? "Create an Account" : "Sign In"}
                </h1>

                {isRegister && (
                    <input
                        className="block w-full border p-3 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}

                <input
                    className="block w-full border p-3 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="block w-full border p-3 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                    {isRegister ? "Register" : "Login"}
                </button>

                <p
                    className="text-center text-sm text-blue-600 cursor-pointer"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister
                        ? "Already have an account? Login"
                        : "Don't have an account? Register"}
                </p>
            </div>
        </main>
    );
}
