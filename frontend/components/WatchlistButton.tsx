"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/components/AppProvider";

type WatchlistButtonProps = {
  movieId: number;
};

export default function WatchlistButton({ movieId }: WatchlistButtonProps) {
  const { currentUser, isInWatchlist, toggleWatchlist } = useAppContext();
  const router = useRouter();
  const saved = isInWatchlist(movieId);
  const [isAnimating, setIsAnimating] = useState(false);

  const onClick = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setIsAnimating(true);
    await toggleWatchlist(movieId);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
        saved ? "bg-brand-600 text-white shadow-glow hover:bg-brand-500 hover:shadow-glow-lg" : "border border-white/15 bg-white/5 text-gray-300 hover:border-brand-500/30 hover:bg-brand-600/10 hover:text-brand-400",
      )}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      title={saved ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Heart className={clsx("h-4 w-4 transition-all duration-300", saved && "fill-white", isAnimating && "animate-heart-pop")} />
      <span className="hidden sm:inline">{saved ? "Saved" : "Watchlist"}</span>
    </button>
  );
}
