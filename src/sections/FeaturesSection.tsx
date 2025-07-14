import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FadeInView } from "@/src/components/FadeInView";
import { Zap, Shield, BarChart3, Smartphone, Globe, Clock, QrCode, Users, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Shorten URLs in milliseconds with our optimized infrastructure",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Advanced security measures to protect your links and data",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Detailed click analytics and insights for your shortened URLs",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Fully responsive design that works perfectly on all devices",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Worldwide content delivery for maximum speed and reliability",
  },
  {
    icon: Clock,
    title: "99.9% Uptime",
    description: "Reliable service with minimal downtime guarantee",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Generate QR codes for your shortened URLs instantly",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share and manage links with your team members",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description: "Add password protection to your sensitive links",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose iShort?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Discover the powerful features that make iShort the best URL shortening service for individuals and businesses alike.</p>
        </div>{" "}
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <FadeInView key={index} delay={index * 0.1}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </FadeInView>
            );
          })}
        </div>
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium">
            <span>Ready to get started?</span>
            <Zap className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
