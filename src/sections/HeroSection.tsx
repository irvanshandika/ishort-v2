"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { FadeInView } from "@/src/components/FadeInView";
import { Copy, Check, Link2, Zap } from "lucide-react";

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url) return;

    setIsLoading(true);
    setTimeout(() => {
      setShortUrl(`ishort.ly/${Math.random().toString(36).substr(2, 8)}`);
      setIsLoading(false);
    }, 1000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-16 pt-24">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Brand & Title */}
        <FadeInView>
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                ✨ New: Analytics Dashboard Available
              </Badge>

              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <Link2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">iShort</h1>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              Shorten URLs.
              <br />
              <span className="text-blue-600 dark:text-blue-400">Share Instantly.</span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">Transform your long URLs into short, shareable links in seconds. Simple, fast, and reliable URL shortening service. </p>
          </div>
        </FadeInView>

        {/* URL Shortener Form */}
        <FadeInView delay={0.2}>
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="url"
                    placeholder="Paste your long URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 h-12 text-lg border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  <Button onClick={handleShorten} disabled={!url || isLoading} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold">
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Shortening...</span>
                      </div>
                    ) : (
                      "Shorten URL"
                    )}
                  </Button>
                </div>
                {shortUrl && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">Your shortened URL:</p>
                        <p className="text-lg font-mono text-green-800 dark:text-green-200 truncate">{shortUrl}</p>
                      </div>
                      <Button onClick={handleCopy} variant="outline" size="sm" className="ml-3 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}{" "}
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        {/* Quick Stats */}
        <FadeInView delay={0.4}>
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Links Shortened</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">Fast</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">& Reliable</div>{" "}
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
