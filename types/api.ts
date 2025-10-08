// Standard API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: number;
  username: string;
  isStaff: boolean;
  roles: string[];
  avatar: string;
}

export interface LoginResponse extends ApiResponse {
  user?: AuthUser;
}

export interface RegisterResponse extends ApiResponse {
  user?: AuthUser;
}

// User Types
export interface Role {
  id: number;
  name: string;
}

export interface UserDetail {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  roles: Role[];
  date_joined: Date;
}

export interface UserBookmark {
  last_read_chapter: number;
  date_added: Date;
  user_id: number;
  manga_id: number;
  manga_title: string;
  manga_cover: string;
}

export interface UserDetailResponse extends ApiResponse {
  user?: UserDetail;
}

export interface UserBookmarksResponse extends ApiResponse {
  data?: UserBookmark[];
}

// Manga Types
export interface MangaCreateRequest {
  manga_title: string;
  manga_original_title: string;
  manga_description: string;
  manga_author: string;
  manga_cover: string;
  manga_genres: number[];
}

export interface MangaUpdateRequest extends Partial<MangaCreateRequest> {
  manga_id: number;
}

export interface MangaResponse extends ApiResponse {
  manga?: import("./manga").Manga;
}

export interface MangaListResponse extends ApiResponse {
  data?: import("./manga").Manga[];
}

export interface MangaFetchData {
  mangaDetails: import("./manga").Manga;
  total_views: number;
}

export interface MangaViewsResponse {
  total_views: number;
}

// Chapter Types
export interface ChapterImage {
  id: number;
  link: string;
  order: number;
}

export interface ChapterData {
  title: string;
  chapter: number;
  name: string;
  date_added: Date;
  images: ChapterImage[];
  nextChapter: number | null;
  prevChapter: number | null;
}

export interface ChapterResponse extends ApiResponse {
  data?: ChapterData;
}

export interface ChapterUploadRequest {
  mangaID: number;
  chapterName: string;
  chapterNumber: number;
  images: File[];
}

// Comment Types
export interface Comment {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  user_avatar: string; // Legacy field for compatibility
  comment: string;
  date_added: Date;
  is_edited: boolean;
  manga_id?: number;
  chapter_id?: number;
}

export interface CommentCreateRequest {
  comment: string;
  manga_id?: number;
  chapter_id?: number;
}

export interface CommentsResponse extends ApiResponse {
  data?: Comment[];
}

export interface CommentResponse extends ApiResponse {
  data?: Comment;
}

// View Types
export interface ViewIncrementRequest {
  manga_id: number;
  chapter_id?: number;
}

export interface ViewResponse extends ApiResponse {
  views?: number;
}

// Error Types
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// Generic API Options
export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}
