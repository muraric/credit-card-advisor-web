"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Header from "../components/Header";
import StoreInput from "../components/StoreInput";
import SuggestionsList from "../components/SuggestionsList";
import BestCardBanner from "../components/BestCardBanner";
import api from "../lib/api";

type Profile = { name: string; email: string; userCards: string[] };

export default function Home() {
    const router = useRouter();

    // UI state
    const [storeName, setStoreName] = useState("");
    const [bestCard, setBestCard] = useState<any | null>(null);
    const [otherCards, setOtherCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Profile state (loaded from backend using saved email)
    const [profile, setProfile] = useState<Profile>({
        name: "",
        email: "",
        userCards: [],
    });

    // Compute current quarter automatically
    const currentQuarter = useMemo(() => {
        const d = new Date();
        const q = Math.floor(d.getMonth() / 3) + 1;
        return `Q${q} ${d.getFullYear()}`;
    }, []);

    // Load profile on mount
    useEffect(() => {
        const savedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        if (!savedEmail) return;

        (async () => {
            try {
                const res = await api.get<Profile>(`/api/user/${savedEmail}`);
                setProfile(res.data);
                // Optional: if you want to prefill something from profile later, do it here
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        })();
    }, []);

    const ensureCardsOrRedirect = (): boolean => {
        if (!profile.userCards || profile.userCards.length === 0) {
            alert("Please add your cards first in Settings.");
            router.push("/settings");
            return false;
        }
        return true;
    };

    // Detect store via browser location → send with userCards
    const handleDetectStore = () => {
        if (!ensureCardsOrRedirect()) return;

        if (!navigator.geolocation) {
            alert("Geolocation not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
            setLoading(true);
            try {
                const { latitude, longitude } = pos.coords;

                const payload = {
                    latitude,
                    longitude,
                    currentQuarter,
                    userCards: profile.userCards, // ✅ send user cards
                };

                const res = await api.post("/api/get-card-suggestions", payload);

                if (res.data.store) setStoreName(res.data.store);
                if (res.data.suggestions?.length) {
                    setBestCard(res.data.suggestions[0]);
                    setOtherCards(res.data.suggestions.slice(1));
                } else {
                    setBestCard(null);
                    setOtherCards([]);
                }
            } catch (err) {
                console.error(err);
                alert("Failed to fetch suggestions");
            } finally {
                setLoading(false);
            }
        });
    };

    // Manual store search → send with userCards
    const handleManualStore = async (store: string) => {
        if (!ensureCardsOrRedirect()) return;

        setLoading(true);
        try {
            const payload = {
                store,
                currentQuarter,
                userCards: profile.userCards, // ✅ send user cards
            };

            const res = await api.post("/api/get-card-suggestions", payload);

            if (res.data.store) setStoreName(res.data.store);
            if (res.data.suggestions?.length) {
                setBestCard(res.data.suggestions[0]);
                setOtherCards(res.data.suggestions.slice(1));
            } else {
                setBestCard(null);
                setOtherCards([]);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to fetch suggestions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen max-w-2xl mx-auto p-4">
            <Header />

            <div className="mt-8 space-y-4">
                <button
                    onClick={handleDetectStore}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Detecting..." : "📍 Detect My Store & Get Suggestions"}
                </button>

                {/* Controlled input so detected store name populates the field */}
                <StoreInput store={storeName} setStore={setStoreName} onSubmit={handleManualStore} />
            </div>

            {bestCard && <BestCardBanner card={bestCard} />}
            {otherCards.length > 0 && <SuggestionsList suggestions={otherCards} />}
        </main>
    );
}
