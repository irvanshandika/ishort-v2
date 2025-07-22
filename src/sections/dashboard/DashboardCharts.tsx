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
  createdAt?: Date;
  originalUrl?: string;
  isPasswordProtected?: boolean;
  lastClicked?: Date | null;
  hashedPassword?: string | null;
}

interface TooltipPayload {
  value: number;
  name: string;
  payload?: Record<string, unknown>;
}

interface ChartsProps {
  chartData: ChartData[];
  pieData: PieData[];
  userUrls?: UrlData[];
  currentUserId?: string;
}

export function DashboardCharts({ chartData, pieData, userUrls = [], currentUserId }: ChartsProps) {
  const [realClickData, setRealClickData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true); // Custom tooltip component for better dark mode support
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
    if (active && payload && payload.length) {
      // Find the corresponding URL for this data point
      const clickCount = payload[0].value;
      const correspondingUrl = userUrls.find((url) => {
        const urlDate = url.createdAt
          ? new Date(url.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : null;
        return urlDate === label;
      });

      return (
        <div className="bg-background border border-border rounded-md p-3 shadow-lg">
          {correspondingUrl && <p className="text-sm mb-1">{correspondingUrl.title || correspondingUrl.shortUrl}</p>}
          <p className="text-foreground">
            <span className="font-medium">Clicks: </span>
            <span className="text-primary">{clickCount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-md p-3 shadow-lg">
          <p className="text-foreground font-medium">{payload[0].name}</p>
          <p className="text-foreground">
            <span className="font-medium">Count: </span>
            <span className="text-primary">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

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
          }); // Create chart data based on real click data
        const realChartData: ChartData[] = userUrls
          .map((url, index) => {
            // Use URL creation date for X-axis display
            let displayDate: string;
            if (url.createdAt) {
              displayDate = new Date(url.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            } else {
              // If no creation date, use current date with index offset to show different dates
              const offsetDate = new Date();
              offsetDate.setDate(offsetDate.getDate() - index);
              displayDate = offsetDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            }

            console.log("URL data:", {
              title: url.title,
              shortUrl: url.shortUrl,
              displayDate,
              clicks: userClicksMap.get(url.id) || 0,
            });

            return {
              name: displayDate,
              clicks: userClicksMap.get(url.id) || 0,
            };
          })
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 10); // Top 10 URLs

        console.log("Final chart data:", realChartData);

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

  console.log("Display data being used:", displayData);
  console.log("Loading state:", loading);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Click Performance</CardTitle>
          <CardDescription>{loading ? "Loading real click data..." : "Top performing URLs by actual click count from database"}</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
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
          {" "}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
