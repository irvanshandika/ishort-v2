"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  plan: "admin" | "pro" | "free";
  role: "admin" | "user";
  status: "active" | "inactive";
  createdAt: string;
  signType: "google" | "email";
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Data dummy untuk user
  const [user] = useState<User>({
    uid: "dummy-user-id",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    plan: "pro",
    role: "user",
    status: "active",
    createdAt: "2024-01-15",
    signType: "google"
  });

  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const updateUser = (userData: Partial<User>) => {
    // Dummy function - does nothing in dummy mode
    console.log("Update user called with:", userData);
  };

  const logout = () => {
    // Dummy function - does nothing in dummy mode
    console.log("Logout called");
  };

  return (
    <UserContext.Provider value={{ user, loading, error, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Hook to get URL count for the current user
export function useUserUrlCount() {
  const [urlCount] = useState(156);
  const [loading] = useState(false);
  return { urlCount, loading };
}

// Define URL type
interface UrlData {
  id: string;
  title: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  isPasswordProtected: boolean;
  createdAt: Date;
  lastClicked: Date | null;
  hashedPassword?: string | null;
}

// Hook to get analytics data for the current user
export function useAnalytics() {
  const [analytics] = useState({
    totalUrls: 156,
    totalClicks: 1247,
    todayClicks: 23,
    trend: "up" as "up" | "down" | "stable",
    clickHistory: [
      { date: "2024-01-14", clicks: 45 },
      { date: "2024-01-15", clicks: 52 },
      { date: "2024-01-16", clicks: 38 },
      { date: "2024-01-17", clicks: 67 },
      { date: "2024-01-18", clicks: 71 },
      { date: "2024-01-19", clicks: 89 },
      { date: "2024-01-20", clicks: 23 },
    ],
  });
  const [loading] = useState(false);
  return { analytics, loading };
}

// Hook to get URLs for the current user
export function useUrls() {
  const [urls, setUrls] = useState<UrlData[]>([
    {
      id: "1",
      title: "My Portfolio Website",
      originalUrl: "https://johndoe.dev",
      shortUrl: "https://ishort.link/portfolio",
      clicks: 156,
      isPasswordProtected: false,
      createdAt: new Date("2024-01-15"),
      lastClicked: new Date("2024-01-20"),
    },
    {
      id: "2", 
      title: "GitHub Repository",
      originalUrl: "https://github.com/johndoe/awesome-project",
      shortUrl: "https://ishort.link/github-repo",
      clicks: 89,
      isPasswordProtected: true,
      createdAt: new Date("2024-01-10"),
      lastClicked: new Date("2024-01-19"),
    },
    {
      id: "3",
      title: "Design Resources",
      originalUrl: "https://dribbble.com/johndoe",
      shortUrl: "https://ishort.link/design",
      clicks: 234,
      isPasswordProtected: false,
      createdAt: new Date("2024-01-05"),
      lastClicked: new Date("2024-01-18"),
    },
    {
      id: "4",
      title: "YouTube Channel",
      originalUrl: "https://youtube.com/@johndoe",
      shortUrl: "https://ishort.link/youtube",
      clicks: 45,
      isPasswordProtected: false,
      createdAt: new Date("2024-01-12"),
      lastClicked: new Date("2024-01-17"),
    },
    {
      id: "5",
      title: "LinkedIn Profile",
      originalUrl: "https://linkedin.com/in/johndoe",
      shortUrl: "https://ishort.link/linkedin",
      clicks: 78,
      isPasswordProtected: true,
      createdAt: new Date("2024-01-08"),
      lastClicked: new Date("2024-01-16"),
    }
  ]);

  const [loading] = useState(false);

  const createUrl = async (urlData: Omit<UrlData, "id" | "createdAt" | "lastClicked" | "clicks" | "shortUrl">) => {
    const newUrl: UrlData = {
      id: Date.now().toString(),
      title: urlData.title,
      originalUrl: urlData.originalUrl,
      shortUrl: `https://ishort.link/${Math.random().toString(36).substr(2, 8)}`,
      clicks: 0,
      isPasswordProtected: urlData.isPasswordProtected,
      createdAt: new Date(),
      lastClicked: null,
      hashedPassword: urlData.hashedPassword || null,
    };
    
    setUrls(prev => [newUrl, ...prev]);
    return newUrl;
  };

  const updateUrl = async (id: string, urlData: Partial<UrlData>) => {
    setUrls(prev => prev.map(url => url.id === id ? { ...url, ...urlData } : url));
  };

  const deleteUrl = async (id: string) => {
    setUrls(prev => prev.filter(url => url.id !== id));
  };

  return { urls, loading, createUrl, updateUrl, deleteUrl };
}
