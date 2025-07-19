import { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forbidden Access",
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex flex-col items-center gap-2 w-full">
            <Image src="/globe.svg" alt="Forbidden" width={64} height={64} className="mb-2" />
            <CardTitle className="text-center text-2xl font-bold text-destructive">403 Forbidden</CardTitle>
            <CardDescription className="text-center">
              Anda tidak memiliki izin untuk mengakses halaman ini.
              <br />
              Silakan hubungi pihak terkait untuk mendapatkan persetujuan.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground mx-auto">© {new Date().getFullYear()} iShort. All rights reserved.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
