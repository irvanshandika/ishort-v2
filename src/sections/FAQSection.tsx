"use client";

import { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { FadeInView } from "@/src/components/FadeInView";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does iShort work?",
    answer: "iShort takes your long URLs and creates short, easy-to-share links that redirect to your original URL. Simply paste your long URL into our shortener, and we'll generate a short link instantly.",
  },
  {
    question: "Are the shortened links permanent?",
    answer: "Yes! All shortened links are permanent and will continue to work indefinitely. We maintain high-availability servers to ensure your links are always accessible.",
  },
  {
    question: "Can I customize my shortened URLs?",
    answer: "Absolutely! Pro and Business users can create custom back-halves for their URLs (e.g., ishort.ly/my-custom-link) and use their own custom domains.",
  },
  {
    question: "Is there a limit to how many URLs I can shorten?",
    answer: "Free users can shorten up to 50 URLs per month. Pro users get 1,000 URLs per month, and Business users get 10,000 URLs per month. Contact us for higher limits.",
  },
  {
    question: "What analytics do you provide?",
    answer: "We provide comprehensive analytics including click counts, geographic data, device information, referrer data, and time-based analytics. Pro and Business users get even more detailed insights.",
  },
  {
    question: "Can I use iShort for commercial purposes?",
    answer: "Yes! iShort is perfect for businesses, marketers, and organizations. Our Pro and Business plans include features specifically designed for commercial use.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use enterprise-grade encryption, secure servers, and follow industry best practices to protect your data and links.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInView>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to know about iShort</p>
          </div>
        </FadeInView>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeInView key={index} delay={index * 0.1}>
              <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <button onClick={() => toggleFAQ(index)} className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                    {openIndex === index ? <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />}
                  </button>

                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeInView>
          ))}
        </div>

        {/* Contact CTA */}
        <FadeInView delay={0.8}>
          <div className="text-center mt-16">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still have questions?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Our support team is here to help you get the most out of iShort.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@ishort.ly" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  Contact Support
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
