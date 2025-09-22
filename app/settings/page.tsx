"use client";
export const dynamic = "force-dynamic"; // ⛔ prevent static export

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import api from "../../lib/api";


interface Profile {
    id?: number;
    name: string;
    email: string;
    userCards: string[];
}

export default function Settings() {
    const [profile, setProfile] = useState<Profile>({ name: "", email: "", userCards: [] });
    const [newCard, setNewCard] = useState("");

    // ✅ Load profile on mount if email exists in localStorage
    useEffect(() => {
        const savedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        if (savedEmail) {
            api
                .get(`/api/user/${savedEmail}`)
                .then((res) => {
                    setProfile(res.data);
                })
                .catch(() => {
                    // If not found, keep profile empty but set email
                    setProfile({ name: "", email: savedEmail, userCards: [] });
                });
        }
    }, []);

    const saveProfile = async () => {
        try {
            if (!profile.email) {
                alert("Email is required to save profile");
                return;
            }

            // Always fetch latest from backend first
            let existing: Profile | null = null;
            try {
                const res = await api.get(`/api/user/${profile.email}`);
                if (res.status === 200) {
                    existing = res.data;
                }
            } catch (_) {
                existing = null;
            }

            let res;
            if (existing) {
                // ✅ Merge cards if profile already exists
                const mergedCards =
                    profile.userCards.length > 0 ? profile.userCards : existing.userCards;

                const updatedProfile = {
                    ...existing,
                    name: profile.name || existing.name,
                    userCards: mergedCards,
                };

                res = await api.put(`/api/user/${profile.email}`, updatedProfile);
            } else {
                // ✅ New user → create
                res = await api.post("/api/user", profile);
            }

            setProfile(res.data);
            localStorage.setItem("userEmail", res.data.email);
            alert("Profile saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to save profile");
        }
    };

    const addCard = () => {
        if (newCard.trim()) {
            setProfile({ ...profile, userCards: [...profile.userCards, newCard.trim()] });
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
        <main className="min-h-screen max-w-2xl mx-auto p-4">
            <Header />
            <h1 className="text-2xl font-bold mt-6 mb-4">⚙️ Settings</h1>

            {/* Profile Inputs */}
            <input
                className="w-full border p-2 rounded mb-2"
                placeholder="Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
                className="w-full border p-2 rounded mb-2"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />

            <button
                onClick={saveProfile}
                className="w-full py-2 bg-green-600 text-white rounded mb-4"
            >
                Save Profile
            </button>

            {/* Card Management */}
            <h2 className="text-lg font-semibold">My Cards</h2>
            <div className="flex gap-2 mb-2">
                <input
                    className="flex-1 border p-2 rounded"
                    placeholder="Add a card"
                    value={newCard}
                    onChange={(e) => setNewCard(e.target.value)}
                />
                <button onClick={addCard} className="px-4 bg-blue-600 text-white rounded">
                    Add
                </button>
            </div>

            <ul className="divide-y border rounded">
                {profile.userCards.map((card, idx) => (
                    <li key={idx} className="flex justify-between items-center p-2">
                        <span>{card}</span>
                        <button onClick={() => removeCard(idx)} className="text-red-500">
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
