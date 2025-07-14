import { auth } from "@/src/lib/firebase";

export async function getAuth() {
  try {
    const user = auth.currentUser;
    return user;
  } catch (error) {
    console.error("Error getting auth:", error);
    return null;
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}
