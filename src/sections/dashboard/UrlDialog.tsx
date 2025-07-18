"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { toast } from "react-hot-toast";

// Form Schema
export const urlFormSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    originalUrl: z.string().url("Please enter a valid URL"),
    customSlug: z
      .string()
      .max(25, "Custom slug must be less than 25 characters")
      .refine((val) => !val || !/\s/.test(val), {
        message: "Custom slug cannot contain spaces",
      })
      .optional(),
    usePassword: z.boolean(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.usePassword && (!data.password || data.password.length < 6)) {
        return false;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters when enabled",
      path: ["password"],
    }
  );

export type UrlFormData = z.infer<typeof urlFormSchema>;

export interface UrlData {
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

interface UrlDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  form: UseFormReturn<UrlFormData>;
  onSubmit: (data: UrlFormData) => void;
  editingUrl: UrlData | null;
  resetForm: () => void;
  currentUser: { uid: string; email?: string | null; displayName?: string | null } | null; // Firebase User object compatible
}

export function UrlDialog({ isOpen, setIsOpen, form, onSubmit, editingUrl, resetForm, currentUser }: UrlDialogProps) {
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const watchUsePassword = form.watch("usePassword");
  // Function to check if custom slug is already in use
  const checkCustomSlugAvailability = async (customSlug: string): Promise<boolean> => {
    if (!customSlug) return true; // Empty slug is allowed (will generate random)

    try {
      // Check against shortUrl field which now stores only the slug
      const q = query(collection(db, "shorturls"), where("shortUrl", "==", customSlug));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // true if slug is available
    } catch (error) {
      console.error("Error checking custom slug:", error);
      return false;
    }
  };
  // Enhanced onSubmit function with slug validation
  const handleSubmit = async (data: UrlFormData) => {
    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // Check custom slug availability if provided
      if (data.customSlug && !editingUrl) {
        setIsCheckingSlug(true);
        const isAvailable = await checkCustomSlugAvailability(data.customSlug);
        if (!isAvailable) {
          toast.error(`Sorry, ${data.customSlug} is already in use`);
          setIsCheckingSlug(false);
          return;
        }
      }

      // Call parent's onSubmit function which handles database operations
      onSubmit(data);
      setIsCheckingSlug(false);
    } catch (error) {
      console.error("Error creating URL:", error);
      toast.error("Failed to create URL");
      setIsCheckingSlug(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="mr-2 h-4 w-4" />
          Create URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingUrl ? "Edit URL" : "Create New URL"}</DialogTitle>
          <DialogDescription>{editingUrl ? "Update your shortened URL settings" : "Create a new shortened URL with optional password protection"}</DialogDescription>{" "}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Slug (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="my-custom-link" maxLength={25} {...field} />
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Password Protection</FormLabel>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit" disabled={isCheckingSlug}>
                {isCheckingSlug ? "Checking availability..." : editingUrl ? "Update URL" : "Create URL"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
