"use client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/src/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Ban, Clock, Shield, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

interface BanInfo {
  reason: string;
  bannedAt: Date;
  bannedBy: string;
  permanent: boolean;
  bannedUntil?: Date;
}

export default function BannedPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null);
  const [loadingBanInfo, setLoadingBanInfo] = useState(true);

  useEffect(() => {
    const checkBanStatus = async () => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        // Check if user is in restrict_account collection
        const restrictQuery = query(collection(db, "restrict_account"), where("uid", "==", user.uid));
        const restrictSnapshot = await getDocs(restrictQuery);

        if (!restrictSnapshot.empty) {
          const banData = restrictSnapshot.docs[0].data();
          setBanInfo({
            reason: banData.reason || "No reason provided",
            bannedAt: banData.bannedAt?.toDate() || new Date(),
            bannedBy: banData.bannedBy || "System",
            permanent: banData.permanent || false,
          });
        } else {
          // Check user status in users collection
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.status === "banned") {
              setBanInfo({
                reason: userData.bannedReason || "No reason provided",
                bannedAt: new Date(),
                bannedBy: "System",
                permanent: false,
                bannedUntil: userData.bannedUntil?.toDate(),
              });
            } else {
              // User is not banned, redirect to dashboard
              router.push("/dashboard");
              return;
            }
          } else {
            // User doesn't exist, redirect to home
            router.push("/");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
        router.push("/");
      } finally {
        setLoadingBanInfo(false);
      }
    };

    if (!loading) {
      checkBanStatus();
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isTemporaryBanExpired = () => {
    if (!banInfo || banInfo.permanent || !banInfo.bannedUntil) return false;
    return new Date() > banInfo.bannedUntil;
  };

  if (loading || loadingBanInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking account status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-red-200 dark:border-red-800">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Ban className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">Account Suspended</CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your account has been suspended and you cannot access this service.</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {banInfo && (
            <>
              {/* Ban Type */}
              <div className="flex items-center justify-center">
                {banInfo.permanent ? (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    <Shield className="h-4 w-4 mr-2" />
                    Permanent Ban
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-lg px-4 py-2 border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {isTemporaryBanExpired() ? "Ban Expired" : "Temporary Ban"}
                  </Badge>
                )}
              </div>

              {/* Ban Details */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason:</p>
                  <p className="text-gray-900 dark:text-gray-100">{banInfo.reason}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Banned on:</p>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(banInfo.bannedAt)}</p>
                </div>

                {!banInfo.permanent && banInfo.bannedUntil && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{isTemporaryBanExpired() ? "Ban expired on:" : "Ban expires on:"}</p>
                    <p className="text-gray-900 dark:text-gray-100">{formatDate(banInfo.bannedUntil)}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Banned by:</p>
                  <p className="text-gray-900 dark:text-gray-100">{banInfo.bannedBy}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Need Help?</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  If you believe this ban was issued in error or would like to appeal, please contact our support team at <span className="font-medium">support@ishort.my.id</span>
                </p>
              </div>

              {/* Temporary Ban Notice */}
              {!banInfo.permanent && !isTemporaryBanExpired() && banInfo.bannedUntil && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Temporary Suspension</h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">This is a temporary suspension. You will be able to access your account again after the ban period expires.</p>
                </div>
              )}

              {/* Expired Ban Notice */}
              {isTemporaryBanExpired() && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Ban Has Expired</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">Your temporary ban has expired. Please contact support to have your account reactivated.</p>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button onClick={() => window.open("mailto:support@ishort.my.id", "_blank")} className="w-full">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
