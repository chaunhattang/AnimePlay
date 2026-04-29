"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const currentValue = searchParams.get("q") || "";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label className={`relative block transition-all duration-300 ${isFocused ? "scale-[1.01]" : ""}`}>
      <Search className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${isFocused ? "text-brand-500" : "text-gray-500"}`} />
      <input
        type="text"
        defaultValue={currentValue}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search anime title or description..."
        className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-11 pr-10 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-brand-500 focus:bg-black/20 focus:ring-2 focus:ring-brand-500/20 hover:border-white/25"
      />
      {currentValue && (
        <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      )}
    </label>
  );
}
