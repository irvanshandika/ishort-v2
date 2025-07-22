"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/src/lib/firebase";
import bcrypt from "bcryptjs";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Loader2, ExternalLink, Lock } from "lucide-react";
import toast from "react-hot-toast";

interface UrlData {
  id: string;
  title: string;
  longUrl: string;
  shortUrl: string;
  clicks: number;
  isPasswordProtected: boolean;
  createdAt: Date;
  lastClicked: Date | null;
  hashedPassword?: string | null;
  uid: string;
}

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [user, loadingAuth] = useAuthState(auth);

  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Set the document title based on URL data
  useEffect(() => {
    if (urlData?.title) {
      document.title = `${urlData.title} | iShort`;
    } else if (error) {
      document.title = "URL Not Found | iShort";
    } else {
      document.title = "Redirecting... | iShort";
    }
  }, [urlData, error]);
  const fetchUrlData = async () => {
    try {
      setLoading(true);

      // Query Firebase to find URL by slug
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const q = query(collection(db, "shorturls"), where("shortUrl", "==", slug));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("URL not found");
        setLoading(false);
        return;
      }

      const docData = querySnapshot.docs[0];
      const data = docData.data();

      const urlInfo: UrlData = {
        id: docData.id,
        title: data.title,
        longUrl: data.longUrl,
        shortUrl: data.shortUrl,
        clicks: data.clicks || 0,
        isPasswordProtected: data.isPasswordProtected || false,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastClicked: data.lastClicked?.toDate() || null,
        hashedPassword: data.hashedPassword || null,
        uid: data.uid,
      };

      setUrlData(urlInfo);

      // If URL is password protected, show password form
      if (urlInfo.isPasswordProtected) {
        setShowPasswordForm(true);
      } else {
        // Redirect immediately if not password protected
        await redirectToUrl(urlInfo);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching URL data:", err);
      setError("Failed to fetch URL data");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!slug || loadingAuth) return;
    fetchUrlData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, loadingAuth]);
  const redirectToUrl = async (urlInfo: UrlData) => {
    try {
      // Update click count and last clicked timestamp
      const docRef = doc(db, "shorturls", urlInfo.id);
      await updateDoc(docRef, {
        clicks: increment(1),
        lastClicked: new Date(),
      });

      // Track click in click_url collection
      await addDoc(collection(db, "click_url"), {
        urlId: urlInfo.id,
        userId: user?.uid || null, // null for anonymous users
        userEmail: user?.email || null,
        clickedAt: new Date(),
        userAgent: navigator.userAgent,
        shortUrl: urlInfo.shortUrl,
        longUrl: urlInfo.longUrl,
        urlTitle: urlInfo.title,
      });

      // Redirect to the original URL
      window.location.href = urlInfo.longUrl;
    } catch (err) {
      console.error("Error updating click count or tracking click:", err);
      // Still redirect even if update fails
      window.location.href = urlInfo.longUrl;
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlData || !password) return;

    setVerifying(true);
    try {
      // Verify password with bcrypt
      const isValid = await bcrypt.compare(password, urlData.hashedPassword || "");

      if (isValid) {
        toast.success("Password correct! Redirecting...");
        await redirectToUrl(urlData);
      } else {
        toast.error("Incorrect password");
        setPassword("");
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      toast.error("Failed to verify password");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">URL Not Found</CardTitle> <CardDescription>The short URL you&apos;re looking for doesn&apos;t exist or has been removed.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPasswordForm && urlData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Password Protected</CardTitle>
            <CardDescription>This URL is password protected. Please enter the password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Redirecting to:</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 break-all">{urlData.title || urlData.longUrl}</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={verifying} className="w-full" />
              </div>
              <Button type="submit" disabled={verifying || !password} className="w-full">
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Access URL
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => router.push("/")} className="text-sm">
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This shouldn't happen, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
