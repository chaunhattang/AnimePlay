export type Movie = {
  id: string;
  title: string;
  year: number;
  duration: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  country: string;
  storyline: string;
  cast: string[];
  director: string;
  trailerYoutubeId: string;
  poster: string;
  backdrop: string;
  badge?: "Now Playing" | "Top Rated" | "Trending";
};

export type UserRole = "admin" | "user";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar: string;
  role: UserRole;
  watchlistIds: string[];
  createdAt: string;
};

export type MovieReview = {
  id: string;
  movieId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};
