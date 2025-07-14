/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { app, db } from "@/src/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, } from "firebase/firestore";
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
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        setUser(user);

        // Fetch role from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRoles(userSnap.data().roles); // Ambil peran dari Firestore
        } else {
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
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          {user && user.photoURL ? (
            <>
              <AvatarImage src={user.photoURL} alt="Profile" />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <UserIcon className="w-4 h-4" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.displayName}</p>
            {user?.plan}
            {user?.role}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>{" "}
          <div className="flex items-center justify-between mt-1">
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">{user.urlCount} URLs created</p> */}
            <p className="text-xs text-gray-500 dark:text-gray-400">{totalShortUrls} URLs created</p>
            {user?.status === "active" && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Active</span>
              </div>
            )}
          </div>
          {/* {user.createdAt && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Member since {formatDate(user.createdAt)}</p>} */}
        </div>
      </div>
    </div>
  );
}
