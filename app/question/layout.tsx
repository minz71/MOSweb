import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "../globals.css";

const notoSansTC = Noto_Sans_TC({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "語音合成問卷",
  description: "語音合成問卷",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={notoSansTC.className}>{children}</body>
    </html>
  );
}
