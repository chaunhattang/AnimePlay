"use client";

import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import { useAppContext } from "@/components/AppProvider";
import { Film, ArrowRight, Sparkles, Clock } from "lucide-react";

function HomeSkeleton() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="aspect-[21/9] skeleton-shimmer" />
      </div>

      {/* Section Skeletons */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-40 skeleton-shimmer rounded-lg" />
            <div className="h-5 w-16 skeleton-shimmer rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="overflow-hidden rounded-xl border border-white/10">
                <div className="aspect-[2/3] skeleton-shimmer" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 skeleton-shimmer rounded-lg" />
                  <div className="h-3 w-1/2 skeleton-shimmer rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { movies, loading } = useAppContext();

  const featured = movies[0];
  const latest = [...movies].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)).slice(0, 4);
  const classics = [...movies].sort((a, b) => a.title.localeCompare(b.title)).slice(0, 4);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (!featured) {
    return (
      <div className="animate-fade-in-up flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 shadow-card">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <Film className="h-8 w-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-400">No movies available</h2>
        <p className="mt-1 text-sm text-gray-600">Check back later for new additions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection movie={featured} />

      {/* Latest Updates */}
      <section className="animate-fade-in-up space-y-5" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600/20">
              <Clock className="h-4 w-4 text-brand-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Latest Updates</h2>
          </div>
          <Link href="/movies" className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-400">
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <MovieGrid movies={latest} />
      </section>

      {/* A-Z Collection */}
      <section className="animate-fade-in-up space-y-5" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">A-Z Collection</h2>
        </div>
        <MovieGrid movies={classics} />
      </section>
    </div>
  );
}
