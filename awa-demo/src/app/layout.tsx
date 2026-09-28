import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/AppContext";
import Header from "@/components/Header";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AWA — AI Creation Guide Platform",
  description: "Curated prompt templates engineered for real commercial production across Images, Video, Slides, and Websites.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const subscribedCookie = cookieStore.get("awa_subscribed")?.value;
  const initialSubscribed = subscribedCookie !== undefined ? subscribedCookie === "true" : true;
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var theme = localStorage.getItem('awa_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans antialiased">
        <AppProvider initialSubscribed={initialSubscribed}>
          <Header />
          <div className="flex-1">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
