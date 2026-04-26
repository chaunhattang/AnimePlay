"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider";

type WatchlistButtonProps = {
  movieId: string;
};

export default function WatchlistButton({ movieId }: WatchlistButtonProps) {
  const { currentUser, isInWatchlist, toggleWatchlist } = useAppContext();
  const router = useRouter();
  const saved = isInWatchlist(movieId);

  const onClick = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    toggleWatchlist(movieId);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
        saved ? "bg-brand-600 text-white" : "bg-white/10 text-gray-100 hover:bg-white/20"
      )}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      title={saved ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Heart className={clsx("h-4 w-4", saved && "fill-white")} />
      <span>{saved ? "Saved" : "Watchlist"}</span>
    </button>
  );
}
