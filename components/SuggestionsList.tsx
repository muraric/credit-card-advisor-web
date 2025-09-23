"use client";

export default function SuggestionsList({ suggestions }: { suggestions: any[] }) {
    return (
        <div className="space-y-4">
            {suggestions.map((card, idx) => (
                <div
                    key={idx}
                    className="p-4 rounded-lg shadow bg-white border border-gray-100 hover:shadow-md transition"
                >
                    <h3 className="text-lg font-semibold text-gray-800">{card.card_name}</h3>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Reward:</span> {card.expected_reward}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{card.reasoning}</p>
                </div>
            ))}
        </div>
    );
}
