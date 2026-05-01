import { Favorite, Movie, PageResult, User, Episode, Review } from "@/lib/types";

// const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1").replace(/\/$/, "");

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiEnvelope<T> = {
  code: number;
  message: string;
  result: T;
};

export class ApiError extends Error {
  status: number;
  code?: number;

  constructor(message: string, status: number, code?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new ApiError(data?.message || `Request failed (${response.status})`, response.status, data?.code);
  }

  if (data && "result" in data) {
    return data.result;
  }

  return data as unknown as T;
}

export function decodeJwt(token: string): { sub?: string; role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as { sub?: string; role?: string };
  } catch {
    return null;
  }
}

export type LoginRequest = {
  accountName: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: "ADMIN" | "USER";
  avatarUrl?: string;
};

export type AnimeQuery = {
  page?: number;
  size?: number;
  search?: string;
  genre?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

function toQueryString(query: AnimeQuery) {
  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.size !== undefined) params.set("size", String(query.size));
  if (query.search) params.set("search", query.search);
  if (query.genre) params.set("genre", query.genre);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortDir) params.set("sortDir", query.sortDir);
  return params.toString();
}

export const apiClient = {
  register(payload: RegisterRequest) {
    return request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginRequest) {
    return request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  googleLogin(token: string) {
    return request<{ token: string }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  getCurrentUser(token: string) {
    return request<User>("/users/me", {
      method: "GET",
      token,
    });
  },

  updateCurrentUser(token: string, formData: FormData) {
    return request<User>("/users/me", {
      method: "PUT",
      body: formData,
      token,
    });
  },

  getUsers(token: string, page = 0, size = 100) {
    return request<PageResult<User>>(`/users/all?page=${page}&size=${size}`, {
      method: "GET",
      token,
    });
  },

  createUser(token: string, payload: CreateUserRequest | FormData) {
    const body = payload instanceof FormData ? payload : JSON.stringify(payload);
    return request<User>("/auth/create", {
      method: "POST",
      body,
      token,
    });
  },

  updateUser(token: string, userId: string, formData: FormData) {
    return request<User>(`/users/${userId}`, {
      method: "PUT",
      body: formData,
      token,
    });
  },

  deleteUser(token: string, userId: string) {
    return request<string>(`/users/${userId}`, {
      method: "DELETE",
      token,
    });
  },

  getAnime(query: AnimeQuery = {}) {
    const queryString = toQueryString(query);
    return request<PageResult<Movie>>(`/anime${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  getAnimeById(id: number) {
    return request<Movie>(`/anime/${id}`, {
      method: "GET",
    });
  },

  getEpisodesByAnimeId(id: number) {
    return request<Episode[]>(`/anime/${id}/episodes`, {
      method: "GET",
    });
  },

  getReviewsByAnimeId(id: number) {
    return request<Review[]>(`/anime/${id}/reviews`, {
      method: "GET",
    });
  },

  createReview(token: string, animeId: number, payload: { rating: number; content?: string }) {
    return request<Review>(`/anime/${animeId}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },

  updateReview(token: string, animeId: number, reviewId: number, payload: { rating: number; content?: string }) {
    return request<Review>(`/anime/${animeId}/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    });
  },

  deleteReview(token: string, animeId: number, reviewId: number) {
    return request<string>(`/anime/${animeId}/reviews/${reviewId}`, {
      method: "DELETE",
      token,
    });
  },

  requestPasswordReset(email: string) {
    return request<string>(`/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp(email: string, otp: number) {
    return request<string>(`/auth/verify-otp`, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  changePassword(resetToken: string, newPassword: string) {
    return request<string>(`/auth/change-password`, {
      method: "POST",
      body: JSON.stringify({ resetToken, newPassword }),
    });
  },

  createAnime(token: string, formData: FormData) {
    return request<Movie>("/anime", {
      method: "POST",
      body: formData,
      token,
    });
  },

  updateAnime(token: string, animeId: number, formData: FormData) {
    return request<Movie>(`/anime/${animeId}`, {
      method: "PUT",
      body: formData,
      token,
    });
  },

  deleteAnime(token: string, animeId: number) {
    return request<string>(`/anime/${animeId}`, {
      method: "DELETE",
      token,
    });
  },

  getFavorites(token: string) {
    return request<Favorite[]>("/favorites/all", {
      method: "GET",
      token,
    });
  },

  addFavorite(token: string, animeId: number) {
    return request<Favorite>("/favorites", {
      method: "POST",
      body: JSON.stringify({ animeId }),
      token,
    });
  },

  removeFavorite(token: string, animeId: number) {
    return request<string>(`/favorites/${animeId}`, {
      method: "DELETE",
      token,
    });
  },
  // Episodes
  getAllEpisodes(token: string) {
    return request<Episode[]>("/episodes/all", {
      method: "GET",
      token,
    });
  },

  createEpisode(token: string, formData: FormData) {
    return request<Episode>("/episodes", {
      method: "POST",
      body: formData,
      token,
    });
  },

  updateEpisode(token: string, episodeId: number, formData: FormData) {
    return request<Episode>(`/episodes/${episodeId}`, {
      method: "PUT",
      body: formData,
      token,
    });
  },

  deleteEpisode(token: string, episodeId: number) {
    return request<string>(`/episodes/${episodeId}`, {
      method: "DELETE",
      token,
    });
  },
};
export function getMediaUrl(path?: string | null): string {
  if (!path) return "https://api.dicebear.com/6.x/identicon/svg?seed=animeplay-default";
  if (path.startsWith("http")) return path;

  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${safePath}`;
}
