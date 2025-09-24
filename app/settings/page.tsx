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
            <div className="max-w-lg mx-auto w-full px-4 space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                    ⚙️ Settings
                </h1>

                {/* Profile Section */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
                        👤 Profile
                    </h2>
                    <input
                        className="w-full border p-2 sm:p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Full Name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <input
                        className="w-full border p-2 sm:p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                        value={profile.email}
                        onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                        }
                    />
                    <button
                        onClick={saveProfile}
                        className="w-full py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                    >
                        Save Profile
                    </button>
                </div>

                {/* Manage Cards Section */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        💳 Manage Cards
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <input
                            className="flex-1 border p-2 sm:p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Add a card"
                            value={newCard}
                            onChange={(e) => setNewCard(e.target.value)}
                        />
                        <button
                            onClick={addCard}
                            className="px-4 sm:px-5 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold w-full sm:w-auto"
                        >
                            Add
                        </button>
                    </div>

                    <ul className="space-y-2 sm:space-y-3">
                        <AnimatePresence>
                            {profile.userCards.map((card, idx) => (
                                <motion.li
                                    key={card + idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border rounded-lg p-3 sm:p-4"
                                >
                  <span className="text-gray-700 text-sm sm:text-base mb-2 sm:mb-0">
                    {card}
                  </span>
                                    <button
                                        onClick={() => removeCard(idx)}
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm w-full sm:w-auto"
                                    >
                                        Remove
                                    </button>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>

                    <button
                        onClick={saveProfile}
                        className="w-full mt-4 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                    >
                        Save Cards
                    </button>
                </div>
            </div>
        </Layout>
    );
}
