import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: {
    default: "WedPlan | Home",
    template: "WedPlan | %s",
  },
  description: "WedPlan is a wedding planning platform. Find wedding vendors, compare services and send booking requests.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=chillax@500,600&display=swap" />
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
