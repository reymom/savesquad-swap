import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ContextProvider } from '@/context'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Savesquad Swap",
    description: "swap to wrapped USDT in rootstock",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ContextProvider>
                    {children}
                </ContextProvider>
            </body>
        </html>
    );
}
