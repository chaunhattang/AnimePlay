"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import clsx from "clsx";

type GenreFilterProps = {
  genres: string[];
};

export default function GenreFilter({ genres }: GenreFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeGenre = searchParams.get("genre") || "All";
  const activeSort = searchParams.get("sort") || "latest";

  const onGenreChange = (genre: string) => {
    const params = new URLSearchParams(searchParams);
    if (genre === "All") {
      params.delete("genre");
    } else {
      params.set("genre", genre);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const onSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const selectClasses = "rounded-xl border border-white/15 bg-black/40 px-4 py-3 pl-10 text-sm text-white outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 hover:border-white/25 appearance-none cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Genre Select */}
      <div className="relative">
        <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <select value={activeGenre} onChange={(event) => onGenreChange(event.target.value)} className={selectClasses}>
          <option value="All">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Select */}
      <div className="relative">
        <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <select value={activeSort} onChange={(event) => onSortChange(event.target.value)} className={selectClasses}>
          <option value="latest">Newest Year</option>
          <option value="oldest">Oldest Year</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
    </div>
  );
}
