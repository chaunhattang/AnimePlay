"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Movie } from "@/lib/types";
import RatingStars from "@/components/RatingStars";
import WatchlistButton from "@/components/WatchlistButton";
import { useAppContext } from "@/components/AppProvider";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const { getMovieAverageRating } = useAppContext();
  const displayRating = getMovieAverageRating(movie.id);

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[2/3]">
          <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
        </div>
      </Link>
      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/movies/${movie.id}`} className="line-clamp-1 text-base font-semibold hover:underline">
              {movie.title}
            </Link>
            <p className="text-xs text-gray-400">{movie.genres.join(" | ")}</p>
          </div>
          <RatingStars rating={displayRating} />
        </div>
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1 text-xs text-gray-300">
            <Clock3 className="h-3 w-3" />
            {movie.year} | {movie.duration}
          </p>
          <WatchlistButton movieId={movie.id} />
        </div>
      </div>
    </article>
  );
}
