"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Copy, ExternalLink, Trash2, Edit3, AlertTriangle, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { UrlData } from "./UrlDialog";
import { Badge } from "@/src/components/ui/badge";

interface AdminUrlTableProps {
  urls: UrlData[];
  handleEdit: (url: UrlData) => void;
  handleDelete: (urlId: string) => void;
  copyToClipboard: (text: string, index: number) => void;
  handleDeleteAll: () => Promise<void>;
}

export function AdminUrlTable({ urls, handleEdit, handleDelete, copyToClipboard, handleDeleteAll }: AdminUrlTableProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  // Helper function to truncate URLs with responsive lengths
  const truncateUrl = (url: string, maxLength: number = 40): string => {
    if (!url) return "No URL";
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const handleDeleteAllConfirm = async () => {
    if (isConfirming) {
      await handleDeleteAll();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
      // Reset confirmation after 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
    }
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl">Admin URL Management</CardTitle>
            <CardDescription className="text-sm">Manage and track all shortened URLs in the system (Admin privileges)</CardDescription>
          </div>
          <Button variant={isConfirming ? "destructive" : "outline"} onClick={handleDeleteAllConfirm} className={`${isConfirming ? "animate-pulse" : ""} flex-shrink-0 text-xs sm:text-sm`} disabled={urls.length === 0} size="sm">
            <AlertTriangle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{isConfirming ? "⚠️ CONFIRM DELETE ALL" : "🗑️ Delete All URLs (System-wide)"}</span>
            <span className="sm:hidden">{isConfirming ? "⚠️ CONFIRM" : "🗑️ Delete All"}</span>
          </Button>
        </div>
      </CardHeader>{" "}
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Title</TableHead>
                <TableHead className="min-w-[140px]">Short URL</TableHead>
                <TableHead className="min-w-[180px] hidden sm:table-cell">Original URL</TableHead>
                <TableHead className="min-w-[80px]">Clicks</TableHead>
                <TableHead className="min-w-[100px] hidden md:table-cell">Status</TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                <TableHead className="min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
                      <AlertTriangle className="h-8 w-8" />
                      <p className="text-sm font-medium">No URLs found</p>
                      <p className="text-xs">URLs will appear here when created</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                urls.map((url, index) => (
                  <TableRow key={url.id}>
                    <TableCell className="font-medium">
                      <div className="min-w-0">
                        <div className="truncate max-w-[120px] sm:max-w-[180px]" title={url.title || "No title"}>
                          {url.title || "No title"}
                        </div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          <span className="truncate max-w-[120px]" title={url.originalUrl || "No URL"}>
                            {truncateUrl(url.originalUrl, 25)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{url.shortUrl}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(url.shortUrl || "", index)} disabled={!url.shortUrl}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        <span className="truncate max-w-[150px] lg:max-w-[200px]" title={url.originalUrl || "No URL"}>
                          {truncateUrl(url.originalUrl, 30)}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => window.open(url.originalUrl, "_blank")} disabled={!url.originalUrl}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">{url.clicks ?? 0}</span>
                      <div className="md:hidden text-xs text-gray-500 mt-1">
                        {url.isPasswordProtected ? (
                          <span className="flex items-center">
                            <Lock className="h-3 w-3 mr-1" />
                            Protected
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Unlock className="h-3 w-3 mr-1" />
                            Public
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center space-x-2">
                        {url.isPasswordProtected ? (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Lock className="h-3 w-3" />
                            <span className="hidden lg:inline">Protected</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Unlock className="h-3 w-3" />
                            <span className="hidden lg:inline">Public</span>
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{url.createdAt ? format(new Date(url.createdAt), "MMM dd, yyyy") : "No date"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(url)} title="Edit">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(url.id)} title="Delete">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
