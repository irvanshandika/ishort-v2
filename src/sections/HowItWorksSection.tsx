import { Card, CardContent } from "@/src/components/ui/card";
import { Link, Scissors, Share2, BarChart3 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Link,
    title: "Paste Your URL",
    description: "Simply paste your long URL into our shortening tool. We support any valid web link.",
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    icon: Scissors,
    title: "Get Short Link",
    description: "Our system instantly generates a unique, short link that redirects to your original URL.",
    color: "from-purple-500 to-purple-600",
  },
  {
    step: "03",
    icon: Share2,
    title: "Share Everywhere",
    description: "Copy and share your shortened link anywhere - social media, emails, messages, or print.",
    color: "from-green-500 to-green-600",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Track Performance",
    description: "Monitor clicks, geographic data, and engagement metrics with our built-in analytics.",
    color: "from-orange-500 to-orange-600",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Get started with iShort in just a few simple steps. No registration required for basic URL shortening.</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 transform -translate-x-4 z-0" />}

                <Card className="relative z-10 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    {/* Step Number */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-lg mb-4`}>{step.step}</div>

                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average processing time: &lt;100ms</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">99.9% uptime guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
