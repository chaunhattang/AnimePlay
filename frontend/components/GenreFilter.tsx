"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type GenreFilterProps = {
  genres: string[];
};

export default function GenreFilter({ genres }: GenreFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeGenre = searchParams.get("genre") || "All";
  const activeSort = searchParams.get("sort") || "popular";

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

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={activeGenre}
        onChange={(event) => onGenreChange(event.target.value)}
        className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
      >
        <option value="All">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <select
        value={activeSort}
        onChange={(event) => onSortChange(event.target.value)}
        className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
      >
        <option value="popular">Most Popular</option>
        <option value="rating">Top Rated</option>
        <option value="latest">Latest</option>
      </select>
    </div>
  );
}
