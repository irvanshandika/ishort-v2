"use client";
import React, { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface SidebarSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SidebarSearch({ placeholder = "Search URLs...", onSearch }: SidebarSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
      />
      {query && (
        <Button variant="ghost" size="sm" onClick={clearSearch} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700">
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
