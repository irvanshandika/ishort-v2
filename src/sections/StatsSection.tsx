"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { TrendingUp, Users, Globe, Zap } from "lucide-react";

const stats = [
  {
    id: "links",
    icon: Zap,
    label: "Links Shortened",
    value: 1250000,
    suffix: "+",
    description: "URLs processed successfully",
  },
  {
    id: "clicks",
    icon: TrendingUp,
    label: "Total Clicks",
    value: 8750000,
    suffix: "+",
    description: "Redirects handled globally",
  },
  {
    id: "users",
    icon: Users,
    label: "Active Users",
    value: 125000,
    suffix: "+",
    description: "Trusted by individuals & businesses",
  },
  {
    id: "countries",
    icon: Globe,
    label: "Countries Served",
    value: 195,
    suffix: "",
    description: "Worldwide availability",
  },
];

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("stats-section");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Trusted by Millions</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">Join millions of users who trust iShort for their URL shortening needs. Our platform handles billions of clicks every month.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.id} className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  <div className="text-4xl font-bold text-white mb-2">
                    {isVisible ? (
                      <>
                        <AnimatedCounter value={stat.value} duration={2000 + index * 200} />
                        {stat.suffix}
                      </>
                    ) : (
                      "0"
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>

                  <p className="text-blue-100 text-sm">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white font-medium">Real-time statistics updated every minute</span>
          </div>
        </div>
      </div>
    </section>
  );
}
