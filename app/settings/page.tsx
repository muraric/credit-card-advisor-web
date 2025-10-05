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
    cardReward?: Record<string, any>;
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
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
        setLoading(true);
        try {
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
        } catch (err) {
            console.error("❌ Failed to save profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const addCard = () => {
        if (profile && newCard.trim()) {
            setProfile({
                ...profile,
                userCards: [
                    ...profile.userCards,
                    { card_name: newCard.trim(), rewardDetails: {} },
                ],
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

    const toggleExpand = (cardName: string) => {
        setExpandedCard(expandedCard === cardName ? null : cardName);
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
                                    {profile.userCards.map((uc, idx) => {
                                        const reward = uc.rewardDetails?.cardReward;

                                        return (
                                            <motion.li
                                                key={uc.card_name + idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-gray-50 border rounded-lg p-3 sm:p-4"
                                            >
                                                <div
                                                    className="flex justify-between items-center cursor-pointer"
                                                    onClick={() => toggleExpand(uc.card_name)}
                                                >
                          <span className="text-sm sm:text-base font-medium">
                            {uc.card_name}
                          </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeCard(idx);
                                                        }}
                                                        className="btn btn-danger text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                {/* Reward Details */}
                                                {expandedCard === uc.card_name && reward && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mt-3 text-sm bg-white border rounded-lg p-3 space-y-2"
                                                    >
                                                        <p>
                                                            <strong>Base Rate:</strong> {reward.base_rate}
                                                        </p>

                                                        {/* Bonus Categories */}
                                                        {reward.bonus_categories?.length > 0 && (
                                                            <div>
                                                                <strong>Bonus Categories:</strong>
                                                                <ul className="list-disc pl-5">
                                                                    {reward.bonus_categories.map(
                                                                        (b: any, i: number) => (
                                                                            <li key={i}>
                                                                                {b.category} — {b.rate}
                                                                                {b.cap && <span> (Cap: {b.cap})</span>}
                                                                                {b.exclusions?.length > 0 && (
                                                                                    <span>
                                                                                {" "}
                                                                                | Exclusions:{" "}
                                                                                {b.exclusions.join(", ")}
                                                                            </span>
                                                                        )}
                                                                        </li>
                                                                        )
                                                                        )}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* User Choice Categories */}
                                                        {reward.user_choice_categories?.length > 0 && (
                                                            <div>
                                                                <strong>User Choice Categories:</strong>
                                                                <ul className="list-disc pl-5">
                                                                    {reward.user_choice_categories.map(
                                                                        (u: any, i: number) => (
                                                                            <li key={i}>
                                                                                {u.rate} on {u.options.join(", ")}{" "}
                                                                                {u.notes && `(${u.notes})`}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Rotating Categories */}
                                                        {reward.rotating_categories && (
                                                            <div>
                                                                <strong>Rotating Categories:</strong>
                                                                {Object.entries(
                                                                    reward.rotating_categories as Record<
                                                                        string,
                                                                        any[]
                                                                    >
                                                                ).map(([quarter, categories]) =>
                                                                        categories.length > 0 ? (
                                                                            <div key={quarter} className="mt-1">
                                                                                <p className="font-semibold">{quarter}</p>
                                                                                <ul className="list-disc pl-5">
                                                                                    {categories.map((c, i) => (
                                                                                        <li key={i}>
                                                                                            {c.category} — {c.rate}
                                                                                            {c.exclusions?.length > 0 && (
                                                                                                <span>
                                                {" "}
                                                                                                    | Exclusions:{" "}
                                                                                                    {c.exclusions.join(", ")}
                                              </span>
                                                                                            )}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        ) : null
                                                                )}
                                                            </div>
                                                        )}

                                                        <p>
                                                            <strong>Redeem As:</strong> {reward.redeem_as}
                                                        </p>
                                                        <p>
                                                            <strong>Annual Fee:</strong>{" "}
                                                            {reward.annual_fee?.first_year} (Then{" "}
                                                            {reward.annual_fee?.thereafter})
                                                        </p>
                                                        {reward.notes && (
                                                            <p className="text-gray-600 italic">
                                                                {reward.notes}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </motion.li>
                                        );
                                    })}
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
