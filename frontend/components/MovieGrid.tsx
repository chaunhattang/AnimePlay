import { Movie } from "@/lib/types";
import MovieCard from "@/components/MovieCard";

type MovieGridProps = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
  if (!movies.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
        No movies match your current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
