"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Layout from "../components/Layout";
import StoreInput from "../components/StoreInput";
import SuggestionsList from "../components/SuggestionsList";
import BestCardBanner from "../components/BestCardBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import TipBanner from "../components/TipBanner";
import api from "../lib/api";

export default function Suggestions() {
    const [store, setStore] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [bestCard, setBestCard] = useState<any | null>(null);

    const handleSubmit = async (storeName: string) => {
        setLoading(true);
        try {
            const res = await api.post("/api/get-card-suggestions", {
                store: storeName,
                currentQuarter: "Q4 2025",
            });
            setSuggestions(res.data);

            if (res.data && res.data.length > 0) {
                setBestCard(res.data[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-lg mx-auto w-full px-4 space-y-6">
                {/* Page Title */}
                <h1 className="text-2xl font-bold text-gray-800">💡 Suggestions</h1>

                {/* Store Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        className="flex-1 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter store name"
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                    />
                    <button
                        onClick={() => handleSubmit(store)}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold w-full sm:w-auto"
                    >
                        Get Suggestions
                    </button>
                </div>

                {/* Tip Banner */}
                <TipBanner text="Pro Tip: You can also allow location access to auto-detect the nearest store!" />

                {/* Loading Spinner */}
                {loading && <LoadingSpinner />}

                {/* Best Card Banner */}
                {bestCard && !loading && <BestCardBanner card={bestCard} />}

                {/* Suggestions List */}
                {!loading && suggestions.length > 0 && (
                    <SuggestionsList suggestions={suggestions} />
                )}
            </div>
        </Layout>
    );
}
