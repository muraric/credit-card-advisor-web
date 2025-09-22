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
            router.push("/"); // redirect to suggestions page
        } catch (err: any) {
            alert(err.response?.data?.error || "Error logging in");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white shadow rounded p-6">
                <h1 className="text-2xl font-bold mb-4">
                    {isRegister ? "Register" : "Login"}
                </h1>
                {isRegister && (
                    <input
                        className="w-full border p-2 rounded mb-2"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                <input
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 bg-blue-600 text-white rounded mb-2"
                >
                    {isRegister ? "Register" : "Login"}
                </button>
                <p
                    className="text-blue-600 cursor-pointer text-sm"
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
