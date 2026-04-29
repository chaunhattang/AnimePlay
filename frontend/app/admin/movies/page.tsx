"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { Movie } from "@/lib/types";
import { Film, ShieldCheck, Plus, Save, Trash2, ChevronDown, Play, Image as ImageIcon, Link as LinkIcon, Calendar, Tag, FileText, AlertCircle } from "lucide-react";
import { getMediaUrl } from "@/lib/api-client";
import clsx from "clsx";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function MovieRow({ movie, onUpdate, onDelete }: { movie: Movie; onUpdate: (movieId: number, event: FormEvent<HTMLFormElement>) => Promise<void>; onDelete: (movieId: number) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const { episodes, createEpisode, deleteEpisode, updateEpisode } = useAppContext();

  const [epNumber, setEpNumber] = useState<number | "">();
  const [epVideoType, setEpVideoType] = useState<"LOCAL" | "YOUTUBE" | "WEBSITE">("LOCAL");
  const [epVideoUrl, setEpVideoUrl] = useState("");
  const [epFile, setEpFile] = useState<File | null>(null);
  const [epName, setEpName] = useState("");
  const [epLoading, setEpLoading] = useState(false);
  const [epMessage, setEpMessage] = useState<MessageState>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNumber, setEditNumber] = useState<number | "">("");
  const [editVideoType, setEditVideoType] = useState<"LOCAL" | "YOUTUBE" | "WEBSITE">("LOCAL");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState<MessageState>(null);

  const inputClasses = "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 hover:border-white/25";
  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-white/20">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Film className="h-4 w-4 text-brand-500" />
          <span className="text-sm font-semibold text-white">{movie.title}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">{movie.year}</span>
          <span className="text-xs text-gray-500">ID: {movie.id}</span>
        </div>
        <ChevronDown className={clsx("h-4 w-4 text-gray-500 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <div className={clsx("overflow-hidden transition-all duration-300 ease-in-out", open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0")}>
        <form onSubmit={(event) => void onUpdate(movie.id, event)} className="border-t border-white/10 px-5 pb-5 pt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Title */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Film className="h-3 w-3 text-brand-500" />
                  Title
                </span>
              </label>
              <input name="title" defaultValue={movie.title} className={inputClasses} required />
            </div>

            {/* Year */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-brand-500" />
                  Year
                </span>
              </label>
              <input name="year" defaultValue={movie.year} className={inputClasses} required />
            </div>

            {/* Genre */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-brand-500" />
                  Genre
                </span>
              </label>
              <input name="genre" defaultValue={movie.genre} className={inputClasses} required />
            </div>

            {/* Trailer URL */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3 text-brand-500" />
                  Trailer URL
                </span>
              </label>
              <input name="trailerUrl" defaultValue={movie.trailerUrl || ""} className={inputClasses} />
            </div>

            {/* Poster File */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <ImageIcon className="h-3 w-3 text-brand-500" />
                  Poster Image
                </span>
              </label>
              <input name="posterFile" type="file" accept="image/*" className={clsx(inputClasses, "py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-brand-500")} />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-brand-500" />
                  Description
                </span>
              </label>
              <textarea name="description" defaultValue={movie.description} className={inputClasses} rows={4} required />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="submit" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
              <Save className="h-4 w-4" />
              Update Movie
            </button>
            <button type="button" onClick={() => void onDelete(movie.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:border-red-400/50">
              <Trash2 className="h-4 w-4" />
              Delete Movie
            </button>
          </div>
        </form>
        <div className="border-t border-white/6 px-5 pb-5 pt-4">
          <h3 className="text-sm font-semibold text-white">Episodes</h3>
          <div className="mt-3 space-y-2">
            {episodes.filter((e) => e.animeId === movie.id).length === 0 ? (
              <div className="text-sm text-gray-400">No episodes yet.</div>
            ) : (
              episodes
                .filter((e) => e.animeId === movie.id)
                .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0))
                .map((ep) => (
                  <div key={ep.id} className="rounded-md bg-white/[0.02] p-2">
                    {editingId === ep.id ? (
                      <form
                        onSubmit={async (ev) => {
                          ev.preventDefault();
                          if (!editNumber || Number(editNumber) <= 0) {
                            setEditMessage({ type: "error", text: "Invalid episode number." });
                            return;
                          }
                          setEditLoading(true);
                          const res = await updateEpisode(ep.id, {
                            episodeNumber: Number(editNumber),
                            name: editName,
                            videoType: editVideoType,
                            videoUrl: editVideoType === "LOCAL" ? undefined : editVideoUrl,
                            file: editVideoType === "LOCAL" ? editFile : undefined,
                          });
                          if (!res.ok) setEditMessage({ type: "error", text: res.error || "Cannot update episode." });
                          else setEditMessage({ type: "success", text: "Episode updated." });
                          setEditLoading(false);
                          setEditingId(null);
                        }}
                        className="grid gap-2 sm:grid-cols-5"
                      >
                        <div className="text-sm text-gray-200">Ep</div>
                        <input value={editNumber as any} onChange={(ev) => setEditNumber(ev.target.value ? Number(ev.target.value) : "")} className={inputClasses} />
                        <input value={editName} onChange={(ev) => setEditName(ev.target.value)} placeholder="Episode name" className={inputClasses} />
                        <select value={editVideoType} onChange={(ev) => setEditVideoType(ev.target.value as any)} className={inputClasses}>
                          <option value="LOCAL">Local File</option>
                          <option value="YOUTUBE">YouTube</option>
                          <option value="WEBSITE">Website</option>
                        </select>
                        {editVideoType === "LOCAL" ? (
                          <input type="file" accept="video/*" onChange={(ev) => setEditFile(ev.target.files?.[0] || null)} className={inputClasses} />
                        ) : (
                          <input value={editVideoUrl} onChange={(ev) => setEditVideoUrl(ev.target.value)} placeholder="Video URL" className={inputClasses} />
                        )}

                        <div className="sm:col-span-4 mt-2 flex items-center gap-2">
                          <button type="submit" disabled={editLoading} className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-1 text-sm font-semibold text-white">
                            Save
                          </button>
                          <button type="button" onClick={() => setEditingId(null)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-sm">
                            Cancel
                          </button>
                          {editMessage && <span className="ml-3 text-sm text-gray-300">{editMessage.text}</span>}
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-gray-200">{ep.name ? ep.name : `Ep ${ep.episodeNumber}`}</div>
                        <div className="flex items-center gap-2">
                          <a href={getMediaUrl(ep.videoUrl)} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:underline">
                            {ep.videoUrl?.startsWith("http") ? "External" : ep.videoUrl?.split("/").pop()}
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(ep.id);
                              setEditNumber(ep.episodeNumber || "");
                              const isLocal = !ep.videoUrl || !ep.videoUrl.startsWith("http");
                              setEditVideoType(isLocal ? ("LOCAL" as any) : ep.videoUrl.includes("youtube") ? ("YOUTUBE" as any) : ("WEBSITE" as any));
                              setEditVideoUrl(isLocal ? "" : ep.videoUrl || "");
                              setEditFile(null);
                              setEditName(ep.name || "");
                            }}
                            className="text-yellow-400"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              setEpLoading(true);
                              const res = await deleteEpisode(ep.id);
                              if (!res.ok) setEpMessage({ type: "error", text: res.error || "Cannot delete episode." });
                              else setEpMessage({ type: "success", text: "Episode deleted." });
                              setEpLoading(false);
                            }}
                            className="text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              let finalEpNumber = Number(epNumber);
              if (!finalEpNumber || finalEpNumber <= 0) {
                finalEpNumber = 200;
              }

              if (epVideoType === "LOCAL" && !epFile) {
                setEpMessage({ type: "error", text: "Please select a local video file." });
                return;
              }
              setEpLoading(true);
              const res = await createEpisode({ animeId: movie.id, episodeNumber: Number(finalEpNumber), name: epName, videoType: epVideoType, videoUrl: epVideoType === "LOCAL" ? undefined : epVideoUrl, file: epVideoType === "LOCAL" ? epFile : undefined });
              if (!res.ok) setEpMessage({ type: "error", text: res.error || "Cannot create episode." });
              else setEpMessage({ type: "success", text: "Episode created." });
              setEpLoading(false);
              setEpNumber("");
              setEpVideoUrl("");
              setEpFile(null);
              setEpName("");
            }}
            className="mt-4 grid gap-2 sm:grid-cols-4"
          >
            <input value={epName} onChange={(ev) => setEpName(ev.target.value)} placeholder="Episode name (optional)" className={inputClasses} />
            <input value={epNumber} onChange={(ev) => setEpNumber(ev.target.value ? Number(ev.target.value) : 1)} placeholder="Episode # (Optional)" className={inputClasses} />
            <select value={epVideoType} onChange={(ev) => setEpVideoType(ev.target.value as any)} className={inputClasses}>
              <option value="LOCAL">Local File</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="WEBSITE">Website</option>
            </select>
            {epVideoType === "LOCAL" ? <input type="file" accept="video/*" onChange={(ev) => setEpFile(ev.target.files?.[0] || null)} className={inputClasses} /> : <input value={epVideoUrl} onChange={(ev) => setEpVideoUrl(ev.target.value)} placeholder="Video URL" className={inputClasses} />}

            <div className="sm:col-span-3 mt-2">
              <button type="submit" disabled={epLoading} className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                <Play className="h-4 w-4" />
                {epLoading ? "Uploading..." : "Add Episode"}
              </button>
              {epMessage && <span className="ml-3 text-sm text-gray-300">{epMessage.text}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminMoviesPage() {
  const { currentUser, isAdmin, movies, createMovie, updateMovie, deleteMovie } = useAppContext();
  const [message, setMessage] = useState<MessageState>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-lg space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20">
          <ShieldCheck className="h-7 w-7 text-brand-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Movies</h1>
        <p className="text-sm text-gray-400">Please login with an admin account.</p>
        <Link href="/login" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-lg space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20">
          <ShieldCheck className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-sm text-gray-400">Only admin can manage movies.</p>
      </div>
    );
  }

  const onCreateMovie = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
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

    form.reset();
    setMessage({ type: "success", text: "Movie created successfully!" });
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
    setMessage({ type: "success", text: "Movie updated successfully!" });
  };

  const onDeleteMovie = async (movieId: number) => {
    const result = await deleteMovie(movieId);
    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot delete movie." });
      return;
    }
    setMessage({ type: "success", text: "Movie deleted successfully!" });
  };

  const inputClasses = "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 hover:border-white/25";
  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Film className="h-6 w-6 text-brand-500" />
          <h1 className="text-3xl font-bold text-white">Movie Management</h1>
        </div>
        <p className="text-sm text-gray-400">Create, update and delete anime from the catalog.</p>
      </div>

      {/* Create Movie Form */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-card">
        <div className="border-b border-white/10 bg-gradient-to-r from-brand-600/10 to-transparent px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Plus className="h-5 w-5 text-brand-500" />
            Create New Movie
          </h2>
        </div>

        <form onSubmit={(event) => void onCreateMovie(event)} className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Title */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Film className="h-3 w-3 text-brand-500" />
                  Title <span className="text-brand-500">*</span>
                </span>
              </label>
              <input name="title" placeholder="Enter movie title" className={inputClasses} required />
            </div>

            {/* Year */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-brand-500" />
                  Year <span className="text-brand-500">*</span>
                </span>
              </label>
              <input name="year" placeholder="e.g. 2024" className={inputClasses} required />
            </div>

            {/* Genre */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-brand-500" />
                  Genre <span className="text-brand-500">*</span>
                </span>
              </label>
              <input name="genre" placeholder="Action, Adventure, etc." className={inputClasses} required />
            </div>

            {/* Trailer URL */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3 text-brand-500" />
                  Trailer URL
                </span>
              </label>
              <input name="trailerUrl" placeholder="https://youtube.com/..." className={inputClasses} />
            </div>

            {/* Poster File */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <ImageIcon className="h-3 w-3 text-brand-500" />
                  Poster Image
                </span>
              </label>
              <input name="posterFile" type="file" accept="image/*" className={clsx(inputClasses, "py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-brand-500")} />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-brand-500" />
                  Description <span className="text-brand-500">*</span>
                </span>
              </label>
              <textarea name="description" placeholder="Write a compelling description..." className={inputClasses} rows={4} required />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={clsx("btn-lift mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition", "hover:bg-brand-500 focus:ring-2 focus:ring-brand-500/30", submitting && "cursor-not-allowed opacity-70")}
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Movie
              </>
            )}
          </button>
        </form>
      </div>

      {/* Message */}
      {message && (
        <div className={clsx("animate-fade-in flex items-center gap-2 rounded-xl border px-4 py-3 text-sm", message.type === "error" ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-green-500/20 bg-green-500/10 text-green-300")}>
          <AlertCircle className="h-4 w-4" />
          {message.text}
        </div>
      )}

      {/* Movie List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">All Movies ({movies.length})</h2>
        {movies.map((movie) => (
          <MovieRow key={movie.id} movie={movie} onUpdate={onUpdateMovie} onDelete={onDeleteMovie} />
        ))}
      </div>
    </div>
  );
}
