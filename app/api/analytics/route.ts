import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Data dummy untuk analytics
    const analyticsData = {
      totalUrls: 156,
      totalClicks: 1247,
      todayClicks: 23,
      trend: "up" as "up" | "down" | "stable",
      clickHistory: [
        { date: "2024-01-14", clicks: 45 },
        { date: "2024-01-15", clicks: 52 },
        { date: "2024-01-16", clicks: 38 },
        { date: "2024-01-17", clicks: 67 },
        { date: "2024-01-18", clicks: 71 },
        { date: "2024-01-19", clicks: 89 },
        { date: "2024-01-20", clicks: 23 },
      ],
      urlCount: 156,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
