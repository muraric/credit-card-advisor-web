import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Credit Card Advisor",
    description: "Find the best credit card for your purchases",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        </body>
        </html>
    );
}