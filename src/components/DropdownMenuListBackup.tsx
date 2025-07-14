/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { UserIcon, LogIn, UserPlus, Moon, Sun, LogOut, Settings, History, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { auth, db, app } from "@/src/lib/firebase";
import { onAuthStateChanged, User, getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

export default function DropdownMenuList() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string | null>(null);
  const [isUserExists, setIsUserExists] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        setIsUserExists(userDoc.exists());
      } else {
        setIsUserExists(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

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

  const handleLogout = async () => {
    try {
      router.push("/");
      toast.success(`Sampai Jumpa, ${user?.displayName || "Pengguna"}!`, {
        style: {
          background: theme === "dark" ? "#444" : "#333",
          color: "#fff",
        },
      });
      await signOut(auth);
    } catch (error: any) {
      console.log("Error signing out: ", error.message);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenu>
      {user ? (
        <>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-8 w-8 border-2 border-transparent hover:border-primary transition-all">
              {user && user.photoURL ? (
                <>
                  <AvatarImage src={user.photoURL} className="w-full" alt="Profile" />
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </>
              ) : (
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <UserIcon className="w-4 h-4" />
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-neutral-900 shadow-lg rounded-xl border-none py-2">
            {/* Header Profile */}
            <DropdownMenuLabel className="px-4 py-3 text-center flex flex-col items-center gap-1">
              <Avatar className="h-10 w-10 mb-2">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <UserIcon className="w-5 h-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex items-center justify-center gap-2">
                <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{user?.displayName || "Pengguna"}</span>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded">PRO</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-neutral-700" />

            <DropdownMenuItem onClick={() => router.push("/settings/profile")} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-800 dark:text-gray-200">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/help")} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-2">
              <span className="text-lg">?</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">Help Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-2">
              {theme === "dark" ? <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" /> : <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
              <span className="text-sm text-gray-800 dark:text-gray-200">Dark Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/upgrade")} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-2">
              <span className="text-base">↗</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">Upgrade Plan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-neutral-700" />
            <DropdownMenuItem onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      ) : (
        <>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Dropdown User">
              <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-lg border-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <DropdownMenuLabel className="font-normal text-xs text-gray-500 dark:text-gray-400 mb-2">Akun PUSCOM</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem onClick={() => router.push("/auth/signin")} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center gap-2 px-4 py-2">
              <LogIn className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span>Sign In</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/auth/signup")} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center gap-2 px-4 py-2">
              <UserPlus className="h-4 w-4 text-green-500 dark:text-green-400" />
              <span>Sign Up</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center gap-2 px-4 py-2">
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-indigo-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  );
}
