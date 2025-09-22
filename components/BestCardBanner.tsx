export default function BestCardBanner({ card }: { card: any }) {
    return (
        <div className="mt-6 p-4 rounded-lg border-2 border-green-600 bg-green-50 shadow">
            <h2 className="text-lg font-bold text-green-700">🌟 Best Card: {card.card_name}</h2>
            <p className="font-semibold">Reward: {card.expected_reward}</p>
            <p>{card.reasoning}</p>
        </div>
    );
}
