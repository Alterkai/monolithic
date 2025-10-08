import type {
  ApiResponse,
  ApiError,
  ApiOptions,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MangaCreateRequest,
  MangaUpdateRequest,
  MangaResponse,
  MangaListResponse,
  ChapterUploadRequest,
  ChapterResponse,
  CommentCreateRequest,
  CommentsResponse,
  CommentResponse,
  ViewIncrementRequest,
  ViewResponse,
  UserDetailResponse,
  UserBookmarksResponse,
  MangaViewsResponse,
} from "~/types";

import type { Manga } from "~/types/manga";

export class ApiClient {
  private baseUrl: string = "";

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || "";
  }

  /**
   * Generic API request method with type safety
   */
  private async request<T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {}, params } = options;

    // Build URL with query parameters
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Prepare request options
    const requestOptions: any = {
      method,
      headers: {
        ...headers,
      },
    };

    // Handle body for non-GET requests
    if (body && method !== "GET") {
      if (body instanceof FormData) {
        // Don't set Content-Type for FormData, let browser set it
        requestOptions.body = body;
      } else {
        requestOptions.headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify(body);
      }
    }

    try {
      const response = await $fetch<T>(url, requestOptions);
      return response;
    } catch (error: any) {
      // Transform fetch errors into our API error format
      const apiError: ApiError = {
        success: false,
        error: error.message || "An unexpected error occurred",
        statusCode: error.statusCode || 500,
      };
      throw apiError;
    }
  }

  // Auth endpoints
  auth = {
    /**
     * Login user
     */
    login: (data: LoginRequest): Promise<LoginResponse> => {
      return this.request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Register new user
     */
    register: (data: RegisterRequest): Promise<RegisterResponse> => {
      return this.request<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Logout current user
     */
    logout: (): Promise<ApiResponse> => {
      return this.request<ApiResponse>("/api/auth/logout", {
        method: "POST",
      });
    },

    /**
     * Get current user info
     */
    me: (): Promise<LoginResponse> => {
      return this.request<LoginResponse>("/api/auth/me");
    },
  };

  // Manga endpoints
  manga = {
    /**
     * Get all manga
     */
    getAll: (): Promise<Manga[]> => {
      return this.request<Manga[]>("/api/manga");
    },

    /**
     * Search manga by title
     */
    search: (title: string): Promise<Manga[]> => {
      return this.request<Manga[]>("/api/manga", {
        params: { title },
      });
    },

    /**
     * Get manga by ID
     */
    getById: (id: number): Promise<Manga> => {
      return this.request<Manga>(`/api/manga/${id}`);
    },

    /**
     * Create new manga
     */
    create: (data: MangaCreateRequest): Promise<MangaResponse> => {
      return this.request<MangaResponse>("/api/manga", {
        method: "POST",
        body: data,
      });
    },

    /**
     * Update manga
     */
    update: (id: number, data: MangaUpdateRequest): Promise<MangaResponse> => {
      return this.request<MangaResponse>(`/api/manga/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    /**
     * Delete manga
     */
    delete: (id: number): Promise<ApiResponse> => {
      return this.request<ApiResponse>(`/api/manga/${id}`, {
        method: "DELETE",
      });
    },

    /**
     * Get daily highlights
     */
    getDailyHighlights: (): Promise<any[]> => {
      return this.request<any[]>("/api/manga/daily-highlights");
    },

    /**
     * Get latest chapters
     */
    getLatestChapters: (): Promise<any[]> => {
      return this.request<any[]>("/api/manga/latest-chapters");
    },

    /**
     * Upload chapter images
     */
    uploadChapter: (
      mangaId: number,
      formData: FormData
    ): Promise<ApiResponse> => {
      return this.request<ApiResponse>(`/api/manga/${mangaId}/upload`, {
        method: "POST",
        body: formData,
      });
    },
  };

  // Chapter endpoints
  chapter = {
    /**
     * Get chapter data
     */
    get: (mangaId: number, chapterId: number): Promise<ChapterResponse> => {
      return this.request<ChapterResponse>(
        `/api/manga/${mangaId}/chapter/${chapterId}`
      );
    },

    /**
     * Delete chapter
     */
    delete: (mangaId: number, chapterId: number): Promise<ApiResponse> => {
      return this.request<ApiResponse>(`/api/manga/${mangaId}/${chapterId}`, {
        method: "DELETE",
      });
    },
  };

  // Comment endpoints
  comments = {
    /**
     * Get comments for manga or chapter
     */
    get: (mangaId: number, chapterId?: number): Promise<CommentsResponse> => {
      const endpoint = chapterId
        ? `/api/manga/${mangaId}/${chapterId}/comments`
        : `/api/manga/${mangaId}/comments`;
      return this.request<CommentsResponse>(endpoint);
    },

    /**
     * Create new comment
     */
    create: (
      mangaId: number,
      data: CommentCreateRequest,
      chapterId?: number
    ): Promise<CommentResponse> => {
      const endpoint = chapterId
        ? `/api/manga/${mangaId}/${chapterId}/comments`
        : `/api/manga/${mangaId}/comments`;
      return this.request<CommentResponse>(endpoint, {
        method: "POST",
        body: data,
      });
    },

    /**
     * Delete comment
     */
    delete: (
      mangaId: number,
      commentId: number,
      chapterId?: number
    ): Promise<ApiResponse> => {
      const endpoint = chapterId
        ? `/api/manga/${mangaId}/${chapterId}/comments/${commentId}`
        : `/api/manga/${mangaId}/comments/${commentId}`;
      return this.request<ApiResponse>(endpoint, {
        method: "DELETE",
      });
    },
  };

  // User endpoints
  user = {
    /**
     * Get user details
     */
    getById: (id: number): Promise<UserDetailResponse> => {
      return this.request<UserDetailResponse>(`/api/user/${id}`);
    },

    /**
     * Update user
     */
    update: (id: number, data: any): Promise<ApiResponse> => {
      return this.request<ApiResponse>(`/api/user/${id}`, {
        method: "PATCH",
        body: data,
      });
    },

    /**
     * Get user bookmarks
     */
    getBookmarks: (id: number): Promise<UserBookmarksResponse> => {
      return this.request<UserBookmarksResponse>(`/api/user/${id}/bookmarks`);
    },

    /**
     * Add bookmark
     */
    addBookmark: (userId: number, data: any): Promise<ApiResponse> => {
      return this.request<ApiResponse>(`/api/user/${userId}/bookmarks`, {
        method: "POST",
        body: data,
      });
    },

    /**
     * Remove bookmark
     */
    removeBookmark: (userId: number, mangaId: number): Promise<ApiResponse> => {
      return this.request<ApiResponse>(
        `/api/user/${userId}/bookmarks/${mangaId}`,
        {
          method: "DELETE",
        }
      );
    },

    /**
     * Get bookmark by manga ID
     */
    getBookmarkByManga: (userId: number, mangaId: number): Promise<any> => {
      return this.request<any>(`/api/user/${userId}/bookmarks/${mangaId}`);
    },
  };

  // Views endpoints
  views = {
    /**
     * Get manga views
     */
    getMangaViews: (mangaId: number): Promise<MangaViewsResponse> => {
      return this.request<MangaViewsResponse>(`/api/views/${mangaId}`);
    },

    /**
     * Increment manga views
     */
    incrementMangaViews: (mangaId: number): Promise<ViewResponse> => {
      return this.request<ViewResponse>(`/api/views/${mangaId}`, {
        method: "POST",
      });
    },

    /**
     * Increment chapter views
     */
    incrementChapterViews: (
      mangaId: number,
      chapterId: number
    ): Promise<ViewResponse> => {
      return this.request<ViewResponse>(`/api/views/${mangaId}/${chapterId}`, {
        method: "POST",
      });
    },

    /**
     * Get chapter views
     */
    getChapterViews: (
      mangaId: number,
      chapterId: number
    ): Promise<ViewResponse> => {
      return this.request<ViewResponse>(`/api/views/${mangaId}/${chapterId}`);
    },
  };
}

// Create singleton instance
export const apiClient = new ApiClient();

// Default export for easy importing
export default apiClient;
