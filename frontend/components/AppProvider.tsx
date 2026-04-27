"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import { Favorite, Movie, User, UserRole } from "@/lib/types";

type AuthLoginInput = {
  accountName: string;
  password: string;
};

type AuthRegisterInput = {
  username: string;
  email: string;
  password: string;
};

type ProfileUpdateInput = {
  fullName: string;
  avatarUrl: string;
  avatarFile?: File | null;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
  avatarFile?: File | null;
  role: UserRole;
};

type UpdateUserInput = Partial<CreateUserInput> & {
  avatarFile?: File | null;
};

type CreateMovieInput = {
  title: string;
  description: string;
  year: string;
  genre: string;
  trailerUrl?: string;
  posterUrl?: string;
  posterFile?: File | null;
};

type UpdateMovieInput = Partial<CreateMovieInput>;

type ActionResult = {
  ok: boolean;
  error?: string;
};

type AppContextValue = {
  loading: boolean;
  users: User[];
  movies: Movie[];
  favorites: Favorite[];
  currentUser: User | null;
  isAdmin: boolean;
  register: (input: AuthRegisterInput) => Promise<ActionResult>;
  login: (input: AuthLoginInput) => Promise<ActionResult>;
  logout: () => void;
  updateProfile: (input: ProfileUpdateInput) => Promise<ActionResult>;
  toggleWatchlist: (movieId: number) => Promise<ActionResult>;
  isInWatchlist: (movieId: number) => boolean;
  getWatchlistMovies: () => Movie[];
  createUser: (input: CreateUserInput) => Promise<ActionResult>;
  updateUser: (userId: string, input: UpdateUserInput) => Promise<ActionResult>;
  deleteUser: (userId: string) => Promise<ActionResult>;
  createMovie: (input: CreateMovieInput) => Promise<ActionResult>;
  updateMovie: (movieId: number, input: UpdateMovieInput) => Promise<ActionResult>;
  deleteMovie: (movieId: number) => Promise<ActionResult>;
};

const TOKEN_KEY = "animeplay-access-token";
const AppContext = createContext<AppContextValue | null>(null);

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

function appendIfPresent(formData: FormData, key: string, value?: string | null) {
  if (value && value.trim()) {
    formData.append(key, value.trim());
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isAdmin = currentUser?.role === "ADMIN";

  const clearSession = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(null);
    setCurrentUser(null);
    setFavorites([]);
    setUsers([]);
  }, []);

  const loadMovies = useCallback(async () => {
    const page = await apiClient.getAnime({
      page: 0,
      size: 100,
      sortBy: "id",
      sortDir: "desc",
    });
    setMovies(page.content || []);
  }, []);

  const loadAdminUsers = useCallback(async (accessToken: string) => {
    const page = await apiClient.getUsers(accessToken, 0, 100);
    setUsers(page.content || []);
  }, []);

  const loadAuthenticatedData = useCallback(
    async (accessToken: string) => {
      const me = await apiClient.getCurrentUser(accessToken);
      setCurrentUser(me);

      const myFavorites = await apiClient.getFavorites(accessToken);
      setFavorites(myFavorites || []);

      if (me.role === "ADMIN") {
        await loadAdminUsers(accessToken);
      } else {
        setUsers([]);
      }
    },
    [loadAdminUsers],
  );

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const savedToken = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
        await loadMovies();

        if (savedToken) {
          setToken(savedToken);
          await loadAuthenticatedData(savedToken);
        }
      } catch {
        clearSession();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      mounted = false;
    };
  }, [clearSession, loadAuthenticatedData, loadMovies]);

  const register = async (input: AuthRegisterInput): Promise<ActionResult> => {
    try {
      await apiClient.register(input);
      return login({ accountName: input.username, password: input.password });
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Register failed.") };
    }
  };

  const login = async (input: AuthLoginInput): Promise<ActionResult> => {
    try {
      const response = await apiClient.login(input);
      setToken(response.token);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, response.token);
      }
      await loadAuthenticatedData(response.token);
      return { ok: true };
    } catch (error) {
      clearSession();
      return { ok: false, error: getErrorMessage(error, "Login failed.") };
    }
  };

  const logout = () => {
    clearSession();
  };

  const updateProfile = async (input: ProfileUpdateInput): Promise<ActionResult> => {
    if (!token || !currentUser) {
      return { ok: false, error: "You need to login first." };
    }
    if ((input.newPassword || input.confirmNewPassword) && input.newPassword !== input.confirmNewPassword) {
      return { ok: false, error: "New password and confirm password do not match." };
    }

    try {
      const formData = new FormData();
      appendIfPresent(formData, "fullName", input.fullName);
      // avatar should be uploaded as a file, not a raw URL string
      appendIfPresent(formData, "oldPassword", input.oldPassword);
      appendIfPresent(formData, "newPassword", input.newPassword);
      if (input.avatarFile) {
        formData.append("file", input.avatarFile);
      }

      const updated = await apiClient.updateCurrentUser(token, formData);
      setCurrentUser(updated);
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot update profile.") };
    }
  };

  const toggleWatchlist = async (movieId: number): Promise<ActionResult> => {
    if (!token) {
      return { ok: false, error: "Login required." };
    }
    try {
      const exists = favorites.some((favorite) => favorite.anime.id === movieId);
      if (exists) {
        await apiClient.removeFavorite(token, movieId);
        setFavorites((prev) => prev.filter((favorite) => favorite.anime.id !== movieId));
      } else {
        const created = await apiClient.addFavorite(token, movieId);
        setFavorites((prev) => [created, ...prev]);
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot update watchlist.") };
    }
  };

  const isInWatchlist = (movieId: number) => favorites.some((favorite) => favorite.anime.id === movieId);

  const getWatchlistMovies = () => favorites.map((favorite) => favorite.anime);

  const createUser = async (input: CreateUserInput): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }
    try {
      const formData = new FormData();
      appendIfPresent(formData, "username", input.username);
      appendIfPresent(formData, "email", input.email);
      appendIfPresent(formData, "fullName", input.fullName);
      appendIfPresent(formData, "password", input.password);
      appendIfPresent(formData, "role", input.role);
      if (input.avatarFile) {
        formData.append("file", input.avatarFile);
      }

      const created = await apiClient.createUser(token, formData);
      setUsers((prev) => [created, ...prev]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot create user.") };
    }
  };

  const updateUser = async (userId: string, input: UpdateUserInput): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }
    try {
      const formData = new FormData();
      appendIfPresent(formData, "username", input.username);
      appendIfPresent(formData, "email", input.email);
      appendIfPresent(formData, "fullName", input.fullName);
      appendIfPresent(formData, "password", input.password);
      appendIfPresent(formData, "role", input.role);
      if (input.avatarFile) {
        formData.append("file", input.avatarFile);
      }

      const updated = await apiClient.updateUser(token, userId, formData);
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (currentUser?.id === updated.id) {
        setCurrentUser(updated);
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot update user.") };
    }
  };

  const deleteUser = async (userId: string): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }
    if (currentUser?.id === userId) {
      return { ok: false, error: "Admin cannot delete current account." };
    }

    try {
      await apiClient.deleteUser(token, userId);
      setUsers((prev) => prev.filter((item) => item.id !== userId));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot delete user.") };
    }
  };

  const createMovie = async (input: CreateMovieInput): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    try {
      const formData = new FormData();
      appendIfPresent(formData, "title", input.title);
      appendIfPresent(formData, "description", input.description);
      appendIfPresent(formData, "year", input.year);
      appendIfPresent(formData, "genre", input.genre);
      appendIfPresent(formData, "trailerUrl", input.trailerUrl);
      if (input.posterFile) {
        formData.append("file", input.posterFile);
      }

      const created = await apiClient.createAnime(token, formData);
      setMovies((prev) => [created, ...prev]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot create movie.") };
    }
  };

  const updateMovie = async (movieId: number, input: UpdateMovieInput): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }
    try {
      const formData = new FormData();
      appendIfPresent(formData, "title", input.title);
      appendIfPresent(formData, "description", input.description);
      appendIfPresent(formData, "year", input.year);
      appendIfPresent(formData, "genre", input.genre);
      appendIfPresent(formData, "trailerUrl", input.trailerUrl);
      if (input.posterFile) {
        formData.append("file", input.posterFile);
      }

      const updated = await apiClient.updateAnime(token, movieId, formData);
      setMovies((prev) => prev.map((item) => (item.id === movieId ? updated : item)));
      setFavorites((prev) => prev.map((favorite) => (favorite.anime.id === movieId ? { ...favorite, anime: updated } : favorite)));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot update movie.") };
    }
  };

  const deleteMovie = async (movieId: number): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    try {
      await apiClient.deleteAnime(token, movieId);
      setMovies((prev) => prev.filter((item) => item.id !== movieId));
      setFavorites((prev) => prev.filter((favorite) => favorite.anime.id !== movieId));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot delete movie.") };
    }
  };

  const value = useMemo<AppContextValue>(
    () => ({
      loading,
      users,
      movies,
      favorites,
      currentUser,
      isAdmin,
      register,
      login,
      logout,
      updateProfile,
      toggleWatchlist,
      isInWatchlist,
      getWatchlistMovies,
      createUser,
      updateUser,
      deleteUser,
      createMovie,
      updateMovie,
      deleteMovie,
    }),
    [loading, users, movies, favorites, currentUser, isAdmin],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}
