/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/src/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePassword, updateProfile } from "firebase/auth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/src/components/ui/dialog";
import { Eye, EyeOff, Upload, AlertTriangle } from "lucide-react";
import bcrypt from "bcryptjs";
import Image from "next/image";
import DeleteAccountSection from "./DeleteAccount";

// Profile schema definition
const profileSchema = z.object({
  displayName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Phone number contains invalid characters" }),
});

// Password schema definition
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signType, setSignType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Profile form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      email: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/forbidden");
    } else if (user) {
      // Set basic user data from Authentication
      form.setValue("displayName", user.displayName || "");
      form.setValue("email", user.email || "");
      setPhotoURL(user.photoURL || "");
      setPhotoPreview(user.photoURL || "");

      // Fetch additional user data from Firestore
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSignType(userData.signType);
          form.setValue("phoneNumber", userData.phoneNumber || "");
        }
      };
      fetchUserData();
    }
  }, [user, loading, router, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndPreviewFile(file);
    }
  };

  const validateAndPreviewFile = (file: File) => {
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPG, PNG, GIF, WEBP, SVG)");
      return;
    }

    // Check file size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size must be less than 15MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPreviewFile(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      let newPhotoURL = photoURL;

      // Handle photo upload
      if (photoPreview && photoPreview !== photoURL) {
        const fileInput = document.getElementById("profile-photo") as HTMLInputElement;
        let file: File | undefined;

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          file = fileInput.files[0];
        } else if (photoPreview.startsWith("data:")) {
          // Handle dropped file that was previewed but not in the file input
          const response = await fetch(photoPreview);
          const blob = await response.blob();
          file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        }

        if (file) {
          const storageRef = ref(storage, `profileImages/${user.uid}`);
          await uploadBytes(storageRef, file);
          newPhotoURL = await getDownloadURL(storageRef);
        }
      }

      // Update Firebase Auth user profile with new displayName and photoURL
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: newPhotoURL,
      });

      // Update user data in Firestore
      const updateData: any = {
        displayName: data.displayName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        photoURL: newPhotoURL,
      };

      await updateDoc(doc(db, "users", user.uid), updateData);

      toast.success("Profile updated successfully!", {
        icon: "🚀",
        duration: 3000,
      });

      setIsDialogOpen(false);

      // Refresh the page to reflect the changes
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      toast.error("Error updating profile. Please try again.");
      console.error("Profile update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user || signType !== "credential") return;

    try {
      setIsPasswordUpdating(true);

      // Update Firebase Auth password
      await updatePassword(user, data.newPassword);

      // Update the hashed password in Firestore
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.newPassword, salt);

      await updateDoc(doc(db, "users", user.uid), {
        hashedPassword: hashedPassword,
      });

      toast.success("Password updated successfully! You will be logged out.", {
        duration: 3000,
      });

      // Clear form
      passwordForm.reset();

      // Log out after password change
      setTimeout(() => {
        auth.signOut();
        router.push("/");
      }, 3000);
    } catch (err) {
      toast.error("Error updating password. Please try again.");
      console.error("Password update error:", err);
    } finally {
      setIsPasswordUpdating(false);
    }
  };
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          {/* Tabs skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 md:flex gap-2 md:gap-4">
              <div className="h-8 md:h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 md:h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 md:h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            {/* Card skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-800">
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 space-y-2">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="p-4 md:p-6 space-y-6">
                {/* Avatar and form fields skeleton */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
                {/* Form fields skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">This is how others will see you on the site.</p>
        </div>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-fit md:grid-cols-none md:flex">
            <TabsTrigger value="general" className="text-xs md:text-sm">
              General
            </TabsTrigger>
            <TabsTrigger value="password" disabled={signType === "google"} className="text-xs md:text-sm">
              Password
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex justify-center items-center text-xs md:text-sm">
              <span className="text-red-500 hidden md:inline">Danger Area</span>
              <span className="text-red-500 md:hidden">Danger</span>
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-500 ml-1 md:ml-2" />
            </TabsTrigger>
          </TabsList>{" "}
          <TabsContent value="general" className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-800">
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">General Information</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">Update your photo and personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6">
                {" "}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <Avatar className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
                        <AvatarImage src={photoPreview || ""} alt="Avatar" className="object-cover" />
                        <AvatarFallback>{form.getValues().displayName?.substring(0, 2).toUpperCase() || "CN"}</AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mb-2 w-full sm:w-auto">
                              Change Avatar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-lg md:text-xl">Change Avatar</DialogTitle>
                              <DialogDescription className="text-sm">Upload a new profile picture. JPG, PNG, GIF, WEBP or SVG. Max size of 15MB.</DialogDescription>
                            </DialogHeader>
                            <div
                              className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}>
                              {photoPreview && (
                                <div className="mb-4 flex justify-center">
                                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden">
                                    <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                                  </div>
                                </div>
                              )}
                              <div className="space-y-2">
                                <Upload className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                                <div className="flex text-xs md:text-sm text-gray-600 flex-col items-center">
                                  <label htmlFor="profile-photo" className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="profile-photo" name="profile-photo" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">JPG, PNG, GIF, WEBP or SVG up to 15MB</p>
                              </div>
                            </div>
                            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                                Cancel
                              </Button>
                              <Button type="button" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                                Done
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <p className="text-xs md:text-sm text-muted-foreground">JPG, PNG, GIF, WEBP or SVG. Max size of 15MB</p>
                      </div>
                    </div>{" "}
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} className="text-sm md:text-base" />
                          </FormControl>
                          <FormDescription className="text-xs md:text-sm">This is your public display name.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@example.com" {...field} disabled={signType === "google"} className={`text-sm md:text-base ${signType === "google" ? "cursor-not-allowed" : ""}`} />
                          </FormControl>
                          <FormDescription className="text-xs md:text-sm">{signType === "google" ? "Email cannot be changed for Google accounts" : "You can manage verified email addresses in your email settings."}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} className="text-sm md:text-base" />
                          </FormControl>
                          <FormDescription className="text-xs md:text-sm">Your contact phone number.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? "Saving..." : "Update profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>{" "}
          <TabsContent value="password" className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-800">
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Password</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Current password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showCurrentPassword ? "text" : "password"} {...field} className="text-sm md:text-base pr-10" />
                              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showCurrentPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5 text-gray-400" /> : <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">New password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showNewPassword ? "text" : "password"} {...field} className="text-sm md:text-base pr-10" />
                              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showNewPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5 text-gray-400" /> : <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs md:text-sm">Password must contain at least one uppercase letter, one lowercase letter, and one number</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base">Confirm password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showConfirmPassword ? "text" : "password"} {...field} className="text-sm md:text-base pr-10" />
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5 text-gray-400" /> : <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPasswordUpdating} className="w-full sm:w-auto">
                      {isPasswordUpdating ? "Updating..." : "Save password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>{" "}
          <TabsContent value="danger" className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-800">
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Danger Area</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">This area is for advanced users only. Please be careful when making changes here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6">
                <DeleteAccountSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePage;
