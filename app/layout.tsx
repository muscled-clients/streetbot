import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreetBot - Find Essential Services in Toronto",
  description: "StreetBot helps you find food, shelter, healthcare, and other essential services in the Greater Toronto Area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
