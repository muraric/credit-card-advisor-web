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

export default function Suggestions() {
  const router = useRouter();

  // ✅ state variable
  const [email, setEmail] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [bestCard, setBestCard] = useState<any | null>(null);
  const [otherCards, setOtherCards] = useState<any[]>([]);

  useEffect(() => {
    // ✅ rename local variable to avoid conflict
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
    navigator.geolocation.getCurrentPosition(async (pos) => {
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
    });
  };

  const handleManualStore = async (store: string) => {
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
  };

  return (
    <main className="min-h-screen max-w-2xl mx-auto p-4">
      <Header />
      <div className="mt-8 space-y-4">
        <button
          onClick={handleDetectStore}
          className="w-full py-3 bg-blue-600 text-white rounded"
        >
          📍 Detect My Store & Get Suggestions
        </button>
        <StoreInput store={storeName} setStore={setStoreName} onSubmit={handleManualStore} />
      </div>

      {bestCard && <BestCardBanner card={bestCard} />}
      {otherCards.length > 0 && <SuggestionsList suggestions={otherCards} />}
    </main>
  );
}
