export default function SuggestionsList({ suggestions }: { suggestions: any[] }) {
    return (
        <div className="mt-4 space-y-3">
            {suggestions.map((card, i) => (
                <div key={i} className="p-3 border rounded bg-white shadow-sm">
                    <h3 className="font-semibold">{i + 2}. {card.card_name}</h3>
                    <p>Reward: {card.expected_reward}</p>
                    <p>{card.reasoning}</p>
                </div>
            ))}
        </div>
    );
}
