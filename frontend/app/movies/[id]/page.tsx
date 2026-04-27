"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, PlayCircle, Tags, ArrowLeft, Film } from "lucide-react";
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
      <div className="animate-fade-in-up mx-auto max-w-lg space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <Film className="h-8 w-8 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-white">Movie Not Found</h1>
        <p className="text-sm text-gray-400">The requested movie does not exist in our catalog.</p>
        <Link href="/movies" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </div>
    );
  }

  const related = getRelatedMovies(movies, movie.id);
  const posterUrl = movie.posterUrl || "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg";

  return (
    <div className="animate-fade-in-up space-y-10">
      {/* Movie Details */}
      <section className="grid gap-8 md:grid-cols-[320px_1fr]">
        {/* Poster */}
        <div className="animate-scale-in overflow-hidden rounded-2xl border border-white/10 shadow-card">
          <div className="relative aspect-[2/3]">
            <Image src={posterUrl} alt={movie.title} fill className="object-cover" priority />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-5">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-gray-300 backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-brand-500" />
                {movie.year}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-gray-300 backdrop-blur-sm">
                <Tags className="h-4 w-4 text-brand-500" />
                {movie.genre}
              </span>
            </div>
          </div>

          <p className="max-w-xl leading-relaxed text-gray-300">{movie.description}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {movie.trailerUrl ? (
              <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100">
                <PlayCircle className="h-4 w-4" />
                <span>Watch Trailer</span>
              </a>
            ) : null}
            <WatchlistButton movieId={movie.id} />
          </div>
        </div>
      </section>

      {/* Related Movies */}
      {related.length > 0 && (
        <section className="animate-fade-in space-y-5" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-brand-500" />
            <h2 className="text-xl font-semibold text-white">Related Movies</h2>
          </div>
          <MovieGrid movies={related} />
        </section>
      )}
    </div>
  );
}
