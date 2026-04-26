"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RatingStars from "@/components/RatingStars";
import { useAppContext } from "@/components/AppProvider";

type MovieReviewsProps = {
  movieId: string;
};

export default function MovieReviews({ movieId }: MovieReviewsProps) {
  const {
    currentUser,
    users,
    isAdmin,
    upsertReview,
    deleteReview,
    getMovieReviews,
    getMovieAverageRating,
    getCurrentUserReview
  } = useAppContext();
  const router = useRouter();
  const currentReview = getCurrentUserReview(movieId);
  const reviews = getMovieReviews(movieId);
  const avg = getMovieAverageRating(movieId);

  const [rating, setRating] = useState<number>(currentReview?.rating || 8);
  const [comment, setComment] = useState<string>(currentReview?.comment || "");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setRating(currentReview?.rating || 8);
    setComment(currentReview?.comment || "");
  }, [currentReview]);

  const reviewUsers = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = upsertReview(movieId, rating, comment);
    if (!result.ok) {
      setMessage(result.error || "Cannot save review.");
      return;
    }
    setMessage("Your review is saved.");
  };

  const onDeleteReview = (reviewId: string) => {
    const result = deleteReview(reviewId);
    if (!result.ok) {
      setMessage(result.error || "Cannot delete review.");
      return;
    }
    setMessage("Review deleted.");
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Ratings & Comments</h2>
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
          <RatingStars rating={avg} />
          <span className="text-gray-300">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {currentUser ? (
        <form onSubmit={submitReview} className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <label className="text-sm font-medium text-gray-200">Your rating</label>
            <input
              type="number"
              min={1}
              max={10}
              step={0.1}
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="w-full rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <label className="text-sm font-medium text-gray-200">Comment</label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Optional comment"
              rows={3}
              className="w-full rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold">
            {currentReview ? "Update Review" : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          Login to rate and comment.
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="ml-2 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Login
          </button>
        </div>
      )}

      {message ? <p className="text-sm text-gray-300">{message}</p> : null}

      <div className="space-y-3">
        {reviews.length ? (
          reviews.map((review) => {
            const author = reviewUsers.get(review.userId);
            const canDelete = currentUser && (currentUser.id === review.userId || isAdmin);

            return (
              <article key={review.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{author?.fullName || "Unknown user"}</p>
                    <p className="text-xs text-gray-400">@{author?.username || "unknown"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={review.rating} />
                    {canDelete ? (
                      <button
                        type="button"
                        onClick={() => onDeleteReview(review.id)}
                        className="rounded-md border border-red-400/50 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
                {review.comment ? <p className="mt-3 text-sm text-gray-200">{review.comment}</p> : null}
              </article>
            );
          })
        ) : (
          <p className="text-sm text-gray-400">No comments yet.</p>
        )}
      </div>
    </section>
  );
}
