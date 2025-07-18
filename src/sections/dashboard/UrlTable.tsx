"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
// import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Copy, ExternalLink, Trash2, Edit3, Lock, Unlock } from "lucide-react"
import { format } from "date-fns";
import { UrlData } from "./UrlDialog";
import { Badge } from "@/src/components/ui/badge";

interface UrlTableProps {
  urls: UrlData[];
  handleEdit: (url: UrlData) => void;
  handleDelete: (urlId: string) => void;
  copyToClipboard: (text: string, index: number) => void;
  UrlDialogComponent: React.ReactNode;
}

export function UrlTable({ urls, handleEdit, handleDelete, copyToClipboard, UrlDialogComponent }: UrlTableProps) {
  return (
    <Card>
      <CardHeader>
        {" "}
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your URLs</CardTitle>
            <CardDescription>Manage and track your shortened URLs</CardDescription>
          </div>
          {UrlDialogComponent}
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
                <TableCell className="font-medium">{url.title}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{url.shortUrl}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(url.shortUrl || "", index)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {" "}
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
  );
}
