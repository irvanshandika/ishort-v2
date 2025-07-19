import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Check, Star, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for personal use and small projects",
    features: ["50 links per month", "Basic analytics", "Custom back-half", "QR codes", "Standard support"],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "9",
    period: "month",
    description: "Ideal for professionals and small businesses",
    features: ["1,000 links per month", "Advanced analytics", "Custom domains", "Password protection", "Team collaboration (5 members)", "Priority support", "API access"],
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "29",
    period: "month",
    description: "Built for growing teams and enterprises",
    features: ["10,000 links per month", "Premium analytics & reporting", "Multiple custom domains", "Advanced security features", "Team collaboration (unlimited)", "Dedicated support", "Full API access", "White-label options"],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Choose the perfect plan for your needs. Start free and upgrade as you grow. No hidden fees, cancel anytime.</p>
        </div>{" "}
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                plan.popular ? "border-blue-500 dark:border-blue-400 shadow-lg scale-105" : "border-gray-200 dark:border-gray-700"
              } bg-white dark:bg-gray-800`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-4">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button variant={plan.buttonVariant} className={`w-full h-12 text-lg font-semibold ${plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}>
                  {plan.buttonText}
                  {plan.popular && <Zap className="ml-2 h-5 w-5" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need a Custom Solution?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">We offer enterprise solutions with custom features, dedicated infrastructure, and personalized support for large organizations.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                or call us at <span className="font-semibold">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
