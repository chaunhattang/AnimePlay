"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, Sparkles } from "lucide-react";
import { Movie } from "@/lib/types";
import WatchlistButton from "@/components/WatchlistButton";

type HeroSectionProps = {
  movie: Movie;
};

export default function HeroSection({ movie }: HeroSectionProps) {
  const posterUrl = movie.posterUrl || "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg";

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="animate-fade-in-up group relative overflow-hidden rounded-2xl border border-white/10 shadow-card">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src={posterUrl} alt={movie.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" priority />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[400px] flex-col justify-end px-6 py-10 sm:min-h-[450px] sm:px-10 sm:pb-12">
        <div className="max-w-2xl space-y-5">
          {/* Badge */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/90 px-3 py-1 text-xs font-semibold text-white shadow-glow backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up text-3xl font-bold leading-tight text-white sm:text-5xl" style={{ animationDelay: "0.15s" }}>
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="animate-fade-in flex flex-wrap items-center gap-4 text-sm text-gray-300" style={{ animationDelay: "0.25s" }}>
            <span className="rounded-lg bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">{movie.year}</span>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <span className="text-gray-400">{movie.genre}</span>
          </div>

          {/* Description */}
          <p className="animate-fade-in max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base" style={{ animationDelay: "0.3s" }}>
            {movie.description}
          </p>

          {/* Actions */}
          <div className="animate-fade-in-up flex flex-wrap items-center gap-3 pt-2" style={{ animationDelay: "0.35s" }}>
            <Link href={`/movies/${movie.id}`} className="btn-lift pulse-glow inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100">
              <PlayCircle className="h-4 w-4" />
              <span>View Details</span>
            </Link>
            <WatchlistButton movieId={movie.id} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
