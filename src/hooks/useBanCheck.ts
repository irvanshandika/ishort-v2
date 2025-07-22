"use client";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import { checkUserBanStatus } from "@/src/lib/banUtils";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

/**
 * Hook to check if current user is banned and handle redirect/logout
 * @param redirectPath Path to redirect to if banned (default: "/banned")
 * @returns Object with ban status and loading state
 */
export function useBanCheck(redirectPath: string = "/banned") {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const checkBan = async () => {
      if (!user || loading) return;

      try {
        const banStatus = await checkUserBanStatus(user.uid);

        if (banStatus.isBanned) {
          // Sign out the banned user
          await signOut(auth);
          toast.error("Akun Anda telah diblokir. Anda akan dialihkan ke halaman informasi.");

          // Redirect to banned page
          router.push(redirectPath);
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
      }
    };

    if (!loading) {
      checkBan();
    }
  }, [user, loading, router, redirectPath]);

  return {
    user,
    loading,
  };
}
