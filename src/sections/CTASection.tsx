import { Button } from "@/src/components/ui/button";
import { ArrowRight, Link2, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Link2 className="h-10 w-10 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Shorten Your
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">First URL?</span>
        </h2>

        {/* Description */}
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">Join millions of users who trust iShort for their URL shortening needs. Start creating short, powerful links in seconds - no registration required.</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6 h-auto group">
            Start Shortening Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 h-auto backdrop-blur-sm">
            View Pricing Plans
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-sm">No credit card required</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-blue-300/50" />
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-sm">Free forever plan available</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-blue-300/50" />
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-sm">Setup in under 30 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
