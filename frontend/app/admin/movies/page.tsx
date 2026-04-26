"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { Movie } from "@/lib/types";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function MovieRow({
  movie,
  onUpdate,
  onDelete
}: {
  movie: Movie;
  onUpdate: (movieId: string, event: FormEvent<HTMLFormElement>) => void;
  onDelete: (movieId: string) => void;
}) {
  return (
    <details className="rounded-lg border border-white/10 bg-white/5 p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold">
        {movie.title} ({movie.year}) | id: {movie.id}
      </summary>
      <form onSubmit={(event) => onUpdate(movie.id, event)} className="mt-4 grid gap-2">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input name="title" defaultValue={movie.title} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="year" type="number" defaultValue={movie.year} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="duration" defaultValue={movie.duration} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input
            name="rating"
            type="number"
            min={0}
            max={10}
            step={0.1}
            defaultValue={movie.rating}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
            required
          />
          <input name="votes" defaultValue={movie.votes} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <select name="badge" defaultValue={movie.badge || ""} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm">
            <option value="">No Badge</option>
            <option value="Now Playing">Now Playing</option>
            <option value="Top Rated">Top Rated</option>
            <option value="Trending">Trending</option>
          </select>
          <input name="language" defaultValue={movie.language} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="country" defaultValue={movie.country} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="director" defaultValue={movie.director} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input
            name="trailerYoutubeId"
            defaultValue={movie.trailerYoutubeId}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3"
            required
          />
          <input
            name="poster"
            defaultValue={movie.poster}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3"
            required
          />
          <input
            name="backdrop"
            defaultValue={movie.backdrop}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3"
            required
          />
          <input
            name="genres"
            defaultValue={movie.genres.join(", ")}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3"
            required
          />
          <input
            name="cast"
            defaultValue={movie.cast.join(", ")}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3"
            required
          />
          <textarea
            name="storyline"
            defaultValue={movie.storyline}
            className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3"
            rows={4}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold">
            Update Movie
          </button>
          <button
            type="button"
            onClick={() => onDelete(movie.id)}
            className="rounded-md border border-red-400/50 px-3 py-1.5 text-sm text-red-300"
          >
            Delete Movie
          </button>
        </div>
      </form>
    </details>
  );
}

export default function AdminMoviesPage() {
  const { currentUser, isAdmin, movies, createMovie, updateMovie, deleteMovie } = useAppContext();
  const [message, setMessage] = useState<MessageState>(null);

  if (!currentUser) {
    return (
      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Admin Movies</h1>
        <p className="text-sm text-gray-300">Please login with admin account.</p>
        <Link href="/login" className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-300">Only admin can manage movies.</p>
      </div>
    );
  }

  const onCreateMovie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const badgeValue = String(formData.get("badge") || "").trim();

    const result = createMovie({
      id: String(formData.get("id") || "").trim() || undefined,
      title: String(formData.get("title") || ""),
      year: Number(formData.get("year") || 0),
      duration: String(formData.get("duration") || ""),
      rating: Number(formData.get("rating") || 0),
      votes: String(formData.get("votes") || ""),
      genres: parseList(String(formData.get("genres") || "")),
      language: String(formData.get("language") || ""),
      country: String(formData.get("country") || ""),
      storyline: String(formData.get("storyline") || ""),
      cast: parseList(String(formData.get("cast") || "")),
      director: String(formData.get("director") || ""),
      trailerYoutubeId: String(formData.get("trailerYoutubeId") || ""),
      poster: String(formData.get("poster") || ""),
      backdrop: String(formData.get("backdrop") || ""),
      badge: badgeValue ? (badgeValue as "Now Playing" | "Top Rated" | "Trending") : undefined
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot create movie." });
      return;
    }

    event.currentTarget.reset();
    setMessage({ type: "success", text: "Movie created." });
  };

  const onUpdateMovie = (movieId: string, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const badgeValue = String(formData.get("badge") || "").trim();

    const result = updateMovie(movieId, {
      title: String(formData.get("title") || ""),
      year: Number(formData.get("year") || 0),
      duration: String(formData.get("duration") || ""),
      rating: Number(formData.get("rating") || 0),
      votes: String(formData.get("votes") || ""),
      genres: parseList(String(formData.get("genres") || "")),
      language: String(formData.get("language") || ""),
      country: String(formData.get("country") || ""),
      storyline: String(formData.get("storyline") || ""),
      cast: parseList(String(formData.get("cast") || "")),
      director: String(formData.get("director") || ""),
      trailerYoutubeId: String(formData.get("trailerYoutubeId") || ""),
      poster: String(formData.get("poster") || ""),
      backdrop: String(formData.get("backdrop") || ""),
      badge: badgeValue ? (badgeValue as "Now Playing" | "Top Rated" | "Trending") : undefined
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot update movie." });
      return;
    }
    setMessage({ type: "success", text: "Movie updated." });
  };

  const onDeleteMovie = (movieId: string) => {
    const result = deleteMovie(movieId);
    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot delete movie." });
      return;
    }
    setMessage({ type: "success", text: "Movie deleted." });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Admin - Movie Management</h1>
        <p className="text-sm text-gray-400">Create, update and delete full movie data.</p>
      </div>

      <form onSubmit={onCreateMovie} className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Create Movie</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input name="id" placeholder="Movie id (optional, auto-generated)" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" />
          <input name="title" placeholder="Title" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="year" type="number" placeholder="Year" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="duration" placeholder="Duration (e.g. 2h 10m)" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="rating" type="number" min={0} max={10} step={0.1} placeholder="Rating" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="votes" placeholder="Votes (e.g. 200K)" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <select name="badge" defaultValue="" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm">
            <option value="">No Badge</option>
            <option value="Now Playing">Now Playing</option>
            <option value="Top Rated">Top Rated</option>
            <option value="Trending">Trending</option>
          </select>
          <input name="language" placeholder="Language" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="country" placeholder="Country" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="director" placeholder="Director" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="trailerYoutubeId" placeholder="YouTube trailer id" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" required />
          <input name="poster" placeholder="Poster URL" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" required />
          <input name="backdrop" placeholder="Backdrop URL" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" required />
          <input name="genres" placeholder="Genres comma-separated" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" required />
          <input name="cast" placeholder="Cast comma-separated" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" required />
          <textarea name="storyline" placeholder="Storyline" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" rows={4} required />
        </div>
        <button type="submit" className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold">
          Add Movie
        </button>
      </form>

      {message ? (
        <p className={message.type === "error" ? "text-sm text-red-300" : "text-sm text-green-300"}>{message.text}</p>
      ) : null}

      <div className="space-y-3">
        {movies.map((movie) => (
          <MovieRow key={movie.id} movie={movie} onUpdate={onUpdateMovie} onDelete={onDeleteMovie} />
        ))}
      </div>
    </div>
  );
}
