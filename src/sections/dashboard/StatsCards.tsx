"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Link2, Eye, BarChart3 } from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface ClickData {
  urlId: string;
  clickedAt: Date;
  userId?: string;
  userEmail?: string;
}

interface UrlData {
  id: string;
  title: string;
  shortUrl: string;
  clicks?: number;
}

interface StatsCardsProps {
  analytics: {
    totalUrls: number;
    totalClicks: number;
    todayClicks: number;
    trend: "up" | "down" | "stable";
  };
  userUrls?: UrlData[];
  currentUserId?: string;
}

export function StatsCards({ analytics, userUrls = [], currentUserId }: StatsCardsProps) {
  const [realStats, setRealStats] = useState({
    totalClicks: analytics.totalClicks,
    todayClicks: analytics.todayClicks,
    yesterdayClicks: 0,
    lastMonthClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      if (!userUrls.length || !currentUserId) {
        setLoading(false);
        return;
      }

      try {
        // Get all click data from click_url collection
        const clicksQuery = query(collection(db, "click_url"));
        const clicksSnapshot = await getDocs(clicksQuery);

        const clicksData: ClickData[] = clicksSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            urlId: data.urlId,
            clickedAt: data.clickedAt?.toDate() || new Date(),
            userId: data.userId,
            userEmail: data.userEmail,
          };
        });

        // Create a map of URL IDs from current user's URLs
        const userUrlIds = userUrls.map((url) => url.id);

        // Filter clicks for current user's URLs
        const userClicks = clicksData.filter((click) => userUrlIds.includes(click.urlId));

        // Calculate date ranges
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        // Count clicks by time periods
        const totalClicks = userClicks.length;
        const todayClicks = userClicks.filter((click) => click.clickedAt >= today).length;
        const yesterdayClicks = userClicks.filter((click) => click.clickedAt >= yesterday && click.clickedAt < today).length;
        const lastMonthClicks = userClicks.filter((click) => click.clickedAt < lastMonth).length;

        setRealStats({
          totalClicks,
          todayClicks,
          yesterdayClicks,
          lastMonthClicks,
        });
      } catch (error) {
        console.error("Error fetching real stats:", error);
        // Keep original analytics data if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchRealStats();
  }, [userUrls, currentUserId, analytics]);

  const calculateTrendText = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return `+${diff} from last period`;
    if (diff < 0) return `${diff} from last period`;
    return "No change from last period";
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
          <Link2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalUrls}</div>
          <p className="text-xs text-muted-foreground">{loading ? "Loading..." : `+${Math.max(0, analytics.totalUrls - 5)} from last month`}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? analytics.totalClicks : realStats.totalClicks}</div>
          <p className="text-xs text-muted-foreground">{loading ? "Loading real data..." : calculateTrendText(realStats.totalClicks, realStats.lastMonthClicks)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Clicks</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? analytics.todayClicks : realStats.todayClicks}</div>
          <p className="text-xs text-muted-foreground">{loading ? "Loading real data..." : calculateTrendText(realStats.todayClicks, realStats.yesterdayClicks)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
