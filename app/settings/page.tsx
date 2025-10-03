"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { getAuth } from "../../lib/auth";
import Layout from "../../components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";

interface RewardDetails {
    cardReward?: Record<string, any>; // flexible structure
}

interface UserCard {
    card_name: string;
    rewardDetails: RewardDetails;
}

interface Profile {
    id?: number;
    name: string;
    email: string;
    passwordHash?: string;
    userCards: UserCard[];
}

export default function Settings() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [newCard, setNewCard] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { email: storedEmail } = getAuth();
        if (!storedEmail) {
            router.push("/login");
        } else {
            setEmail(storedEmail);
            fetchProfile(storedEmail);
        }
    }, [router]);

    const fetchProfile = async (email: string) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/user/${encodeURIComponent(email)}`);
            setProfile(res.data);
        } catch (err) {
            console.error("❌ Failed to load profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async () => {
        if (!email || !profile) return;
        setLoading(true); // show spinner while saving
        try {
            // ✅ Send structured userCards with creditCard
            const payload = {
                name: profile.name,
                userCards: profile.userCards.map((uc) => ({
                    card_name: uc.card_name,
                })),
            };

            const res = await api.put(
                `/api/user/${encodeURIComponent(email)}`,
                payload
            );
            setProfile(res.data);
            // alert("Profile saved!");
        } catch (err) {
            console.error("❌ Failed to save profile:", err);
        } finally {
            setLoading(false); // hide spinner
        }
    };

    const addCard = () => {
        if (profile && newCard.trim()) {
            setProfile({
                ...profile,
                userCards: [...profile.userCards, { card_name: newCard.trim(), rewardDetails: {} }],
            });
            setNewCard("");
        }
    };

    const removeCard = (idx: number) => {
        if (profile) {
            setProfile({
                ...profile,
                userCards: profile.userCards.filter((_, i) => i !== idx),
            });
        }
    };

    if (!email) return null;

    return (
        <Layout>
            <div className="max-w-lg mx-auto w-full px-4 space-y-6">
                <h1>⚙️ Settings</h1>

                {loading && <LoadingSpinner />}

                {profile && !loading && (
                    <>
                        {/* Profile Section */}
                        <div className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-4">
                            <h2>👤 Profile</h2>
                            <input
                                className="w-full border p-2 sm:p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="Full Name"
                                value={profile.name}
                                onChange={(e) =>
                                    setProfile({ ...profile, name: e.target.value })
                                }
                            />
                            <input
                                className="w-full border p-2 sm:p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="Email"
                                value={profile.email}
                                disabled
                            />
                            <button onClick={saveProfile} className="btn btn-success w-full">
                                Save Profile
                            </button>
                        </div>

                        {/* Cards Section */}
                        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                            <h2>💳 Manage Cards</h2>

                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                <input
                                    className="flex-1 border p-2 sm:p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add a card"
                                    value={newCard}
                                    onChange={(e) => setNewCard(e.target.value)}
                                />
                                <button
                                    onClick={addCard}
                                    className="btn btn-primary w-full sm:w-auto"
                                >
                                    Add
                                </button>
                            </div>

                            <ul className="space-y-2 sm:space-y-3">
                                <AnimatePresence>
                                    {profile.userCards.map((uc, idx) => (
                                        <motion.li
                                            key={uc.card_name + idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border rounded-lg p-3 sm:p-4"
                                        >
                      <span className="text-sm sm:text-base mb-2 sm:mb-0">
                        {uc.card_name}
                      </span>
                                            <button
                                                onClick={() => removeCard(idx)}
                                                className="btn btn-danger w-full sm:w-auto text-sm"
                                            >
                                                Remove
                                            </button>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>

                            <button
                                onClick={saveProfile}
                                className="btn btn-success w-full mt-4"
                            >
                                Save Cards
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
