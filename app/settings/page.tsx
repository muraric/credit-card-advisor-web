"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { getAuth } from "../../lib/auth";
import Layout from "../../components/Layout";
import { AnimatePresence, motion } from "framer-motion";

interface Profile {
    id?: number;
    name: string;
    email: string;
    userCards: string[];
}

export default function Settings() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile>({
        name: "",
        email: "",
        userCards: [],
    });
    const [newCard, setNewCard] = useState("");

    useEffect(() => {
        const { email: storedEmail } = getAuth();
        if (!storedEmail) {
            router.push("/login");
        } else {
            setEmail(storedEmail);

            api
                .get(`/api/user/${storedEmail}`)
                .then((res) => setProfile(res.data))
                .catch(() =>
                    setProfile({ name: "", email: storedEmail, userCards: [] })
                );
        }
    }, [router]);

    if (!email) return null;

    const saveProfile = async () => {
        const res = await api.put(`/api/user/${email}`, profile);
        setProfile(res.data);
        alert("Profile saved!");
    };

    const addCard = () => {
        if (newCard.trim()) {
            setProfile({
                ...profile,
                userCards: [...profile.userCards, newCard.trim()],
            });
            setNewCard("");
        }
    };

    const removeCard = (idx: number) => {
        setProfile({
            ...profile,
            userCards: profile.userCards.filter((_, i) => i !== idx),
        });
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">⚙️ Settings</h1>

            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg p-6 space-y-4 mb-6">
                <input
                    className="w-full border p-3 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <input
                    className="w-full border p-3 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />

                <button
                    onClick={saveProfile}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                >
                    Save Profile
                </button>
            </div>

            {/* Card Management */}
            <h2 className="text-lg font-semibold mb-3 text-gray-700">💳 My Cards</h2>
            <div className="flex gap-2 mb-4">
                <input
                    className="flex-1 border p-3 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Add a card"
                    value={newCard}
                    onChange={(e) => setNewCard(e.target.value)}
                />
                <button
                    onClick={addCard}
                    className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-3 mb-6">
                <AnimatePresence>
                    {profile.userCards.map((card, idx) => (
                        <motion.li
                            key={card + idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-between items-center bg-white shadow rounded-lg p-4"
                        >
                            <span className="text-gray-700">{card}</span>
                            <button
                                onClick={() => removeCard(idx)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                            >
                                Remove
                            </button>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </Layout>
    );
}
