"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Home, ArrowLeft, Zap, Star } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
};

export default function AnimatedNotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-pulse ${
              i % 4 === 0 ? "bg-blue-400 dark:bg-blue-500" : i % 4 === 1 ? "bg-purple-400 dark:bg-purple-500" : i % 4 === 2 ? "bg-pink-400 dark:bg-pink-500" : "bg-green-400 dark:bg-green-500"
            }`}
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.01}px, ${(mousePos.y - window.innerHeight / 2) * 0.01}px)`,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.02}px, ${(mousePos.y - window.innerHeight / 2) * 0.02}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 dark:from-pink-500/10 dark:to-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${(mousePos.x - window.innerWidth / 2) * -0.015}px, ${(mousePos.y - window.innerHeight / 2) * -0.015}px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          {/* Animated 404 */}
          <div className="mb-12">
            <div className="relative inline-block">
              {/* Glitch Effect 404 */}
              <div className="relative">
                <h1 className="text-8xl md:text-9xl lg:text-[14rem] font-black text-gray-200 dark:text-gray-800 select-none animate-pulse">404</h1>

                {/* Glitch Layers */}
                <h1 className="absolute inset-0 text-8xl md:text-9xl lg:text-[14rem] font-black text-blue-500 dark:text-blue-400 select-none animate-pulse opacity-70 transform translate-x-1 -translate-y-1">404</h1>
                <h1 className="absolute inset-0 text-8xl md:text-9xl lg:text-[14rem] font-black text-pink-500 dark:text-pink-400 select-none animate-pulse opacity-70 transform -translate-x-1 translate-y-1 delay-150">404</h1>
              </div>

              {/* Floating Icons */}
              <div className="absolute -top-8 -left-8 animate-bounce">
                <div className="w-16 h-16 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 animate-bounce delay-300">
                <div className="w-12 h-12 bg-purple-400 dark:bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="absolute -bottom-8 left-4 animate-bounce delay-500">
                <div className="w-10 h-10 bg-green-400 dark:bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-12 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white animate-fade-in">Lost in Cyberspace</h2>{" "}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in delay-200">
              The page you&apos;re seeking has drifted into the digital dimension.
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 font-semibold">Let&apos;s navigate you back to familiar territory.</span>
            </p>
          </div>

          {/* Interactive Buttons */}
          <div className="mb-16 animate-fade-in delay-500">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Link href="/" className="flex items-center gap-3">
                  <Home size={24} />
                  Return Home
                </Link>
              </Button>

              <Button variant="outline" size="lg" onClick={() => window.history.back()} className="w-full sm:w-auto px-8 py-4 text-lg border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-300">
                <ArrowLeft size={24} className="mr-3" />
                Go Back
              </Button>
            </div>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in delay-700">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Possibilities</div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-purple-500 dark:text-purple-400 mb-2">404</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Error Code</div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-pink-500 dark:text-pink-400 mb-2">1</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Way Back</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center animate-fade-in delay-1000">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 font-semibold">iShort</span> • URL Shortener Platform
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
