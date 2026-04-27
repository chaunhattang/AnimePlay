"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, PlayCircle, Tags } from "lucide-react";
import MovieGrid from "@/components/MovieGrid";
import WatchlistButton from "@/components/WatchlistButton";
import { useAppContext } from "@/components/AppProvider";
import { getRelatedMovies } from "@/lib/movie-utils";

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const movieId = Number(params.id);
  const { movies } = useAppContext();

  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    return (
      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-2xl font-bold">Movie Not Found</h1>
        <p className="text-sm text-gray-400">The requested movie does not exist.</p>
        <Link href="/movies" className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          Back to Browse
        </Link>
      </div>
    );
  }

  const related = getRelatedMovies(movies, movie.id);
  const posterUrl =
    movie.posterUrl || "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg";

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="relative aspect-[2/3]">
            <Image src={posterUrl} alt={movie.title} fill className="object-cover" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {movie.year}
              </span>
              <span className="inline-flex items-center gap-1">
                <Tags className="h-4 w-4" />
                {movie.genre}
              </span>
            </div>
          </div>

          <p className="text-gray-200">{movie.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            {movie.trailerUrl ? (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-100"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Watch Trailer</span>
              </a>
            ) : null}
            <WatchlistButton movieId={movie.id} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Related Movies</h2>
        <MovieGrid movies={related} />
      </section>
    </div>
  );
}
