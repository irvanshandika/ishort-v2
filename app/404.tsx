"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Home, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function Custom404() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          {/* Animated 404 Section */}
          <div className="mb-12">
            <div className="relative inline-block">
              {/* Main 404 Text */}
              <div className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-300 dark:via-purple-400 dark:to-pink-400 select-none">
                404
              </div>

              {/* Floating Error Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-bounce delay-75"></div>
              <div className="absolute -top-8 -right-8 w-6 h-6 bg-green-400 dark:bg-green-500 rounded-full animate-bounce delay-150"></div>
              <div className="absolute -bottom-4 left-8 w-4 h-4 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-8 -right-4 w-5 h-5 bg-purple-400 dark:bg-purple-500 rounded-full animate-bounce delay-500"></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Oops! Page Not Found</h1>
            <div className="max-w-lg mx-auto space-y-4">
              {" "}
              <p className="text-xl text-gray-600 dark:text-gray-300">The page you&apos;re looking for seems to have vanished into the digital void.</p>
              <p className="text-lg text-gray-500 dark:text-gray-400">Don&apos;t worry, it happens to the best of us. Let&apos;s get you back on track.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto px-8">
                <Link href="/" className="flex items-center gap-2">
                  <Home size={20} />
                  Go Home
                </Link>
              </Button>

              <Button variant="outline" size="lg" onClick={() => window.history.back()} className="w-full sm:w-auto px-8">
                <ArrowLeft size={20} className="mr-2" />
                Go Back
              </Button>

              <Button variant="ghost" size="lg" onClick={handleRefresh} className="w-full sm:w-auto px-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maybe you were looking for:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/" className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-center">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏠</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Home</div>
              </Link>

              <Link href="/auth/signin" className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-center">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔐</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Sign In</div>
              </Link>

              <Link href="/auth/signup" className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-center">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Sign Up</div>
              </Link>

              <Link href="/contact" className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-center">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📞</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Contact</div>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Error Code: 404 | Page Not Found |
              <Link href="/" className="ml-1 text-blue-600 dark:text-blue-400 hover:underline">
                iShort URL Shortener
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
