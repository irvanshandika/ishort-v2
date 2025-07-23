/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { db, auth, app } from "@/src/lib/firebase";
import { collection, query, where, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import bcrypt from "bcryptjs";
import { DashboardHeader } from "@/src/sections/dashboard/DashboardHeader";
import { StatsCards } from "@/src/sections/dashboard/StatsCards";
import { DashboardCharts } from "@/src/sections/dashboard/DashboardCharts";
import { UrlDialog, urlFormSchema, UrlFormData, UrlData } from "@/src/sections/dashboard/UrlDialog";
import { UrlTable } from "@/src/sections/dashboard/UrlTable";
import { AdminUrlTable } from "@/src/sections/dashboard/AdminUrlTables";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function DashboardMain() {
  const [user, error] = useAuthState(auth);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userUrls, setUserUrls] = useState<UrlData[]>([]);
  const [allUrls, setAllUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [users, setUsers] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null); // State untuk menyimpan role user
  // const auth = getAuth();

  useEffect(() => {
    const authInstance = getAuth(app);
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        setUsers(user);

        // Fetch role from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role); // Ambil peran dari Firestore
        } else {
          setRole(null);
        }
      } else {
        setUsers(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserUrls(user.uid);
        await fetchAllUrls();
      } else {
        setCurrentUser(null);
        setUserUrls([]);
        setAllUrls([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/forbidden");
    }
  }, [user, loading, router]);

  // Fetch URLs for current user
  const fetchUserUrls = async (uid: string) => {
    try {
      const q = query(collection(db, "shorturls"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const fetchedUrls: UrlData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        originalUrl: doc.data().longUrl, // Map database 'longUrl' field to interface 'originalUrl'
        shortUrl: doc.data().shortUrl,
        clicks: doc.data().clicks || 0,
        isPasswordProtected: doc.data().isPasswordProtected || false,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastClicked: doc.data().lastClicked?.toDate() || null,
        hashedPassword: doc.data().hashedPassword || null,
      }));
      setUserUrls(fetchedUrls);
    } catch (error) {
      console.error("Error fetching user URLs:", error);
      toast.error("Failed to fetch URLs");
    }
  };
  // Fetch all URLs for admin view
  const fetchAllUrls = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shorturls"));
      const fetchedUrls: UrlData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        originalUrl: doc.data().longUrl, // Map database 'longUrl' field to interface 'originalUrl'
        shortUrl: doc.data().shortUrl,
        clicks: doc.data().clicks || 0,
        isPasswordProtected: doc.data().isPasswordProtected || false,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastClicked: doc.data().lastClicked?.toDate() || null,
        hashedPassword: doc.data().hashedPassword || null,
      }));
      setAllUrls(fetchedUrls);
    } catch (error) {
      console.error("Error fetching all URLs:", error);
      toast.error("Failed to fetch URLs");
    }
  };

  // Data untuk analytics
  const analytics = {
    totalUrls: userUrls.length,
    totalClicks: userUrls.reduce((sum, url) => sum + (url.clicks || 0), 0),
    todayClicks: 0,
    trend: "up" as "up" | "down" | "stable",
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState<UrlData | null>(null);
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      title: "",
      originalUrl: "",
      customSlug: "",
      usePassword: false,
      password: "",
    },
  }); // Create chart data from user URLs
  const chartData = userUrls.slice(0, 10).map((url, index) => ({
    name: url.createdAt
      ? new Date(url.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
    clicks: url.clicks,
  }));

  // Create pie data for protected vs public URLs
  const protectedCount = userUrls.filter((url) => url.isPasswordProtected).length;
  const publicCount = userUrls.length - protectedCount;
  const pieData = [
    { name: "Public URLs", value: publicCount, color: "#3B82F6" },
    { name: "Protected URLs", value: protectedCount, color: "#EF4444" },
  ];

  const handleSubmit = async (data: UrlFormData) => {
    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // Generate custom slug or random slug
      const customSlug = data.customSlug || Math.random().toString(36).substr(2, 8);

      // Hash password if provided
      let hashedPassword = null;
      if (data.usePassword && data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      const urlData = {
        title: data.title,
        longUrl: data.originalUrl, // Save as 'longUrl' in database, map to 'originalUrl' in interface
        shortUrl: customSlug, // Store only the custom slug, not the full URL
        clicks: 0,
        isPasswordProtected: data.usePassword,
        uid: currentUser.uid,
        createdAt: new Date(),
        lastClicked: null,
        hashedPassword: hashedPassword,
      };

      if (editingUrl) {
        // Update existing URL
        const docRef = doc(db, "shorturls", editingUrl.id);
        await updateDoc(docRef, urlData);
        await fetchUserUrls(currentUser.uid);
        await fetchAllUrls();
        toast.success("URL updated successfully!");
      } else {
        // Create new URL
        await addDoc(collection(db, "shorturls"), urlData);
        await fetchUserUrls(currentUser.uid);
        await fetchAllUrls();
        toast.success("URL created successfully!");
      }

      form.reset();
      setIsDialogOpen(false);
      setEditingUrl(null);
    } catch (error) {
      console.error("Error saving URL:", error);
      toast.error("Failed to save URL");
    }
  };
  const handleEdit = (url: UrlData) => {
    setEditingUrl(url);
    form.setValue("title", url.title);
    form.setValue("originalUrl", url.originalUrl);
    form.setValue("customSlug", url.shortUrl); // shortUrl now contains only the slug
    form.setValue("usePassword", url.isPasswordProtected);
    form.setValue("password", "");
    setIsDialogOpen(true);
  };
  const handleDelete = async (urlId: string) => {
    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // ADMIN PRIVILEGE: Can delete any URL regardless of owner
      await deleteDoc(doc(db, "shorturls", urlId));
      await fetchUserUrls(currentUser.uid);
      await fetchAllUrls();
      toast.success("URL deleted successfully!");
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL");
    }
  };
  const handleDeleteAll = async () => {
    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // ADMIN PRIVILEGE: Query ALL URLs in database (no user filter)
      // This will delete ALL URLs from ALL users in the system
      const querySnapshot = await getDocs(collection(db, "shorturls"));

      if (querySnapshot.empty) {
        toast.success("No URLs to delete");
        return;
      }

      const deletePromises = querySnapshot.docs.map((document) => deleteDoc(doc(db, "shorturls", document.id)));

      await Promise.all(deletePromises);
      await fetchUserUrls(currentUser.uid);
      await fetchAllUrls();
      toast.success(`🗑️ Admin deleted ${deletePromises.length} URLs permanently from the entire system!`);
    } catch (error) {
      console.error("Error deleting all URLs:", error);
      toast.error("Failed to delete all URLs");
    }
  };

  const copyToClipboard = (shortUrl: string, index: number) => {
    const domain = process.env.NODE_ENV === "production" ? "https://ishort.my.id" : "http://localhost:3000";
    const fullUrl = `${domain}/${shortUrl}`;

    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const resetForm = () => {
    setEditingUrl(null);
    form.reset();
  };
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader title="Dashboard" description="Manage your shortened URLs and track their performance" />

        <StatsCards analytics={analytics} userUrls={userUrls} currentUserId={currentUser?.uid} />

        <DashboardCharts chartData={chartData} pieData={pieData} userUrls={userUrls} currentUserId={currentUser?.uid} />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <UrlTable
              urls={userUrls}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              copyToClipboard={copyToClipboard}
              UrlDialogComponent={<UrlDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} form={form} onSubmit={handleSubmit} editingUrl={editingUrl} resetForm={resetForm} currentUser={currentUser} />}
            />
            <div className="my-4"></div>
            {role === "admin" ? (
              <>
                <AdminUrlTable urls={allUrls} handleEdit={handleEdit} handleDelete={handleDelete} copyToClipboard={copyToClipboard} handleDeleteAll={handleDeleteAll} />
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
