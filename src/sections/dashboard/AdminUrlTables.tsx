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

  // Helper function to truncate URLs
  const truncateUrl = (url: string, maxLength: number = 40): string => {
    if (!url) return "No URL";
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };
  // Helper function to clean and truncate short URLs

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
      {" "}
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Admin URL Management</CardTitle>
            <CardDescription>Manage and track all shortened URLs in the system (Admin privileges)</CardDescription>
          </div>
          <Button variant={isConfirming ? "destructive" : "outline"} onClick={handleDeleteAllConfirm} className={isConfirming ? "animate-pulse" : ""} disabled={urls.length === 0}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            {isConfirming ? "⚠️ CONFIRM DELETE ALL" : "🗑️ Delete All URLs (System-wide)"}
          </Button>
        </div>
      </CardHeader>
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
            {urls.map((url, index) => (
              <TableRow key={url.id}>
                <TableCell className="font-medium">{url.title || "No title"}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{url.shortUrl}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(url.shortUrl || "", index)} disabled={!url.shortUrl}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="truncate max-w-[200px]" title={url.originalUrl || "No URL"}>
                      {truncateUrl(url.originalUrl)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => window.open(url.originalUrl, "_blank")} disabled={!url.originalUrl}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{url.clicks ?? 0}</TableCell>
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
                <TableCell>{url.createdAt ? format(new Date(url.createdAt), "MMM dd, yyyy") : "No date"}</TableCell>
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
  );
}
