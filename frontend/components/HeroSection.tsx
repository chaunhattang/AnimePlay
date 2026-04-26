import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Movie } from "@/lib/types";
import WatchlistButton from "@/components/WatchlistButton";
import RatingStars from "@/components/RatingStars";

type HeroSectionProps = {
  movie: Movie;
};

export default function HeroSection({ movie }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10">
      <div className="absolute inset-0">
        <Image src={movie.backdrop} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20" />
      </div>
      <div className="relative z-10 max-w-2xl space-y-4 px-5 py-10 sm:px-8 sm:py-14">
        <p className="inline-flex rounded-md bg-brand-600 px-2 py-1 text-xs font-semibold">{movie.badge ?? "Featured"}</p>
        <h1 className="text-3xl font-bold sm:text-4xl">{movie.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-200">
          <RatingStars rating={movie.rating} />
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
          <span>{movie.votes} votes</span>
        </div>
        <p className="text-sm text-gray-200 sm:text-base">{movie.storyline}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/movies/${movie.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-100"
          >
            <PlayCircle className="h-4 w-4" />
            <span>View Details</span>
          </Link>
          <WatchlistButton movieId={movie.id} />
        </div>
      </div>
    </section>
  );
}
