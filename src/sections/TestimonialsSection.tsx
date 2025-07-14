import { Card, CardContent } from "@/src/components/ui/card";
import { FadeInView } from "@/src/components/FadeInView";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content: "iShort has revolutionized how we share links across our marketing campaigns. The analytics are incredibly detailed and help us optimize our strategies.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9c9e57c?w=64&h=64&fit=crop&crop=face",
  },
  {
    name: "Mike Chen",
    role: "Social Media Manager",
    company: "StartupXYZ",
    content: "Clean, fast, and reliable. The custom domains feature has helped us maintain our brand consistency across all platforms.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    company: "Creative Agency",
    content: "The QR code generation is a game-changer for our print materials. Super easy to use and the links never break.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInView>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Join thousands of satisfied users who trust iShort for their URL shortening needs.</p>
          </div>
        </FadeInView>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeInView key={index} delay={index * 0.2}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>

                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <Image src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" width={0} height={0} />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeInView delay={0.6}>
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 rounded-full px-6 py-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">4.9/5 rating from 10,000+ reviews</span>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
