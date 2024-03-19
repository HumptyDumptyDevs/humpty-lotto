import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Raleway } from "next/font/google";
import { Roboto } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Humpty Lotto",
  description: "Humpty Dumpty Crypto Lottery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/cd3d201a06.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${raleway.className} min-h-screen`}>{children}</body>
    </html>
  );
}
