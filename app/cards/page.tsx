"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { getAuth } from "../../lib/auth";
import Layout from "../../components/Layout";
import { AnimatePresence, motion } from "framer-motion";

export default function ManageCards() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [cards, setCards] = useState<string[]>([]);
    const [newCard, setNewCard] = useState("");

    useEffect(() => {
        const { email: storedEmail } = getAuth();
        if (!storedEmail) {
            router.push("/login");
        } else {
            setEmail(storedEmail);

            api
                .get(`/api/user/${storedEmail}`)
                .then((res) => setCards(res.data.userCards || []))
                .catch(() => setCards([]));
        }
    }, [router]);

    if (!email) return null;

    const saveCards = async () => {
        await api.put(`/api/user/${email}`, { email, userCards: cards });
        alert("Cards updated!");
    };

    const addCard = () => {
        if (newCard.trim()) {
            setCards([...cards, newCard.trim()]);
            setNewCard("");
        }
    };

    const removeCard = (idx: number) => {
        setCards(cards.filter((_, i) => i !== idx));
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">💳 Manage Cards</h1>

            {/* Add Card Input */}
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

            {/* Card List with Animation */}
            <ul className="space-y-3 mb-6">
                <AnimatePresence>
                    {cards.map((card, idx) => (
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

            {/* Save Button */}
            <button
                onClick={saveCards}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
            >
                Save Cards
            </button>
        </Layout>
    );
}