"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Plus, Link2, Eye, BarChart3, Copy, ExternalLink, Trash2, Edit3, Lock, Unlock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Form Schema
const urlFormSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    originalUrl: z.string().url("Please enter a valid URL"),
    customSlug: z.string().optional(),
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

type UrlFormData = z.infer<typeof urlFormSchema>;

// URL type definition
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

export default function DashboardMain() {
  // Data dummy untuk analytics
  const analytics = {
    totalUrls: 156,
    totalClicks: 1247,
    todayClicks: 23,
    trend: "up" as "up" | "down" | "stable",
  };

  // Data dummy untuk URLs
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
    },
  ]);

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
  });

  const watchUsePassword = form.watch("usePassword");

  // Create chart data from dummy URLs
  const chartData = urls.slice(0, 10).map((url) => ({
    name: url.shortUrl.split("/").pop() || "",
    clicks: url.clicks,
  }));

  // Create pie data for protected vs public URLs
  const protectedCount = urls.filter((url) => url.isPasswordProtected).length;
  const publicCount = urls.length - protectedCount;
  const pieData = [
    { name: "Public URLs", value: publicCount, color: "#3B82F6" },
    { name: "Protected URLs", value: protectedCount, color: "#EF4444" },
  ];

  const handleSubmit = (data: UrlFormData) => {
    try {
      const newUrl: UrlData = {
        id: Date.now().toString(),
        title: data.title,
        originalUrl: data.originalUrl,
        shortUrl: `https://ishort.link/${data.customSlug || Math.random().toString(36).substr(2, 8)}`,
        clicks: 0,
        isPasswordProtected: data.usePassword,
        createdAt: new Date(),
        lastClicked: null,
        hashedPassword: data.usePassword ? "hashed_password" : null,
      };

      if (editingUrl) {
        // Update existing URL
        setUrls((prevUrls) => prevUrls.map((url) => (url.id === editingUrl.id ? { ...url, ...newUrl, id: editingUrl.id, createdAt: editingUrl.createdAt } : url)));
        toast.success("URL updated successfully!");
      } else {
        // Create new URL
        setUrls((prevUrls) => [newUrl, ...prevUrls]);
        toast.success("URL created successfully!");
      }

      form.reset();
      setIsDialogOpen(false);
      setEditingUrl(null);
    } catch {
      toast.error("Failed to save URL");
    }
  };

  const handleEdit = (url: UrlData) => {
    setEditingUrl(url);
    form.setValue("title", url.title);
    form.setValue("originalUrl", url.originalUrl);
    form.setValue("customSlug", url.shortUrl.split("/").pop() || "");
    form.setValue("usePassword", url.isPasswordProtected);
    form.setValue("password", "");
    setIsDialogOpen(true);
  };

  const handleDelete = (urlId: string) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url.id !== urlId));
    toast.success("URL deleted successfully!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your shortened URLs and track their performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUrls}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClicks}</div>
              <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Clicks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.todayClicks}</div>
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Click Performance</CardTitle>
              <CardDescription>Top performing URLs by click count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>URL Protection Status</CardTitle>
              <CardDescription>Distribution of protected vs public URLs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* URL Management Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your URLs</CardTitle>
                <CardDescription>Manage and track your shortened URLs</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingUrl(null);
                      form.reset();
                    }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create URL
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingUrl ? "Edit URL" : "Create New URL"}</DialogTitle>
                    <DialogDescription>{editingUrl ? "Update your shortened URL settings" : "Create a new shortened URL with optional password protection"}</DialogDescription>
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
                              <Input placeholder="Enter a descriptive title" {...field} />
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
                              <Input placeholder="https://example.com" {...field} />
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
                              <Input placeholder="my-custom-link" {...field} />
                            </FormControl>
                            <FormDescription>Leave empty for auto-generated slug</FormDescription>
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
                        <Button type="submit">{editingUrl ? "Update URL" : "Create URL"}</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          {/* Manajemen URL */}
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell className="font-medium">{url.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{url.shortUrl.replace("https://", "")}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(url.shortUrl)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="truncate max-w-[200px]">{url.originalUrl}</span>
                        <Button variant="ghost" size="sm" onClick={() => window.open(url.originalUrl, "_blank")}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{url.clicks}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {url.isPasswordProtected ? (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Lock className="h-3 w-3" />
                            <span>Protected</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Unlock className="h-3 w-3" />
                            <span>Public</span>
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{format(url.createdAt, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(url)}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(url.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
