"use client";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import { checkUserBanStatus } from "@/src/lib/banUtils";

interface BanCheckProps {
  children: React.ReactNode;
}

export function BanCheck({ children }: BanCheckProps) {
  const [user, loading] = useAuthState(auth);
  const [checkingBan, setCheckingBan] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't require ban checking
  const exemptPaths = ["/", "/auth/signin", "/auth/signup", "/banned", "/not-found", "/forbidden"];

  // Check if current path is exempt from ban checking
  const isExemptPath = exemptPaths.some((path) => pathname === path || pathname.startsWith(path));

  useEffect(() => {
    const checkBanStatus = async () => {
      // Skip ban check for exempt paths or when no user is logged in
      if (isExemptPath || !user) {
        setCheckingBan(false);
        return;
      }
      try {
        const banStatus = await checkUserBanStatus(user.uid);
        setIsBanned(banStatus.isBanned);

        // Redirect to banned page if user is banned
        if (banStatus.isBanned && pathname !== "/banned") {
          router.push("/banned");
          return;
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
        // On error, allow access but log the error
      } finally {
        setCheckingBan(false);
      }
    };

    if (!loading) {
      checkBanStatus();
    }
  }, [user, loading, router, pathname, isExemptPath]);
  // Show loading while checking authentication or ban status only in dashboard pages
  if ((loading || (checkingBan && !isExemptPath && user)) && pathname.startsWith("/dashboard")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking account status...</p>
        </div>
      </div>
    );
  }

  // If user is banned and not on banned page, don't render children
  if (isBanned && pathname !== "/banned") {
    return null;
  }

  return <>{children}</>;
}
