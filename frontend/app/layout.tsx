import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuChat AI - Chat with Your Documents",
  description: "Custom RAG chatbot that allows users to upload documents and chat with them using intelligent semantic search",
};

/**
 * Root Layout Component
 * Wraps the entire application with consistent styling and metadata
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
