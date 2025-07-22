/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/src/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import DashboardLayout from "@/src/components/DashboardLayout";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Badge } from "@/src/components/ui/badge";
import { urlFormSchema, UrlFormData } from "@/src/sections/dashboard/UrlDialog";
import { Copy, ExternalLink, Link2, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import bcrypt from "bcryptjs";

export default function CreatePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<{
    title: string;
    shortUrl: string;
    originalUrl: string;
    fullShortUrl: string;
  } | null>(null);

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      title: "",
      originalUrl: "",
      customSlug: "",
      usePassword: false,
      password: "",
    },
  });

  const watchUsePassword = form.watch("usePassword");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/forbidden");
    }
  }, [user, loading, router]);

  // Function to check if custom slug is already in use
  const checkCustomSlugAvailability = async (customSlug: string): Promise<boolean> => {
    if (!customSlug) return true;

    try {
      const q = query(collection(db, "shorturls"), where("shortUrl", "==", customSlug));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking custom slug:", error);
      return false;
    }
  };

  const handleSubmit = async (data: UrlFormData) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setIsSubmitting(true);

      // Check custom slug availability if provided
      if (data.customSlug) {
        setIsCheckingSlug(true);
        const isAvailable = await checkCustomSlugAvailability(data.customSlug);
        if (!isAvailable) {
          toast.error(`Sorry, "${data.customSlug}" is already in use`);
          setIsCheckingSlug(false);
          setIsSubmitting(false);
          return;
        }
        setIsCheckingSlug(false);
      }

      // Generate custom slug or random slug
      const customSlug = data.customSlug || Math.random().toString(36).substr(2, 8);

      // Hash password if provided
      let hashedPassword = null;
      if (data.usePassword && data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      const urlData = {
        title: data.title,
        longUrl: data.originalUrl,
        shortUrl: customSlug,
        clicks: 0,
        isPasswordProtected: data.usePassword,
        uid: user.uid,
        createdAt: new Date(),
        lastClicked: null,
        hashedPassword: hashedPassword,
      };

      // Save to Firebase
      await addDoc(collection(db, "shorturls"), urlData);

      // Show success state
      const domain = process.env.NODE_ENV === "production" ? "https://ishort.my.id" : "http://localhost:3000";
      const fullShortUrl = `${domain}/${customSlug}`;

      setCreatedUrl({
        title: data.title,
        shortUrl: customSlug,
        originalUrl: data.originalUrl,
        fullShortUrl: fullShortUrl,
      });

      toast.success("URL created successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating URL:", error);
      toast.error("Failed to create URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleCreateAnother = () => {
    setCreatedUrl(null);
    form.reset();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Short URL</h1>
            <p className="text-gray-600 dark:text-gray-400">Shorten a new URL with custom options and password protection</p>
          </div>

          {!createdUrl ? (
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>URL Shortener</span>
                </CardTitle>
                <CardDescription>Transform your long URLs into short, shareable links with advanced options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a descriptive title" {...field} className="h-12 text-base" required />
                          </FormControl>
                          <FormDescription>Give your shortened URL a memorable title</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="originalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Original URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/very-long-url-that-needs-shortening" {...field} className="h-12 text-base" required />
                          </FormControl>
                          <FormDescription>The long URL you want to shorten</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customSlug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Custom Slug (Optional)</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{process.env.NODE_ENV === "production" ? "ishort.my.id/" : "localhost:3000/"}</span>
                              <Input placeholder="my-custom-link" maxLength={25} {...field} className="h-12 text-base" />
                            </div>
                          </FormControl>
                          <FormDescription>Leave empty for auto-generated slug (max 25 characters, no spaces)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usePassword"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-gray-900/50">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">Password Protection</FormLabel>
                            <FormDescription>Require a password to access this URL</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {watchUsePassword && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter password (minimum 6 characters)" {...field} className="h-12 text-base" />
                            </FormControl>
                            <FormDescription>Minimum 6 characters required</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="pt-4">
                      <Button type="submit" disabled={isSubmitting || isCheckingSlug} className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                        {isCheckingSlug ? (
                          "Checking availability..."
                        ) : isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating URL...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Link2 className="h-4 w-4" />
                            <span>Create Short URL</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            // Success State
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                  <span>URL Created Successfully!</span>
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-300">Your shortened URL is ready to share</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Title</label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{createdUrl.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Short URL</label>
                    <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
                      <code className="flex-1 text-lg font-mono text-blue-600 dark:text-blue-400 break-all">{createdUrl.fullShortUrl}</code>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(createdUrl.fullShortUrl)} className="flex-shrink-0">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Original URL</label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <span className="flex-1 text-gray-600 dark:text-gray-400 break-all">{createdUrl.originalUrl}</span>
                      <Button variant="ghost" size="sm" onClick={() => window.open(createdUrl.originalUrl, "_blank")} className="flex-shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                      0 Clicks
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleCreateAnother} className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    <Link2 className="h-4 w-4 mr-2" />
                    Create Another URL
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
