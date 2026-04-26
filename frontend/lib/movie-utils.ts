import { Movie } from "@/lib/types";

export function getGenres(movies: Movie[]) {
  return [...new Set(movies.flatMap((movie) => movie.genres))].sort();
}

export type SortBy = "popular" | "rating" | "latest";

type FilterOptions = {
  query?: string;
  genre?: string;
  sortBy?: SortBy;
};

export function filterMovies(movies: Movie[], { query, genre, sortBy = "popular" }: FilterOptions) {
  const normalizedQuery = (query || "").trim().toLowerCase();

  const filtered = movies.filter((movie) => {
    const matchesQuery =
      !normalizedQuery ||
      movie.title.toLowerCase().includes(normalizedQuery) ||
      movie.cast.join(" ").toLowerCase().includes(normalizedQuery);

    const matchesGenre = !genre || genre === "All" || movie.genres.includes(genre);
    return matchesQuery && matchesGenre;
  });

  return filtered.sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "latest") {
      return b.year - a.year;
    }
    return parseVotes(b.votes) - parseVotes(a.votes);
  });
}

export function getMovieById(movies: Movie[], id: string) {
  return movies.find((movie) => movie.id === id);
}

export function getRelatedMovies(movies: Movie[], id: string) {
  const movie = getMovieById(movies, id);
  if (!movie) {
    return [];
  }

  return movies
    .filter((item) => item.id !== id && item.genres.some((genre) => movie.genres.includes(genre)))
    .slice(0, 4);
}

function parseVotes(votes: string): number {
  if (votes.endsWith("M")) {
    return Number(votes.replace("M", "")) * 1000000;
  }
  if (votes.endsWith("K")) {
    return Number(votes.replace("K", "")) * 1000;
  }
  return Number(votes);
}
