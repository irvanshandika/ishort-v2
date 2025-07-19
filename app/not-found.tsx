"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-800 select-none">404</h1>

            {/* Floating Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Search Icon */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-bounce">
                  <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Question Mark */}
                <div className="absolute -top-4 -right-12 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">?</span>
                </div>

                {/* Dots */}
                <div className="absolute -bottom-6 left-4 w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -right-6 w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>{" "}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <Button asChild className="w-full md:w-auto">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home size={18} />
              Back to Home
            </Link>
          </Button>

          <Button variant="outline" onClick={() => window.history.back()} className="w-full md:w-auto">
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Need help? Here are some helpful links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Contact
            </Link>
            <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
