import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "birdhaus",
  description: "a dinner party",
  openGraph: {
    title: "birdhaus",
    description: "a dinner party",
    images: ["/opengraph.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
