"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { authClient, takeAuthToast } from "@/lib/auth-client";

// Shows the toast for actions that finish after a full page change:
// returning from Google, and finishing a new Google account on /welcome
const AuthToast = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Pages like /dashboard only forward to another page. Waiting a moment lets that finish first,
    // so the note is read (and the toast shown) on the page the person actually lands on.
    const timer = setTimeout(() => {
      const note = takeAuthToast();
      if (!note) {
        return;
      }

      if (note === "setup") {
        toast.add({ title: "Account set up. Welcome to WedPlan.", type: "success" });
        return;
      }

      // Google sent the person back with an error: the form shows the details
      if (new URLSearchParams(window.location.search).has("error")) {
        toast.add({ title: "Google sign in did not finish", type: "error" });
        return;
      }

      // Only confirm when a session really exists (pressing Back from Google leaves none)
      authClient.getSession().then(({ data }) => {
        if (!data) {
          return;
        }
        if (pathname === "/welcome") {
          toast.add({ title: "Signed in with Google. One last step: choose your account type.", type: "success" });
        } else {
          toast.add({ title: "Signed in with Google", type: "success" });
        }
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default AuthToast;
