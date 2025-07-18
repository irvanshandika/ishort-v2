"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Link2, Eye, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  analytics: {
    totalUrls: number;
    totalClicks: number;
    todayClicks: number;
    trend: "up" | "down" | "stable";
  };
}

export function StatsCards({ analytics }: StatsCardsProps) {
  return (
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
  );
}
