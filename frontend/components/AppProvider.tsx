"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { movies as seedMovies } from "@/data/movies";
import { Movie, MovieReview, User, UserRole } from "@/lib/types";

type AuthLoginInput = {
  username: string;
  password: string;
};

type AuthRegisterInput = {
  username: string;
  email: string;
  password: string;
};

type ProfileUpdateInput = {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar: string;
  role: UserRole;
};

type UpdateUserInput = Partial<CreateUserInput>;

type CreateMovieInput = Omit<Movie, "id"> & { id?: string };

type UpdateMovieInput = Partial<Omit<Movie, "id">>;

type ActionResult = {
  ok: boolean;
  error?: string;
};

type AppContextValue = {
  loading: boolean;
  users: User[];
  movies: Movie[];
  reviews: MovieReview[];
  currentUser: User | null;
  isAdmin: boolean;
  register: (input: AuthRegisterInput) => ActionResult;
  login: (input: AuthLoginInput) => ActionResult;
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfile: (input: ProfileUpdateInput) => ActionResult;
  toggleWatchlist: (movieId: string) => ActionResult;
  isInWatchlist: (movieId: string) => boolean;
  getWatchlistMovies: () => Movie[];
  upsertReview: (movieId: string, rating: number, comment?: string) => ActionResult;
  deleteReview: (reviewId: string) => ActionResult;
  getMovieReviews: (movieId: string) => MovieReview[];
  getMovieAverageRating: (movieId: string) => number;
  getCurrentUserReview: (movieId: string) => MovieReview | null;
  createUser: (input: CreateUserInput) => ActionResult;
  updateUser: (userId: string, input: UpdateUserInput) => ActionResult;
  deleteUser: (userId: string) => ActionResult;
  createMovie: (input: CreateMovieInput) => ActionResult;
  updateMovie: (movieId: string, input: UpdateMovieInput) => ActionResult;
  deleteMovie: (movieId: string) => ActionResult;
};

const APP_STORE_KEY = "animeplay-app-store-v1";

const defaultUsers: User[] = [
  {
    id: "admin-1",
    username: "admin",
    email: "admin@animeplay.local",
    password: "admin123",
    fullName: "System Admin",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Admin",
    role: "admin",
    watchlistIds: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "user-1",
    username: "demo",
    email: "demo@animeplay.local",
    password: "demo123",
    fullName: "Demo User",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Demo",
    role: "user",
    watchlistIds: [],
    createdAt: new Date().toISOString()
  }
];

type PersistedStore = {
  users: User[];
  movies: Movie[];
  reviews: MovieReview[];
  currentUserId: string | null;
};

function createDefaultStore(): PersistedStore {
  return {
    users: defaultUsers,
    movies: seedMovies,
    reviews: [],
    currentUserId: null
  };
}

const AppContext = createContext<AppContextValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createMovieId(title: string) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return slug || makeId("movie");
}

function normalizeListValue(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = localStorage.getItem(APP_STORE_KEY);
      if (!raw) {
        const initialStore = createDefaultStore();
        setUsers(initialStore.users);
        setMovies(initialStore.movies);
        setReviews(initialStore.reviews);
        setCurrentUserId(initialStore.currentUserId);
        localStorage.setItem(APP_STORE_KEY, JSON.stringify(initialStore));
      } else {
        const parsed = JSON.parse(raw) as PersistedStore;
        setUsers(Array.isArray(parsed.users) ? parsed.users : defaultUsers);
        setMovies(Array.isArray(parsed.movies) ? parsed.movies : seedMovies);
        setReviews(Array.isArray(parsed.reviews) ? parsed.reviews : []);
        setCurrentUserId(parsed.currentUserId || null);
      }
    } catch {
      const fallbackStore = createDefaultStore();
      setUsers(fallbackStore.users);
      setMovies(fallbackStore.movies);
      setReviews(fallbackStore.reviews);
      setCurrentUserId(fallbackStore.currentUserId);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading || typeof window === "undefined") {
      return;
    }

    const persisted: PersistedStore = {
      users,
      movies,
      reviews,
      currentUserId
    };

    localStorage.setItem(APP_STORE_KEY, JSON.stringify(persisted));
  }, [loading, users, movies, reviews, currentUserId]);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) || null,
    [users, currentUserId]
  );

  const isAdmin = currentUser?.role === "admin";

  const register = (input: AuthRegisterInput): ActionResult => {
    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();

    if (!username || !email || !password) {
      return { ok: false, error: "Please fill all required fields." };
    }

    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: "Username already exists." };
    }

    if (users.some((user) => user.email.toLowerCase() === email)) {
      return { ok: false, error: "Email already exists." };
    }

    const newUser: User = {
      id: makeId("user"),
      username,
      email,
      password,
      fullName: username,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}`,
      role: "user",
      watchlistIds: [],
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return { ok: true };
  };

  const login = (input: AuthLoginInput): ActionResult => {
    const username = input.username.trim();
    const password = input.password.trim();
    const found = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
    );

    if (!found) {
      return { ok: false, error: "Invalid username or password." };
    }

    setCurrentUserId(found.id);
    return { ok: true };
  };

  const loginWithGoogle = () => {
    const googleEmail = "google.user@animeplay.local";
    const existing = users.find((user) => user.email.toLowerCase() === googleEmail);

    if (existing) {
      setCurrentUserId(existing.id);
      return;
    }

    const googleUser: User = {
      id: makeId("user"),
      username: `google_${Math.random().toString(36).slice(2, 7)}`,
      email: googleEmail,
      password: makeId("google-pass"),
      fullName: "Google User",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Google",
      role: "user",
      watchlistIds: [],
      createdAt: new Date().toISOString()
    };
    setUsers((prev) => [...prev, googleUser]);
    setCurrentUserId(googleUser.id);
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const updateProfile = (input: ProfileUpdateInput): ActionResult => {
    if (!currentUser) {
      return { ok: false, error: "You need to login first." };
    }

    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();
    const avatar = input.avatar.trim();

    if (!username || !email || !fullName) {
      return { ok: false, error: "Username, email and fullname are required." };
    }

    const usernameConflict = users.some(
      (user) => user.id !== currentUser.id && user.username.toLowerCase() === username.toLowerCase()
    );
    if (usernameConflict) {
      return { ok: false, error: "Username is already used by another account." };
    }

    const emailConflict = users.some((user) => user.id !== currentUser.id && user.email.toLowerCase() === email);
    if (emailConflict) {
      return { ok: false, error: "Email is already used by another account." };
    }

    const wantsPasswordChange = Boolean(input.newPassword?.trim() || input.confirmNewPassword?.trim());

    if (wantsPasswordChange) {
      if (!input.oldPassword?.trim()) {
        return { ok: false, error: "Old password is required to set a new password." };
      }
      if (input.oldPassword !== currentUser.password) {
        return { ok: false, error: "Old password is incorrect." };
      }
      if (!input.newPassword?.trim()) {
        return { ok: false, error: "New password cannot be empty." };
      }
      if (input.newPassword !== input.confirmNewPassword) {
        return { ok: false, error: "New password and confirm password do not match." };
      }
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              username,
              email,
              fullName,
              avatar: avatar || user.avatar,
              password: wantsPasswordChange ? (input.newPassword as string) : user.password
            }
          : user
      )
    );

    return { ok: true };
  };

  const toggleWatchlist = (movieId: string): ActionResult => {
    if (!currentUser) {
      return { ok: false, error: "Login required." };
    }

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== currentUser.id) {
          return user;
        }
        const alreadyInList = user.watchlistIds.includes(movieId);
        return {
          ...user,
          watchlistIds: alreadyInList
            ? user.watchlistIds.filter((id) => id !== movieId)
            : [...user.watchlistIds, movieId]
        };
      })
    );

    return { ok: true };
  };

  const isInWatchlist = (movieId: string) => {
    if (!currentUser) {
      return false;
    }
    return currentUser.watchlistIds.includes(movieId);
  };

  const getWatchlistMovies = () => {
    if (!currentUser) {
      return [];
    }

    return movies.filter((movie) => currentUser.watchlistIds.includes(movie.id));
  };

  const upsertReview = (movieId: string, rating: number, comment?: string): ActionResult => {
    if (!currentUser) {
      return { ok: false, error: "Login required." };
    }
    if (rating < 1 || rating > 10) {
      return { ok: false, error: "Rating must be between 1 and 10." };
    }

    const existing = reviews.find((review) => review.movieId === movieId && review.userId === currentUser.id);
    if (existing) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === existing.id
            ? {
                ...review,
                rating,
                comment: comment?.trim() || "",
                createdAt: new Date().toISOString()
              }
            : review
        )
      );
    } else {
      setReviews((prev) => [
        ...prev,
        {
          id: makeId("review"),
          movieId,
          userId: currentUser.id,
          rating,
          comment: comment?.trim() || "",
          createdAt: new Date().toISOString()
        }
      ]);
    }

    return { ok: true };
  };

  const deleteReview = (reviewId: string): ActionResult => {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review) {
      return { ok: false, error: "Review not found." };
    }

    if (!currentUser || (currentUser.role !== "admin" && currentUser.id !== review.userId)) {
      return { ok: false, error: "Permission denied." };
    }

    setReviews((prev) => prev.filter((item) => item.id !== reviewId));
    return { ok: true };
  };

  const getMovieReviews = (movieId: string) =>
    reviews
      .filter((review) => review.movieId === movieId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getMovieAverageRating = (movieId: string) => {
    const movieReviews = reviews.filter((review) => review.movieId === movieId);
    if (!movieReviews.length) {
      const movie = movies.find((item) => item.id === movieId);
      return movie?.rating || 0;
    }
    const total = movieReviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((total / movieReviews.length).toFixed(1));
  };

  const getCurrentUserReview = (movieId: string) => {
    if (!currentUser) {
      return null;
    }
    return reviews.find((review) => review.movieId === movieId && review.userId === currentUser.id) || null;
  };

  const createUser = (input: CreateUserInput): ActionResult => {
    if (!isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();
    const fullName = input.fullName.trim();

    if (!username || !email || !password || !fullName) {
      return { ok: false, error: "All user fields are required." };
    }

    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: "Username already exists." };
    }
    if (users.some((user) => user.email.toLowerCase() === email)) {
      return { ok: false, error: "Email already exists." };
    }

    const newUser: User = {
      id: makeId("user"),
      username,
      email,
      password,
      fullName,
      avatar: input.avatar.trim() || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      role: input.role,
      watchlistIds: [],
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    return { ok: true };
  };

  const updateUser = (userId: string, input: UpdateUserInput): ActionResult => {
    if (!isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    const target = users.find((user) => user.id === userId);
    if (!target) {
      return { ok: false, error: "User not found." };
    }

    const nextUsername = input.username?.trim() || target.username;
    const nextEmail = input.email?.trim().toLowerCase() || target.email;

    if (
      users.some(
        (user) => user.id !== userId && user.username.toLowerCase() === nextUsername.toLowerCase()
      )
    ) {
      return { ok: false, error: "Username already exists." };
    }

    if (users.some((user) => user.id !== userId && user.email.toLowerCase() === nextEmail)) {
      return { ok: false, error: "Email already exists." };
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              username: nextUsername,
              email: nextEmail,
              password: input.password?.trim() || user.password,
              fullName: input.fullName?.trim() || user.fullName,
              avatar: input.avatar?.trim() || user.avatar,
              role: input.role || user.role
            }
          : user
      )
    );

    return { ok: true };
  };

  const deleteUser = (userId: string): ActionResult => {
    if (!isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }
    if (currentUser?.id === userId) {
      return { ok: false, error: "Admin cannot delete current account." };
    }

    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setReviews((prev) => prev.filter((review) => review.userId !== userId));

    return { ok: true };
  };

  const createMovie = (input: CreateMovieInput): ActionResult => {
    if (!isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    const title = input.title.trim();
    if (!title) {
      return { ok: false, error: "Movie title is required." };
    }

    const movieId = (input.id?.trim() || createMovieId(title)).toLowerCase();
    if (movies.some((movie) => movie.id === movieId)) {
      return { ok: false, error: "Movie id already exists." };
    }

    const newMovie: Movie = {
      id: movieId,
      title,
      year: Number(input.year),
      duration: input.duration.trim(),
      rating: Number(input.rating),
      votes: input.votes.trim(),
      genres: normalizeListValue(input.genres.join(",")),
      language: input.language.trim(),
      country: input.country.trim(),
      storyline: input.storyline.trim(),
      cast: normalizeListValue(input.cast.join(",")),
      director: input.director.trim(),
      trailerYoutubeId: input.trailerYoutubeId.trim(),
      poster: input.poster.trim(),
      backdrop: input.backdrop.trim(),
      badge: input.badge
    };

    setMovies((prev) => [newMovie, ...prev]);
    return { ok: true };
  };

  const updateMovie = (movieId: string, input: UpdateMovieInput): ActionResult => {
    if (!isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    const target = movies.find((movie) => movie.id === movieId);
    if (!target) {
      return { ok: false, error: "Movie not found." };
    }

    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              title: input.title?.trim() || movie.title,
              year: input.year === undefined ? movie.year : Number(input.year),
              duration: input.duration?.trim() || movie.duration,
              rating: input.rating === undefined ? movie.rating : Number(input.rating),
              votes: input.votes?.trim() || movie.votes,
              genres: input.genres ? normalizeListValue(input.genres.join(",")) : movie.genres,
              language: input.language?.trim() || movie.language,
              country: input.country?.trim() || movie.country,
              storyline: input.storyline?.trim() || movie.storyline,
              cast: input.cast ? normalizeListValue(input.cast.join(",")) : movie.cast,
              director: input.director?.trim() || movie.director,
              trailerYoutubeId: input.trailerYoutubeId?.trim() || movie.trailerYoutubeId,
              poster: input.poster?.trim() || movie.poster,
              backdrop: input.backdrop?.trim() || movie.backdrop,
              badge: input.badge === undefined ? movie.badge : input.badge
            }
          : movie
      )
    );
    return { ok: true };
  };

  const deleteMovie = (movieId: string): ActionResult => {
    if (!isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    setMovies((prev) => prev.filter((movie) => movie.id !== movieId));
    setReviews((prev) => prev.filter((review) => review.movieId !== movieId));
    setUsers((prev) =>
      prev.map((user) => ({
        ...user,
        watchlistIds: user.watchlistIds.filter((id) => id !== movieId)
      }))
    );

    return { ok: true };
  };

  const value: AppContextValue = {
    loading,
    users,
    movies,
    reviews,
    currentUser,
    isAdmin,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    toggleWatchlist,
    isInWatchlist,
    getWatchlistMovies,
    upsertReview,
    deleteReview,
    getMovieReviews,
    getMovieAverageRating,
    getCurrentUserReview,
    createUser,
    updateUser,
    deleteUser,
    createMovie,
    updateMovie,
    deleteMovie
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}
