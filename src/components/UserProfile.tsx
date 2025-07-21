/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { app, db } from "@/src/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { UserIcon } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<string | null>(null);
  const [totalShortUrls, setTotalShortUrls] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const q = query(collection(db, "shorturls"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const urls = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setTotalShortUrls(urls.length);
      }
    };

    fetchData();
  }, [user]);
  useEffect(() => {
    const authInstance = getAuth(app);
    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch complete user data from Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          // Combine Firebase Auth user data with Firestore user data
          const userData = userSnap.data();

          // Ensure createdAt is properly handled
          let createdAt = userData.createdAt;

          // If createdAt doesn't exist, use Firebase user creation time
          if (!createdAt && firebaseUser.metadata && firebaseUser.metadata.creationTime) {
            createdAt = new Date(firebaseUser.metadata.creationTime);
          }

          setUser({
            ...firebaseUser,
            role: userData.role || "user",
            plan: userData.plan || "free",
            status: userData.status || "active",
            createdAt: createdAt,
          });
          setRoles(userData.role);
        } else {
          setUser(firebaseUser);
          setRoles(null);
        }
      } else {
        setUser(null);
        setRoles(null);
      }
    });

    return () => unsubscribe();
  }, []);
  // Format date for display
  const formatDate = (dateInput: any) => {
    if (!dateInput) return "";

    let date;

    // Handle different date formats that might come from Firestore
    if (typeof dateInput === "string") {
      // Handle string format (e.g., "DD-MM-YYYY" from your previous code)
      const parts = dateInput.split("-");
      if (parts.length === 3) {
        // Assuming format is DD-MM-YYYY
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Convert to YYYY-MM-DD for parsing
      } else {
        date = new Date(dateInput);
      }
    } else if (dateInput.toDate && typeof dateInput.toDate === "function") {
      // Handle Firestore Timestamp
      date = dateInput.toDate();
    } else if (dateInput.seconds) {
      // Handle Firestore Timestamp in serialized form
      date = new Date(dateInput.seconds * 1000);
    } else {
      // Fallback
      date = new Date(dateInput);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {" "}
        <Avatar className="h-10 w-10 flex-shrink-0">
          {user && user.photoURL ? (
            <>
              <AvatarImage src={user.photoURL} alt="Profile" className="object-cover" />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <UserIcon className="w-4 h-4" />
            </AvatarFallback>
          )}
        </Avatar>{" "}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.displayName}</p>
            {user?.plan && (
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                {user.plan === "premium" ? "Premium" : user.plan === "pro" ? "Pro" : "Free"}
              </Badge>
            )}
            {user?.role && (
              <Badge className={user.role === "admin" ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700" : "bg-gray-100 dark:bg-gray-800"}>
                {user.role === "admin" ? "Admin" : "User"}
              </Badge>
            )}{" "}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>{" "}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">{totalShortUrls} URLs created</p>
            {user?.status === "active" && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Active</span>
              </div>
            )}
          </div>
          {user?.createdAt && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Member since {formatDate(user.createdAt)}</p>}
        </div>
      </div>
    </div>
  );
}
