export type UserRole = "ADMIN" | "USER";

export type User = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
};

export type Movie = {
  id: number;
  title: string;
  description: string;
  year: string;
  genre: string;
  posterUrl?: string;
  trailerUrl?: string;
};

export type Favorite = {
  id: number;
  anime: Movie;
};

export type PageResult<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type Episode = {
  id: number;
  animeId: number;
  episodeNumber: number;
  videoUrl?: string;
};

export type Review = {
  id: number;
  animeId: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  content?: string;
  createdAt?: string;
};
