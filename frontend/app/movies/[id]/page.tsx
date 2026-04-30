"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, PlayCircle, Tags, ArrowLeft, Film } from "lucide-react";
import MovieGrid from "@/components/MovieGrid";
import WatchlistButton from "@/components/WatchlistButton";
import { useAppContext } from "@/components/AppProvider";
import RatingStars from "@/components/RatingStars";
import { getRelatedMovies } from "@/lib/movie-utils";
import { apiClient, getMediaUrl } from "@/lib/api-client";

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const movieId = Number(params.id);
  const { movies, currentUser, isAdmin } = useAppContext();

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
  function getYouTubeId(url?: string | null) {
    if (!url) return null;
    try {
      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      return m && m[1] ? m[1] : null;
    } catch (e) {
      return null;
    }
  }

  function getYouTubeThumbnail(url?: string | null) {
    const id = getYouTubeId(url);
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  const posterUrl = movie.posterUrl ? getMediaUrl(movie.posterUrl) : getYouTubeThumbnail(movie.trailerUrl) || "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg";

  const [showTrailer, setShowTrailer] = useState(false);
  const [mountedPortal, setMountedPortal] = useState(false);

  useEffect(() => {
    setMountedPortal(true);
  }, []);

  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [creatingReview, setCreatingReview] = useState(false);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<number>(8);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!movie) return;
      setLoadingEpisodes(true);
      try {
        const list = await apiClient.getEpisodesByAnimeId(movie.id);
        if (mounted) setEpisodes(list || []);
      } catch {
        if (mounted) setEpisodes([]);
      } finally {
        if (mounted) setLoadingEpisodes(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [movie]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!movie) return;
      setLoadingReviews(true);
      try {
        const list = await apiClient.getReviewsByAnimeId(movie.id);
        if (mounted) setReviews(list || []);
      } catch {
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoadingReviews(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [movie]);

  function getYouTubeEmbedUrl(url?: string | null) {
    if (!url) return null;
    try {
      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}`;
    } catch (e) {
      // ignore
    }
    return null;
  }

  const averageRating = reviews.length ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length : 0;

  const handleSubmitReview = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("animeplay-access-token") : null;
    if (!token) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }
    setCreatingReview(true);
    try {
      const created = await apiClient.createReview(token, movie.id, { rating: newReviewRating, content: newReviewContent });
      setReviews((prev) => [created, ...prev]);
      setNewReviewContent("");
      setNewReviewRating(8);
    } catch (err) {
      alert("Không thể gửi bình luận.");
    } finally {
      setCreatingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("animeplay-access-token") : null;
    if (!token) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    }
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await apiClient.deleteReview(token, movie.id, reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert("Không thể xóa bình luận.");
    }
  };

  const handleEditReview = async (review: any) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("animeplay-access-token") : null;
    if (!token) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    }

    const newContent = prompt("Edit comment:", review.content || "");
    if (newContent === null) return; // cancelled
    const newRatingStr = prompt("Rating (0-10):", String(review.rating || 0));
    if (newRatingStr === null) return;
    const newRating = Number(newRatingStr);
    if (isNaN(newRating) || newRating < 0 || newRating > 10) {
      alert("Invalid rating.");
      return;
    }

    try {
      const updated = await apiClient.updateReview(token, movie.id, review.id, { rating: newRating, content: newContent });
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      alert("Không thể cập nhật bình luận.");
    }
  };

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
              <button onClick={() => setShowTrailer(true)} className="btn-lift inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100">
                <PlayCircle className="h-4 w-4" />
                <span>Watch Trailer</span>
              </button>
            ) : null}
            <WatchlistButton movieId={movie.id} />
          </div>
          {/* Episodes List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white">Episodes</h3>
            {loadingEpisodes ? (
              <div className="text-sm text-gray-400">Loading episodes...</div>
            ) : episodes.length === 0 ? (
              <div className="text-sm text-gray-400">No episodes available.</div>
            ) : (
              <div className="mt-3">
                <div className="flex flex-wrap gap-3">
                  {episodes
                    .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0))
                    .map((ep) => {
                      const params = new URLSearchParams();
                      params.set("videoUrl", ep.videoUrl || "");
                      params.set("animeId", String(movie.id));
                      params.set("episodeId", String(ep.id));
                      return (
                        <Link key={ep.id} href={`/watch?${params.toString()}`} className="inline-flex items-center justify-center rounded-lg border border-white/6 bg-white/[0.02] px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                          {ep.name ? ep.name : `Episode ${ep.episodeNumber}`}
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Movies */}
      <section className="mt-8">
        <h3 className="text-lg font-semibold text-white">Comments & Ratings</h3>
        <div className="mt-3 space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-white">Average Rating</div>
            <div className="flex items-center gap-2">
              <RatingStars rating={averageRating} />
              <div className="text-sm text-gray-300">({reviews.length} reviews)</div>
            </div>
          </div>

          {loadingReviews ? (
            <div className="text-sm text-gray-400">Loading comments...</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-lg border border-white/6 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/5 text-sm text-gray-200">{r.username?.charAt(0) || "U"}</div>
                      <div>
                        <div className="text-sm font-medium text-white">{r.username || "Unknown"}</div>
                        <div className="text-xs text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={r.rating || 0} />
                      {isAdmin ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => void handleEditReview(r)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs text-white/80">
                            Edit
                          </button>
                          <button onClick={() => void handleDeleteReview(r.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 px-3 py-1 text-xs text-red-300">
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {r.content ? <div className="mt-2 text-sm text-gray-300">{r.content}</div> : null}
                </div>
              ))}
            </div>
          )}

          <div className="pt-4">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-white">Your Rating</label>
                  <input type="range" min={0} max={10} value={newReviewRating} onChange={(e) => setNewReviewRating(Number(e.target.value))} />
                  <div className="text-sm text-gray-300">{newReviewRating}</div>
                </div>
                <textarea value={newReviewContent} onChange={(e) => setNewReviewContent(e.target.value)} className="w-full rounded-md border bg-transparent p-2 text-sm text-gray-200" placeholder="Write your comment..." />
                <div className="flex justify-end">
                  <button onClick={handleSubmitReview} disabled={creatingReview} className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                    {creatingReview ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Please <Link href="/login">login</Link> to post a comment.
              </div>
            )}
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="animate-fade-in space-y-5" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-brand-500" />
            <h2 className="text-xl font-semibold text-white">Related Movies</h2>
          </div>
          <MovieGrid movies={related} />
        </section>
      )}
      {mountedPortal && showTrailer
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-4xl">
                <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                  {(() => {
                    const url = movie.trailerUrl;
                    if (!url) return <div className="flex h-full w-full items-center justify-center text-gray-500">Chưa có video</div>;
                    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
                    const isExternalEmbed = url.startsWith("http") && !isYouTube;
                    if (isYouTube) {
                      return <iframe className="absolute inset-0 w-full h-full" src={getYouTubeEmbedUrl(url) || ""} title={`Trailer ${movie.title}`} frameBorder={0} allowFullScreen />;
                    }
                    if (isExternalEmbed) {
                      return <iframe className="absolute inset-0 w-full h-full" src={url} title={`Phim ${movie.title}`} frameBorder={0} allowFullScreen />;
                    }
                    return (
                      <video controls className="absolute inset-0 w-full h-full object-contain">
                        <source src={getMediaUrl(url)} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                      </video>
                    );
                  })()}
                </div>
                <div className="mt-3 text-right">
                  <button onClick={() => setShowTrailer(false)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">
                    Close
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
