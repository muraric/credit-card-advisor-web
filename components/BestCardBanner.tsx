"use client";

export default function BestCardBanner({ card }: { card: any }) {
    return (
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
            <h2 className="text-lg font-semibold mb-2">⭐ Best Card Recommendation</h2>
            <h3 className="text-2xl font-bold">{card.card_name}</h3>
            <p className="mt-2 text-lg font-medium">Reward: {card.expected_reward}</p>
            <p className="mt-1 text-sm opacity-90">{card.reasoning}</p>
        </div>
    );
}
