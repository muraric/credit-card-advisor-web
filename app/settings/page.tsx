"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { getAuth } from "../../lib/auth";
import Header from "../../components/Header";

interface Profile {
  id?: number;
  name: string;
  email: string;
  userCards: string[];
}

export default function Settings() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ name: "", email: "", userCards: [] });
  const [newCard, setNewCard] = useState("");

  useEffect(() => {
    const { email: storedEmail } = getAuth(); // ✅ renamed
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);

      api.get(`/api/user/${storedEmail}`)
        .then((res) => setProfile(res.data))
        .catch(() => setProfile({ name: "", email: storedEmail, userCards: [] }));
    }
  }, [router]);

  if (!email) return null;

  const saveProfile = async () => {
    const res = await api.put(`/api/user/${email}`, profile);
    setProfile(res.data);
    alert("Profile saved!");
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
