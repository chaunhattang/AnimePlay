"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/types";
import WatchlistButton from "@/components/WatchlistButton";
import { getMediaUrl } from "@/lib/api-client";

type HeroSectionProps = {
  movies: Movie[];
  initialIndex?: number;
  autoRotate?: boolean;
  rotateInterval?: number;
};

export default function HeroSection({ movies, initialIndex = 0, autoRotate = true, rotateInterval = 7000 }: HeroSectionProps) {
  const [index, setIndex] = useState(() => (movies && movies.length ? Math.min(initialIndex, movies.length - 1) : 0));
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    setIndex((i) => (i >= movies.length ? 0 : i));
  }, [movies]);

  const currentMovie = movies && movies.length ? movies[index] : null;

  const rotateRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoRotate || !movies || movies.length <= 1 || hovering) return;

    rotateRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % movies.length);
    }, rotateInterval);

    return () => {
      if (rotateRef.current) {
        clearInterval(rotateRef.current);
        rotateRef.current = null;
      }
    };
  }, [autoRotate, rotateInterval, movies, hovering]);

  const prev = () => {
    if (!movies || movies.length === 0) return;
    setIndex((i) => (i - 1 + movies.length) % movies.length);
  };

  const next = () => {
    if (!movies || movies.length === 0) return;
    setIndex((i) => (i + 1) % movies.length);
  };

  function isYouTube(url?: string | null) {
    if (!url) return false;
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(url);
  }

  function getYouTubeId(url?: string | null) {
    if (!url) return null;
    try {
      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      return m && m[1] ? m[1] : null;
    } catch {
      return null;
    }
  }

  function getYouTubeEmbed(url?: string | null) {
    const id = getYouTubeId(url);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&loop=1&playlist=${id}&playsinline=1`;
  }

  if (!currentMovie) {
    return (
      <div className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-white/10 shadow-card p-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 mx-auto">
          <Sparkles className="h-6 w-6 text-gray-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-400">No featured movies</h2>
        <p className="mt-1 text-sm text-gray-600">Add movies to see featured carousel.</p>
      </div>
    );
  }

  const posterUrl = currentMovie.posterUrl ? getMediaUrl(currentMovie.posterUrl) : "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="animate-fade-in-up group relative overflow-hidden rounded-2xl border border-white/10 shadow-card px-5"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image src={posterUrl} alt={currentMovie.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" priority />

        {/* Video / iframe overlay on hover */}
        {hovering && currentMovie.trailerUrl ? (
          isYouTube(currentMovie.trailerUrl) ? (
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
              <iframe src={getYouTubeEmbed(currentMovie.trailerUrl) || ""} className="w-full h-full scale-[1.35]" allow="autoplay; encrypted-media" title={`Trailer ${currentMovie.title}`} />
            </div>
          ) : (
            <video className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none" autoPlay playsInline loop>
              <source src={getMediaUrl(currentMovie.trailerUrl)} />
            </video>
          )
        ) : null}

        {/* Gradient overlays */}

        <div className={`absolute inset-0 z-20 transition-opacity duration-700 pointer-events-none ${hovering ? "opacity-0" : "opacity-100 bg-gradient-to-r from-black via-black/90 to-black/30"}`} />
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className={`relative z-30 flex min-h-[400px] flex-col justify-end px-6 py-10 transition-opacity duration-700 sm:min-h-[450px] sm:px-10 sm:pb-12 ${hovering ? "opacity-0" : "opacity-100"}`}>
        <div className="max-w-2xl space-y-5">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/90 px-3 py-1 text-xs font-semibold text-white shadow-glow backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          </div>

          <h1 className="animate-fade-in-up text-3xl font-bold leading-tight text-white sm:text-5xl" style={{ animationDelay: "0.15s" }}>
            {currentMovie.title}
          </h1>

          <div className="animate-fade-in flex flex-wrap items-center gap-4 text-sm text-gray-300" style={{ animationDelay: "0.25s" }}>
            <span className="rounded-lg bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">{currentMovie.year}</span>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <span className="text-gray-400">{currentMovie.genre}</span>
          </div>

          <p className="animate-fade-in max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base" style={{ animationDelay: "0.3s" }}>
            {currentMovie.description}
          </p>

          <div className="animate-fade-in-up flex flex-wrap items-center gap-3 pt-2" style={{ animationDelay: "0.35s" }}>
            <Link href={`/movies/${currentMovie.id}`} className="btn-lift pulse-glow inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100">
              <PlayCircle className="h-4 w-4" />
              <span>View Details</span>
            </Link>
            <WatchlistButton movieId={currentMovie.id} />
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button aria-label="Previous featured" onClick={prev} className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button aria-label="Next featured" onClick={next} className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60">
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 flex gap-2">
        {movies.map((m, idx) => (
          <button key={m.id} aria-label={`Go to featured ${idx + 1}`} onClick={() => setIndex(idx)} className={`h-2 w-2 rounded-full ${idx === index ? "bg-white" : "bg-white/30"}`} />
        ))}
      </div>
    </motion.section>
  );
}
