"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Clock3, Globe2, PlayCircle, User2 } from "lucide-react";
import MovieGrid from "@/components/MovieGrid";
import RatingStars from "@/components/RatingStars";
import WatchlistButton from "@/components/WatchlistButton";
import MovieReviews from "@/components/MovieReviews";
import { useAppContext } from "@/components/AppProvider";
import { getRelatedMovies } from "@/lib/movie-utils";

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const movieId = params.id;
  const { movies, getMovieAverageRating, getMovieReviews } = useAppContext();

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
  const avgRating = getMovieAverageRating(movie.id);
  const reviewCount = getMovieReviews(movie.id).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="relative aspect-[2/3]">
            <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
              <RatingStars rating={avgRating} />
              <span>{reviewCount} reviews</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {movie.year}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" />
                {movie.duration}
              </span>
              <span>{movie.votes} votes</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <Link
                key={genre}
                href={`/movies?genre=${encodeURIComponent(genre)}`}
                className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-gray-200 hover:bg-white/10"
              >
                {genre}
              </Link>
            ))}
          </div>

          <p className="text-gray-200">{movie.storyline}</p>

          <div className="grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
            <p className="inline-flex items-center gap-2">
              <User2 className="h-4 w-4 text-gray-400" />
              Director: {movie.director}
            </p>
            <p className="inline-flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-gray-400" />
              {movie.language} | {movie.country}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Watch Trailer</span>
            </a>
            <WatchlistButton movieId={movie.id} />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Cast</h2>
        <div className="flex flex-wrap gap-2">
          {movie.cast.map((member) => (
            <span key={member} className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-gray-200">
              {member}
            </span>
          ))}
        </div>
      </section>

      <MovieReviews movieId={movie.id} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Related Movies</h2>
        <MovieGrid movies={related} />
      </section>
    </div>
  );
}
