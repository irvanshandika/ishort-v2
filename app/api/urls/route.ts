import { NextRequest, NextResponse } from "next/server";

interface DummyUrl {
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

// Data dummy untuk URLs
const dummyUrls: DummyUrl[] = [
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
];

export async function GET() {
  try {
    return NextResponse.json(dummyUrls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUrl: DummyUrl = {
      id: Date.now().toString(),
      title: body.title,
      originalUrl: body.originalUrl,
      shortUrl: `https://ishort.link/${body.customSlug || Math.random().toString(36).substr(2, 8)}`,
      clicks: 0,
      isPasswordProtected: body.usePassword || false,
      createdAt: new Date(),
      lastClicked: null,
      hashedPassword: body.usePassword ? "hashed_password" : null,
    };

    dummyUrls.unshift(newUrl);

    return NextResponse.json(newUrl);
  } catch (error) {
    console.error("Error creating URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const urlIndex = dummyUrls.findIndex((url) => url.id === id);
    if (urlIndex === -1) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    dummyUrls[urlIndex] = { ...dummyUrls[urlIndex], ...updateData };

    return NextResponse.json(dummyUrls[urlIndex]);
  } catch (error) {
    console.error("Error updating URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "URL ID is required" }, { status: 400 });
    }

    const urlIndex = dummyUrls.findIndex((url) => url.id === id);
    if (urlIndex === -1) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    dummyUrls.splice(urlIndex, 1);

    return NextResponse.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
