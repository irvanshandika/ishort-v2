"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { FadeInView } from "@/src/components/FadeInView";
import { Copy, Check, Link2, Zap, Sparkles, TrendingUp, Shield, Globe, Star } from "lucide-react";

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, 
            rgb(239, 246, 255) 0%, 
            rgb(255, 255, 255) 25%, 
            rgb(249, 250, 251) 50%, 
            rgb(243, 244, 246) 75%, 
            rgb(229, 231, 235) 100%
          )
        `,
      }}>
      {/* Dark mode background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-0 dark:opacity-100 transition-opacity duration-500" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 dark:bg-pink-400/20 rounded-full blur-xl animate-pulse delay-500" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-green-500/10 dark:bg-green-400/20 rounded-full blur-lg animate-pulse delay-300" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:100px_100px] dark:bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <div className="text-center space-y-12">
          {/* Header section with enhanced visual appeal */}
          <FadeInView>
            <div className="space-y-8">
              {/* New feature badge */}
              <div className="flex justify-center">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-4 h-4 mr-2" />✨ New: Advanced Analytics Dashboard
                </Badge>
              </div>

              {/* Brand logo and title */}
              <div className="space-y-6">
                <div className="flex justify-center items-center space-x-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                      <Link2 className="h-10 w-10 text-white" />
                      <Zap className="h-6 w-6 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                    <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">i</span>
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Short</span>
                  </h1>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                    Transform Long URLs Into
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Powerful Short Links</span>
                  </h2>

                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">Create, customize, and track your links with advanced analytics. The most powerful URL shortener for modern teams.</p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* Enhanced URL Shortener Form */}
          <FadeInView delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                <CardContent className="p-8 md:p-12">
                  <div className="space-y-8">
                    {/* Input section with modern styling */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Shorten Your URL</h3>
                        <p className="text-gray-600 dark:text-gray-400">Paste your long URL below and get a shortened link instantly</p>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
                          <Input
                            type="url"
                            placeholder="https://your-very-long-url-here.com/with/many/parameters"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="relative h-14 text-lg bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm transition-all duration-300 px-6"
                          />
                        </div>
                        <Button
                          onClick={handleShorten}
                          disabled={!url || isLoading}
                          className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                          {isLoading ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Creating magic...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Zap className="w-5 h-5" />
                              <span>Shorten URL</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced result display */}
                    {shortUrl && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <p className="text-sm font-medium text-green-700 dark:text-green-300">Your shortened URL is ready!</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                              <p className="text-lg font-mono text-green-800 dark:text-green-200 break-all">{shortUrl}</p>
                            </div>
                          </div>
                          <Button
                            onClick={handleCopy}
                            variant="outline"
                            size="lg"
                            className="ml-4 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 transition-all duration-300">
                            {copied ? (
                              <div className="flex items-center space-x-2">
                                <Check className="h-5 w-5" />
                                <span>Copied!</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Copy className="h-5 w-5" />
                                <span>Copy</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeInView>

          {/* Enhanced stats section with icons */}
          <FadeInView delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: TrendingUp, number: "1M+", label: "Links Shortened", color: "from-blue-600 to-blue-400" },
                { icon: Shield, number: "99.9%", label: "Uptime Guarantee", color: "from-purple-600 to-purple-400" },
                { icon: Globe, number: "195", label: "Countries Served", color: "from-green-600 to-green-400" },
                { icon: Star, number: "4.9★", label: "User Rating", color: "from-yellow-600 to-yellow-400" },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      <div className={`mx-auto w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>{stat.number}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </FadeInView>

          {/* Trust indicators */}
          <FadeInView delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">No registration required</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300" />
                <span className="text-sm font-medium">Free forever plan</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-500" />
                <span className="text-sm font-medium">Enterprise ready</span>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
