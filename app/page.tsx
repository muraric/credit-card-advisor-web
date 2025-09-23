"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { getAuth } from "../lib/auth";
import Header from "../components/Header";
import StoreInput from "../components/StoreInput";
import SuggestionsList from "../components/SuggestionsList";
import BestCardBanner from "../components/BestCardBanner";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Suggestions() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [storeName, setStoreName] = useState("");
    const [bestCard, setBestCard] = useState<any | null>(null);
    const [otherCards, setOtherCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { email: storedEmail } = getAuth();
        if (!storedEmail) {
            router.push("/login");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    if (!email) return null;

    const handleDetectStore = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await api.post("/api/get-card-suggestions", {
                    email,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    currentQuarter: "Q4 2025",
                });
                setStoreName(res.data.store);
                if (res.data.suggestions?.length) {
                    setBestCard(res.data.suggestions[0]);
                    setOtherCards(res.data.suggestions.slice(1));
                }
            } finally {
                setLoading(false);
            }
        });
    };

    const handleManualStore = async (store: string) => {
        setLoading(true);
        try {
            const res = await api.post("/api/get-card-suggestions", {
                email,
                store,
                currentQuarter: "Q4 2025",
            });
            setStoreName(res.data.store);
            if (res.data.suggestions?.length) {
                setBestCard(res.data.suggestions[0]);
                setOtherCards(res.data.suggestions.slice(1));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Find the Best Card for Your Purchase
                </h1>

                <div className="space-y-4">
                    <button
                        onClick={handleDetectStore}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                    >
                        📍 Detect My Store & Get Suggestions
                    </button>

                    <StoreInput
                        store={storeName}
                        setStore={setStoreName}
                        onSubmit={handleManualStore}
                    />
                </div>

                {/* Loading Indicator */}
                {loading && <LoadingSpinner />}

                {/* Best Card */}
                {!loading && bestCard && (
                    <div className="mt-8">
                        <BestCardBanner card={bestCard} />
                    </div>
                )}

                {/* Other Options */}
                {!loading && otherCards.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            Other Options
                        </h2>
                        <SuggestionsList suggestions={otherCards} />
                    </div>
                )}
            </div>
        </main>
    );
}
