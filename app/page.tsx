"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import SuggestionsList from "../components/SuggestionsList";
import BestCardBanner from "../components/BestCardBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import TipBanner from "../components/TipBanner";
import api from "../lib/api";
import { getAuth } from "../lib/auth";

type Suggestion = {
    card_name: string;
    expected_reward: string;
    reasoning: string;
};

export default function Suggestions() {
    const router = useRouter();

    // Auth
    const [email, setEmail] = useState<string | null>(null);

    // UI / form
    const [storeInput, setStoreInput] = useState("");

    // Data from backend
    const [detectedStore, setDetectedStore] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [bestCard, setBestCard] = useState<Suggestion | null>(null);

    // UX
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    useEffect(() => {
        const { email: storedEmail } = getAuth();
        console.log("📥 Auth loaded:", storedEmail);
        if (!storedEmail) {
            router.push("/login");
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    // Common handler to normalize the backend response
    const applyResponse = (data: any) => {
        // Expected: { store, category, suggestions: Suggestion[] }
        const returnedStore = data?.store ?? null;
        const returnedCategory = data?.category ?? null;
        const list: Suggestion[] = Array.isArray(data?.suggestions)
            ? data.suggestions
            : [];

        setDetectedStore(returnedStore);
        setCategory(returnedCategory);
        setSuggestions(list);
        setBestCard(list.length > 0 ? list[0] : null);

        // Also reflect store name in the input for clarity
        if (returnedStore) setStoreInput(returnedStore);
    };

    // Manual store flow
    const handleManualSubmit = async () => {
        if (!email) return;
        if (!storeInput.trim()) {
            setErrMsg("Please enter a store name.");
            return;
        }

        setErrMsg(null);
        setLoading(true);
        try {
            const res = await api.post("/api/get-card-suggestions", {
                email,
                store: storeInput.trim(),
                currentQuarter: "Q4 2025",
            });

            console.log("🔎 Manual suggestion response:", res.data);
            applyResponse(res.data);
        } catch (err: any) {
            console.error("❌ Manual suggestion error:", err);
            setErrMsg("Failed to get suggestions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-detect flow (geolocation → backend)
    const handleDetectStore = async () => {
        if (!email) return;

        if (!navigator.geolocation) {
            setErrMsg("Geolocation is not supported by your browser.");
            return;
        }

        setErrMsg(null);
        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    console.log("📍 Geolocation:", { latitude, longitude });

                    const res = await api.post("/api/get-card-suggestions", {
                        email,
                        latitude,
                        longitude,
                        currentQuarter: "Q4 2025",
                    });

                    console.log("📍 Auto-detect response:", res.data);
                    applyResponse(res.data);
                } catch (err: any) {
                    console.error("❌ Auto-detect error:", err);
                    setErrMsg("Failed to detect store or get suggestions. Please try again.");
                } finally {
                    setLoading(false);
                }
            },
            (geoErr) => {
                console.error("❌ Geolocation error:", geoErr);
                setLoading(false);
                setErrMsg(
                    geoErr?.message ||
                    "Unable to access location. Please allow location permissions and try again."
                );
            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000,
            }
        );
    };

    if (!email) return null;

    return (
        <Layout>
            <div className="max-w-lg mx-auto w-full px-4 space-y-6">
                <h1>💡 Suggestions</h1>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleDetectStore}
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        📍 Detect My Store & Get Suggestions
                    </button>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            className="flex-1 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter store name (e.g., Walmart, Amazon, Patel Brothers)"
                            value={storeInput}
                            onChange={(e) => setStoreInput(e.target.value)}
                        />
                        <button
                            onClick={handleManualSubmit}
                            className="btn btn-primary w-full sm:w-auto"
                            disabled={loading}
                        >
                            Get Suggestions
                        </button>
                    </div>
                </div>

                {/* Tip */}
                <TipBanner text="Pro Tip: Add your cards in Settings to get more accurate recommendations." />

                {/* Error */}
                {errMsg && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                        {errMsg}
                    </div>
                )}

                {/* Loading */}
                {loading && <LoadingSpinner />}

                {/* Store banner */}
                {!loading && detectedStore && (
                    <div className="p-4 rounded-lg bg-gray-100 border text-sm text-gray-700">
                        Store: <span className="font-medium">{detectedStore}</span>
                        {category && (
                            <>
                                {" "}
                                (<span className="capitalize">{category}</span>)
                            </>
                        )}
                    </div>
                )}

                {/* Best card */}
                {!loading && bestCard && <BestCardBanner card={bestCard} />}

                {/* Others */}
                {!loading && suggestions.length > 0 && (
                    <SuggestionsList suggestions={suggestions} />
                )}
            </div>
        </Layout>
    );
}
