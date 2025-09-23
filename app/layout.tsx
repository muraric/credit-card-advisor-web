import "./globals.css";

export const metadata = {
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
        <body>{children}</body>
        </html>
    );
}
