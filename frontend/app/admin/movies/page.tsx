"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { Movie } from "@/lib/types";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function MovieRow({ movie, onUpdate, onDelete }: { movie: Movie; onUpdate: (movieId: number, event: FormEvent<HTMLFormElement>) => Promise<void>; onDelete: (movieId: number) => Promise<void> }) {
  return (
    <details className="rounded-lg border border-white/10 bg-white/5 p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold">
        {movie.title} ({movie.year}) | id: {movie.id}
      </summary>
      <form onSubmit={(event) => void onUpdate(movie.id, event)} className="mt-4 grid gap-2">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input name="title" defaultValue={movie.title} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="year" defaultValue={movie.year} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="genre" defaultValue={movie.genre} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="trailerUrl" defaultValue={movie.trailerUrl || ""} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" />
          <input name="posterFile" type="file" accept="image/*" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" />
          <textarea name="description" defaultValue={movie.description} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" rows={4} required />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold">
            Update Movie
          </button>
          <button type="button" onClick={() => void onDelete(movie.id)} className="rounded-md border border-red-400/50 px-3 py-1.5 text-sm text-red-300">
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
  const [submitting, setSubmitting] = useState(false);

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

  const onCreateMovie = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const result = await createMovie({
      title: String(formData.get("title") || ""),
      year: String(formData.get("year") || ""),
      genre: String(formData.get("genre") || ""),
      description: String(formData.get("description") || ""),
      trailerUrl: String(formData.get("trailerUrl") || ""),
      posterFile: (formData.get("posterFile") as File) || null,
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot create movie." });
      setSubmitting(false);
      return;
    }

    event.currentTarget.reset();
    setMessage({ type: "success", text: "Movie created." });
    setSubmitting(false);
  };

  const onUpdateMovie = async (movieId: number, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await updateMovie(movieId, {
      title: String(formData.get("title") || ""),
      year: String(formData.get("year") || ""),
      genre: String(formData.get("genre") || ""),
      description: String(formData.get("description") || ""),
      trailerUrl: String(formData.get("trailerUrl") || ""),
      posterFile: (formData.get("posterFile") as File) || null,
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot update movie." });
      return;
    }
    setMessage({ type: "success", text: "Movie updated." });
  };

  const onDeleteMovie = async (movieId: number) => {
    const result = await deleteMovie(movieId);
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
        <p className="text-sm text-gray-400">Create, update and delete anime from backend API.</p>
      </div>

      <form onSubmit={(event) => void onCreateMovie(event)} className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Create Movie</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input name="title" placeholder="Title" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="year" placeholder="Year" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="genre" placeholder="Genre (comma separated)" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="trailerUrl" placeholder="Trailer URL" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" />
          <input name="posterFile" type="file" accept="image/*" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" />
          <textarea name="description" placeholder="Description" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-3" rows={4} required />
        </div>
        <button type="submit" disabled={submitting} className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold disabled:opacity-70">
          {submitting ? "Adding..." : "Add Movie"}
        </button>
      </form>

      {message ? <p className={message.type === "error" ? "text-sm text-red-300" : "text-sm text-green-300"}>{message.text}</p> : null}

      <div className="space-y-3">
        {movies.map((movie) => (
          <MovieRow key={movie.id} movie={movie} onUpdate={onUpdateMovie} onDelete={onDeleteMovie} />
        ))}
      </div>
    </div>
  );
}
