"use client";
import { motion } from "framer-motion";

interface BestCardBannerProps {
    card: {
        card_name: string;
        expected_reward: string;
        reasoning?: string;
        category?: string;
        store?: string;
        currentQuarter?: string;
    };
}

function BestCardBanner({ card }: BestCardBannerProps) {
    // Extract values safely
    const category = card?.category?.toLowerCase?.() || "";
    const store = card?.store || "";
    const quarter = card?.currentQuarter || "";
    const cardName = card?.card_name || "Your Card";

    // Choose emoji and tone dynamically
    let emoji = "💳";
    let tone = "smart saver";

    if (category.includes("grocery") || category.includes("supermarket")) {
        emoji = "🛒";
        tone = "smart shopper";
    } else if (category.includes("dining") || category.includes("restaurant")) {
        emoji = "🍽️";
        tone = "foodie";
    } else if (category.includes("travel") || category.includes("airline")) {
        emoji = "✈️";
        tone = "travel enthusiast";
    } else if (category.includes("gas") || category.includes("fuel")) {
        emoji = "⛽";
        tone = "road tripper";
    } else if (category.includes("online") || category.includes("amazon")) {
        emoji = "🛍️";
        tone = "online shopper";
    } else if (category.includes("entertainment") || category.includes("stream")) {
        emoji = "🎬";
        tone = "entertainment lover";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
        >
            <h2 className="text-base sm:text-lg font-semibold mb-2">
                ⭐ Best Card Recommendation
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold">{cardName}</h3>
            <p className="mt-2 text-sm sm:text-lg font-medium">
                Reward: {card.expected_reward}
            </p>
            {card.reasoning && (
                <p className="mt-1 text-xs sm:text-sm opacity-90">{card.reasoning}</p>
            )}

            {/* Personalized dynamic message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 bg-white/15 backdrop-blur-md rounded-lg p-3 sm:p-4"
            >
                <p className="text-sm sm:text-base leading-relaxed">
                    {emoji} Hey {tone}!{" "}
                    <strong>{cardName}</strong> is your top pick right now, earning{" "}
                    <strong>{card.expected_reward}</strong>
                    {store && (
                        <>
                            {" "}
                            at <strong>{store}</strong>
                        </>
                    )}
                    {quarter && (
                        <>
                            {" "}
                            during <strong>{quarter}</strong>
                        </>
                    )}
                    . Keep using it for maximum rewards! 💸
                </p>

                {category && (
                    <p className="text-xs sm:text-sm mt-2 text-blue-100 italic">
                        Because this merchant falls under{" "}
                        <strong className="capitalize">{category}</strong>, your rewards
                        potential is higher than usual.
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
}

export default BestCardBanner;
