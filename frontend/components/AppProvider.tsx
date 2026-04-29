"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import { Favorite, Movie, User, UserRole, Episode } from "@/lib/types";

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
  episodes: Episode[];
  favorites: Favorite[];
  currentUser: User | null;
  isAdmin: boolean;
  getEpisodesByAnimeId: (animeId: number) => Episode[];
  register: (input: AuthRegisterInput) => Promise<ActionResult>;
  login: (input: AuthLoginInput) => Promise<ActionResult>;
  googleLogin: (token: string) => Promise<ActionResult>;
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
  createEpisode: (input: { animeId: number; episodeNumber: number; videoType: "LOCAL" | "YOUTUBE" | "WEBSITE"; videoUrl?: string; file?: File | null }) => Promise<ActionResult>;
  deleteEpisode: (episodeId: number) => Promise<ActionResult>;
  updateEpisode: (episodeId: number, input: { animeId?: number; episodeNumber?: number; videoType?: "LOCAL" | "YOUTUBE" | "WEBSITE"; videoUrl?: string; file?: File | null }) => Promise<ActionResult>;
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
  const [episodes, setEpisodes] = useState<Episode[]>([]);
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

  const loadEpisodes = useCallback(async (accessToken: string) => {
    try {
      const list = await apiClient.getAllEpisodes(accessToken);
      setEpisodes(list || []);
    } catch {
      setEpisodes([]);
    }
  }, []);

  const loadAuthenticatedData = useCallback(
    async (accessToken: string) => {
      const me = await apiClient.getCurrentUser(accessToken);
      setCurrentUser(me);

      const myFavorites = await apiClient.getFavorites(accessToken);
      setFavorites(myFavorites || []);

      if (me.role === "ADMIN") {
        await loadAdminUsers(accessToken);
        await loadEpisodes(accessToken);
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

  const googleLogin = async (idToken: string): Promise<ActionResult> => {
    try {
      const response = await apiClient.googleLogin(idToken);
      setToken(response.token);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, response.token);
      }
      await loadAuthenticatedData(response.token);
      return { ok: true };
    } catch (error) {
      clearSession();
      return { ok: false, error: getErrorMessage(error, "Google login failed.") };
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
      // Create user via JSON payload to match backend `/auth/create` which expects JSON
      const payload = {
        username: input.username,
        email: input.email,
        password: input.password,
        fullName: input.fullName,
        role: input.role,
        avatarUrl: input.avatarUrl,
      };

      const created = await apiClient.createUser(token, payload);

      // If an avatar file was provided, upload it using the update endpoint which accepts multipart/form-data
      let finalUser = created;
      if (input.avatarFile) {
        const fileForm = new FormData();
        fileForm.append("file", input.avatarFile);
        const updated = await apiClient.updateUser(token, created.id, fileForm);
        finalUser = updated;
      }

      setUsers((prev) => [finalUser, ...prev]);
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

  const createEpisode = async (input: { animeId: number; episodeNumber: number; name?: string; videoType: "LOCAL" | "YOUTUBE" | "WEBSITE"; videoUrl?: string; file?: File | null }): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    try {
      const formData = new FormData();
      formData.append("animeId", String(input.animeId));
      formData.append("episodeNumber", String(input.episodeNumber));
      if (input.name) formData.append("name", input.name);
      formData.append("videoType", input.videoType);
      if (input.videoUrl) formData.append("videoUrl", input.videoUrl);
      if (input.file) formData.append("file", input.file);

      const created = await apiClient.createEpisode(token, formData);
      setEpisodes((prev) => [created, ...prev]);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot create episode.") };
    }
  };

  const deleteEpisode = async (episodeId: number): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    try {
      await apiClient.deleteEpisode(token, episodeId);
      setEpisodes((prev) => prev.filter((e) => e.id !== episodeId));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot delete episode.") };
    }
  };

  const updateEpisode = async (episodeId: number, input: { animeId?: number; episodeNumber?: number; name?: string; videoType?: "LOCAL" | "YOUTUBE" | "WEBSITE"; videoUrl?: string; file?: File | null }): Promise<ActionResult> => {
    if (!token || !isAdmin) {
      return { ok: false, error: "Admin permission required." };
    }

    try {
      const formData = new FormData();
      if (input.animeId !== undefined) formData.append("animeId", String(input.animeId));
      if (input.episodeNumber !== undefined) formData.append("episodeNumber", String(input.episodeNumber));
      if (input.name !== undefined) formData.append("name", String(input.name));
      if (input.videoType) formData.append("videoType", input.videoType);
      if (input.videoUrl) formData.append("videoUrl", input.videoUrl);
      if (input.file) formData.append("file", input.file);

      const updated = await apiClient.updateEpisode(token, episodeId, formData);
      setEpisodes((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Cannot update episode.") };
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
      episodes,
      favorites,
      currentUser,
      isAdmin,
      getEpisodesByAnimeId: (animeId: number) => episodes.filter((e) => e.animeId === animeId),
      register,
      login,
      googleLogin,
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
      createEpisode,
      deleteEpisode,
      updateEpisode,
    }),
    [loading, users, movies, favorites, currentUser, isAdmin, episodes, createEpisode, deleteEpisode, updateEpisode],
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
