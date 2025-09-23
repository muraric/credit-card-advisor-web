"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { getAuth } from "../../lib/auth";
import Header from "../../components/Header";

export default function ManageCards() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [newCard, setNewCard] = useState("");

  useEffect(() => {
    const { email } = getAuth();
    if (!email) {
      router.push("/login");
    } else {
      setEmail(email);

      api.get(`/api/user/${email}`)
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
    <main className="min-h-screen max-w-2xl mx-auto p-4">
      <Header />
      <h1 className="text-2xl font-bold mt-6 mb-4">💳 Manage Cards</h1>

      <div className="flex gap-2 mb-4">
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

      <ul className="divide-y border rounded mb-4">
        {cards.map((card, idx) => (
          <li key={idx} className="flex justify-between items-center p-2">
            <span>{card}</span>
            <button onClick={() => removeCard(idx)} className="text-red-500">
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={saveCards}
        className="w-full py-2 bg-green-600 text-white rounded"
      >
        Save Cards
      </button>
    </main>
  );
}
