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

type StoreInfo = {
    name: string;
    category: string;
};

export default function Suggestions() {
    const router = useRouter();

    // Auth
    const [email, setEmail] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("there");

    // UI / form
    const [storeInput, setStoreInput] = useState("");
    const [storeOptions, setStoreOptions] = useState<StoreInfo[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Data from backend
    const [detectedStore, setDetectedStore] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [currentQuarter, setCurrentQuarter] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [bestCard, setBestCard] = useState<Suggestion | null>(null);

    // UX
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    // 🧠 Load email and name
    useEffect(() => {
        const auth = getAuth();
        if (!auth?.email) {
            router.push("/login");
            return;
        }

        setEmail(auth.email);

        // Fetch the user's name from backend
        const fetchUserName = async () => {
            try {
                const emailParam = encodeURIComponent(auth.email ?? "");
                const res = await api.get(`/api/user/${emailParam}`);
                const fetchedName = res.data?.name;
                if (fetchedName) {
                    // Capitalize each word
                    const formatted = fetchedName
                        .split(" ")
                        .map(
                            (w: string) =>
                                w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                        )
                        .join(" ");
                    setUserName(formatted);
                }
            } catch (err) {
                console.error("❌ Failed to load name:", err);
            }
        };

        fetchUserName();
    }, [router]);

    const applyResponse = (data: any) => {
        const returnedStore = data?.store ?? null;
        const returnedCategory = data?.category ?? null;
        const returnedQuarter = data?.currentQuarter ?? null;
        const list: Suggestion[] = Array.isArray(data?.suggestions)
            ? data.suggestions
            : [];

        setDetectedStore(returnedStore);
        setCategory(returnedCategory);
        setCurrentQuarter(returnedQuarter);
        setSuggestions(list);
        setBestCard(list.length > 0 ? list[0] : null);

        if (returnedStore) setStoreInput(returnedStore);
    };

    const handleSubmit = async (storeName: string, category?: string) => {
        if (!email) return;
        if (!storeName.trim()) {
            setErrMsg("Please enter a store name.");
            return;
        }

        setErrMsg(null);
        setLoading(true);
        try {
            const res = await api.post("/api/get-card-suggestions", {
                email,
                store: storeName.trim(),
                category: category || "general",
            });

            console.log("🔎 Suggestion response:", res.data);
            applyResponse(res.data);
        } catch (err: any) {
            console.error("❌ Suggestion error:", err);
            setErrMsg("Failed to get suggestions. Please try again.");
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

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

                    const res = await api.get("/api/google/detect-stores", {
                        params: { latitude, longitude },
                    });

                    let stores: StoreInfo[] = res.data.stores || [];

                    if (stores.length === 0) {
                        console.log("⚠️ No stores found, defaulting to Unknown Store");
                        await handleSubmit("Unknown Store", "general");
                    } else {
                        setStoreOptions(stores);
                        setShowModal(true);
                    }
                } catch (err: any) {
                    console.error("❌ Detect stores error:", err);
                    setErrMsg("Failed to detect stores.");
                } finally {
                    setLoading(false);
                }
            },
            (geoErr) => {
                console.error("❌ Geolocation error:", geoErr);
                setLoading(false);
                setErrMsg(
                    geoErr?.message ||
                    "Unable to access location. Please allow location permissions."
                );
            }
        );
    };

    if (!email) return null;

    // Category → Tailwind text colors
    const getCategoryColor = (cat: string | null) => {
        const normalized = cat ? cat.toLowerCase() : "";
        switch (normalized) {
            case "groceries":
                return "text-green-600";
            case "online":
                return "text-blue-600";
            case "department_store":
                return "text-purple-600";
            case "dining":
                return "text-orange-600";
            case "travel":
                return "text-indigo-600";
            default:
                return "text-gray-600";
        }
    };

    // Greeting & emoji based on time
    const hour = new Date().getHours();
    let greeting = "Hello";
    let emoji = "💡";

    if (hour < 12) {
        greeting = "Good morning";
        emoji = "🌅";
    } else if (hour < 18) {
        greeting = "Good afternoon";
        emoji = "🌇";
    } else {
        greeting = "Good evening";
        emoji = "🌙";
    }

    return (
        <Layout>
            <div className="max-w-lg mx-auto w-full px-4 space-y-6">
                {/* Personalized Greeting */}
                <div className="space-y-1 mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {emoji} {greeting}, {userName}!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Let’s find the{" "}
                        <span className="font-medium text-blue-600">
              best credit card
            </span>{" "}
                        for your next purchase — personalized just for you.
                    </p>
                </div>

                {/* Manual store input */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        className="flex-1 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter store name (e.g. Walmart, Patel Brothers)"
                        value={storeInput}
                        onChange={(e) => setStoreInput(e.target.value)}
                    />
                    <button
                        onClick={() => handleSubmit(storeInput, "general")}
                        className="btn btn-primary w-full sm:w-auto"
                    >
                        Get Suggestions
                    </button>
                </div>

                {/* Auto-detect */}
                <button
                    onClick={handleDetectStore}
                    className="btn btn-primary w-full mt-3"
                    disabled={loading}
                >
                    📍 Detect My Store & Get Suggestions
                </button>

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
                    <div className="p-4 rounded-lg bg-gray-100 border text-sm text-gray-700 space-y-1">
                        <div>
                            🏬 Store: <span className="font-medium">{detectedStore}</span>
                        </div>
                        {category && (
                            <div>
                                🏷️ Category:{" "}
                                <span
                                    className={`capitalize font-medium ${getCategoryColor(
                                        category
                                    )}`}
                                >
                  {category}
                </span>
                            </div>
                        )}
                        {currentQuarter && (
                            <div>
                                📅 Current Quarter:{" "}
                                <span className="font-medium">{currentQuarter}</span>
                            </div>
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

            {/* Modal for store options */}
            {showModal && storeOptions.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 text-center">
                            Select your store
                        </h2>
                        <ul className="space-y-2">
                            {storeOptions.map((s, idx) => (
                                <li key={idx}>
                                    <button
                                        onClick={() => handleSubmit(s.name, s.category)}
                                        className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        {s.name}{" "}
                                        <span
                                            className={`text-xs font-medium ml-1 ${getCategoryColor(
                                                s.category
                                            )}`}
                                        >
                      ({s.category})
                    </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowModal(false)}
                            className="btn btn-danger w-full mt-4"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
}
