import { Movie } from "@/lib/types";

export function getGenres(movies: Movie[]) {
  return [
    ...new Set(
      movies
        .flatMap((movie) => movie.genre.split(","))
        .map((genre) => genre.trim())
        .filter(Boolean)
    )
  ].sort();
}

export type SortBy = "latest" | "oldest" | "title";

type FilterOptions = {
  query?: string;
  genre?: string;
  sortBy?: SortBy;
};

export function filterMovies(movies: Movie[], { query, genre, sortBy = "latest" }: FilterOptions) {
  const normalizedQuery = (query || "").trim().toLowerCase();

  const filtered = movies.filter((movie) => {
    const matchesQuery =
      !normalizedQuery ||
      movie.title.toLowerCase().includes(normalizedQuery) ||
      movie.description.toLowerCase().includes(normalizedQuery);

    const movieGenres = movie.genre
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const matchesGenre = !genre || genre === "All" || movieGenres.includes(genre);
    return matchesQuery && matchesGenre;
  });

  return filtered.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    const yearA = Number(a.year) || 0;
    const yearB = Number(b.year) || 0;
    if (sortBy === "oldest") {
      return yearA - yearB;
    }
    return yearB - yearA;
  });
}

export function getMovieById(movies: Movie[], id: number) {
  return movies.find((movie) => movie.id === id);
}

export function getRelatedMovies(movies: Movie[], id: number) {
  const movie = getMovieById(movies, id);
  if (!movie) {
    return [];
  }

  const sourceGenres = movie.genre.split(",").map((item) => item.trim());

  return movies
    .filter((item) => {
      if (item.id === id) {
        return false;
      }
      const genres = item.genre.split(",").map((genre) => genre.trim());
      return genres.some((genre) => sourceGenres.includes(genre));
    })
    .slice(0, 4);
}
