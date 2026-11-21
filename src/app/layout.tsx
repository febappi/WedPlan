import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: {
    default: "WedPlan | Home",
    template: "WedPlan | %s",
  },
  description: "WedPlan is a wedding planning platform. Find wedding vendors, compare services and send booking requests.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", hanken.variable)}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=sentient@300,400&display=swap" />
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <main className="flex flex-1 flex-col">{children}</main>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
