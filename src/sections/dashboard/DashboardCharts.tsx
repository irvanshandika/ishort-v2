"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface ChartData {
  name: string;
  clicks: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface ClickData {
  urlId: string;
  clickedAt: Date;
  userId?: string;
  userEmail?: string;
  shortUrl: string;
  longUrl: string;
  urlTitle: string;
}

interface UrlData {
  id: string;
  title: string;
  shortUrl: string;
  clicks?: number;
}

interface ChartsProps {
  chartData: ChartData[];
  pieData: PieData[];
  userUrls?: UrlData[];
  currentUserId?: string;
}

export function DashboardCharts({ chartData, pieData, userUrls = [], currentUserId }: ChartsProps) {
  const [realClickData, setRealClickData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClickData = async () => {
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
            shortUrl: data.shortUrl,
            longUrl: data.longUrl,
            urlTitle: data.urlTitle,
          };
        });

        // Create a map of URL IDs from current user's URLs
        const userUrlIds = userUrls.map((url) => url.id);

        // Filter clicks for current user's URLs and group by URL
        const userClicksMap = new Map<string, number>();

        clicksData
          .filter((click) => userUrlIds.includes(click.urlId))
          .forEach((click) => {
            const currentCount = userClicksMap.get(click.urlId) || 0;
            userClicksMap.set(click.urlId, currentCount + 1);
          });

        // Create chart data based on real click data
        const realChartData: ChartData[] = userUrls
          .map((url) => ({
            name: url.shortUrl || url.title,
            clicks: userClicksMap.get(url.id) || 0,
          }))
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 10); // Top 10 URLs

        setRealClickData(realChartData);
      } catch (error) {
        console.error("Error fetching click data:", error);
        // Fallback to original chartData if error occurs
        setRealClickData(chartData);
      } finally {
        setLoading(false);
      }
    };

    fetchClickData();
  }, [userUrls, currentUserId, chartData]);

  const displayData = loading ? chartData : realClickData;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Click Performance</CardTitle>
          <CardDescription>{loading ? "Loading real click data..." : "Top performing URLs by actual click count from database"}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
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
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
