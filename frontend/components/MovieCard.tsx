"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/lib/types";
import WatchlistButton from "@/components/WatchlistButton";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.posterUrl || "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg";
  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-card-hover"
    >
      {/* Image Container */}
      <Link href={`/movies/${movie.id}`} className="relative block overflow-hidden">
        <div className="relative aspect-[2/3]">
          <Image src={posterUrl} alt={movie.title} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Year badge on hover */}
          <div className="absolute bottom-3 left-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">{movie.year}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div>
          <Link href={`/movies/${movie.id}`} className="line-clamp-1 text-base font-semibold text-white transition-colors hover:text-brand-400">
            {movie.title}
          </Link>
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{movie.genre}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Clock3 className="h-3 w-3 text-brand-500/70" />
            {movie.year}
          </p>
          <WatchlistButton movieId={movie.id} />
        </div>
      </div>
    </motion.article>
  );
}
