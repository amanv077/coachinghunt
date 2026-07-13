import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/shared/Providers";
import { getSession } from "@/lib/auth/session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CoachingHunt - Find & Book Demo Sessions",
    template: "%s | CoachingHunt",
  },
  description:
    "Discover offline coaching institutes, compare courses, and book demo sessions with confidence.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CoachingHunt",
  },
};

export const viewport = {
  themeColor: "#2C4C9C",
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
