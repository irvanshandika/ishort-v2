"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Link2, Menu, X } from "lucide-react";
import DropdownMenuList from "./DropdownMenuList";

const navigation = [
  { name: "Home", href: "#", sectionId: "hero" },
  { name: "Features", href: "#features", sectionId: "features" },
  { name: "How It Works", href: "#how-it-works", sectionId: "how-it-works" },
  { name: "Pricing", href: "#pricing", sectionId: "pricing" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const pathname = usePathname();

  // Scroll spy to detect active section
  useEffect(() => {
    // Only run on homepage
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = navigation.map((item) => item.sectionId);

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Handle hero section (special case since it might not have exact id)
    const heroElement = document.querySelector("section:first-of-type");
    if (heroElement && !heroElement.id) {
      heroElement.id = "hero";
      observer.observe(heroElement);
    }

    return () => observer.disconnect();
  }, [pathname]);

  // Smooth scroll to section
  const scrollToSection = (href: string, sectionId: string) => {
    setIsMenuOpen(false);

    if (pathname !== "/") {
      // If not on homepage, navigate to homepage with hash
      window.location.href = `/${href}`;
      return;
    }

    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Account for fixed navbar
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  // Check if link is active
  const isActiveLink = (sectionId: string) => {
    if (pathname !== "/") return false;
    return activeSection === sectionId;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">iShort</span>
          </div>{" "}
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href, item.sectionId)}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActiveLink(item.sectionId) ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  }`}>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenuList />
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <DropdownMenuList />

            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-300" aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>{" "}
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href, item.sectionId)}
                className={`w-full text-left block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                  isActiveLink(item.sectionId) ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
