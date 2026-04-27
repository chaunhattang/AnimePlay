"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Movie } from "@/lib/types";
import WatchlistButton from "@/components/WatchlistButton";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl =
    movie.posterUrl || "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg";

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[2/3]">
          <Image src={posterUrl} alt={movie.title} fill className="object-cover" />
        </div>
      </Link>
      <div className="space-y-3 p-3">
        <div>
          <Link href={`/movies/${movie.id}`} className="line-clamp-1 text-base font-semibold hover:underline">
            {movie.title}
          </Link>
          <p className="text-xs text-gray-400">{movie.genre}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1 text-xs text-gray-300">
            <Clock3 className="h-3 w-3" />
            {movie.year}
          </p>
          <WatchlistButton movieId={movie.id} />
        </div>
      </div>
    </article>
  );
}
