import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export interface BanStatus {
  isBanned: boolean;
  banInfo?: {
    reason: string;
    bannedAt: Date;
    bannedBy: string;
    permanent: boolean;
    bannedUntil?: Date;
  };
}

/**
 * Check if a user is banned by checking both restrict_account and users collections
 * @param uid User ID to check
 * @returns Promise<BanStatus> Ban status and details
 */
export async function checkUserBanStatus(uid: string): Promise<BanStatus> {
  try {
    // Check if user is in restrict_account collection (permanent ban)
    const restrictQuery = query(collection(db, "restrict_account"), where("uid", "==", uid));
    const restrictSnapshot = await getDocs(restrictQuery);

    if (!restrictSnapshot.empty) {
      const banData = restrictSnapshot.docs[0].data();
      return {
        isBanned: true,
        banInfo: {
          reason: banData.reason || "No reason provided",
          bannedAt: banData.bannedAt?.toDate() || new Date(),
          bannedBy: banData.bannedBy || "System",
          permanent: banData.permanent || false,
        },
      };
    }

    // Check user status in users collection (temporary ban)
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.status === "banned") {
        // Check if temporary ban has expired
        let isBanned = true;
        let bannedUntil: Date | undefined;

        if (userData.bannedUntil) {
          bannedUntil = userData.bannedUntil.toDate();
          const now = new Date();
          // Only compare if bannedUntil is defined
          isBanned = bannedUntil ? now < bannedUntil : true;
        }

        if (isBanned) {
          return {
            isBanned: true,
            banInfo: {
              reason: userData.bannedReason || "No reason provided",
              bannedAt: userData.bannedAt?.toDate() || new Date(),
              bannedBy: "System",
              permanent: false,
              bannedUntil: bannedUntil,
            },
          };
        }
      }
    }

    return { isBanned: false };
  } catch (error) {
    console.error("Error checking ban status:", error);
    // Return false on error to allow access (fail open)
    return { isBanned: false };
  }
}

/**
 * Check if a user is banned (simple boolean check)
 * @param uid User ID to check
 * @returns Promise<boolean> True if user is banned
 */
export async function isUserBanned(uid: string): Promise<boolean> {
  const banStatus = await checkUserBanStatus(uid);
  return banStatus.isBanned;
}
