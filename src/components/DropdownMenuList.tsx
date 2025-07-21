/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { UserIcon, LogIn, UserPlus, Moon, Sun, LogOut, Settings, LayoutDashboard, HelpCircle, CreditCard, ChevronUp } from "lucide-react";
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
  const [plan, setPlan] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isUserExists, setIsUserExists] = useState(false);
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        setIsUserExists(userDoc.exists());

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role || null);
          setPlan(userData.plan || "FREE");
        }
      } else {
        setIsUserExists(false);
        setRole(null);
        setPlan(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

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
          <DropdownMenuTrigger className="outline-none focus:outline-none">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">
              {" "}
              <Avatar className="h-8 w-8 flex-shrink-0">
                {user && user.photoURL ? (
                  <>
                    <AvatarImage src={user.photoURL} className="object-cover" alt="Profile" />
                    <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">{user.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">{user.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                )}
              </Avatar>{" "}
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.displayName || "Pengguna"}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{plan || "FREE"}</span>
              </div>
              <ChevronUp className="h-4 w-4 text-gray-400 ml-auto" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-1 mt-2">
            {/* Header Profile */}
            <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                {" "}
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {user && user.photoURL ? (
                    <>
                      <AvatarImage src={user.photoURL} className="object-cover" alt="Profile" />
                      <AvatarFallback className="bg-blue-500 text-white font-medium">{user.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-blue-500 text-white font-medium">{user.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  )}
                </Avatar>{" "}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.displayName || "Pengguna"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">{plan || "FREE"}</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* {role === "admin" || role === "teknisi" ? ( */}
              <DropdownMenuItem onClick={() => router.push("/dashboard")} className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center rounded-lg mx-1 transition-colors">
                <LayoutDashboard className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100">Dashboard</span>
              </DropdownMenuItem>
              {/* ) : null} */}

              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center rounded-lg mx-1 transition-colors">
                <Settings className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100">Profile Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/settings/help")} className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center rounded-lg mx-1 transition-colors">
                <HelpCircle className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100">Help Center</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={toggleTheme} className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center rounded-lg mx-1 transition-colors">
                {theme === "dark" ? <Sun className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" /> : <Moon className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />}
                <span className="text-sm text-gray-900 dark:text-gray-100">Dark Mode</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/settings/upgrade")} className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center rounded-lg mx-1 transition-colors">
                <CreditCard className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100">Upgrade Plan</span>
              </DropdownMenuItem>

              <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

              <DropdownMenuItem onClick={handleLogout} className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center rounded-lg mx-1 transition-colors">
                <LogOut className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100">Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </>
      ) : (
        <>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
              aria-label="User Menu">
              <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-1 mt-2">
            {/* Welcome Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Selamat Datang</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Masuk atau daftar untuk melanjutkan</p>
            </div>

            {/* Action Buttons */}
            <div className="py-2">
              <DropdownMenuItem onClick={() => router.push("/auth/signin")} className="px-3 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center rounded-lg mx-1 transition-colors group">
                <div className="mr-3 p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                  <LogIn className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Masuk</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Akses akun Anda</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/auth/signup")} className="px-3 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer flex items-center rounded-lg mx-1 transition-colors group">
                <div className="mr-3 p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                  <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Daftar</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Buat akun baru</span>
                </div>
              </DropdownMenuItem>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

            {/* Theme Toggle */}
            <div className="py-1">
              <DropdownMenuItem onClick={toggleTheme} className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center rounded-lg mx-1 transition-colors">
                <div className="mr-3">{theme === "dark" ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}</div>
                <span className="text-sm text-gray-900 dark:text-gray-100">{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  );
}
