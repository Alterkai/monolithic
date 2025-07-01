// Tipe kustom yang dibuat dari ENUM di PostgreSQL
export type TaskStatus = "pending" | "in_progress" | "completed";

// Table: role
export interface Role {
  ID: number;
  name: string;
  description?: string | null;
}

// Table: users
export interface User {
  ID: number;
  avatar?: string | null;
  username: string;
  name: string;
  email: string;
  password: string; // Di aplikasi, sebaiknya jangan pernah ekspos field ini ke client
  status: boolean;
  date_joined: Date;
}

// Table: user_role (Junction Table)
export interface UserRole {
  user_ID: number;
  role_ID: number;
}

// Table: manga
export interface Manga {
  ID: number;
  title: string;
  original_title?: string | null;
  description: string;
  author: string;
  cover: string;
  ratings: number; // Tipe NUMERIC di-mapping ke number
}

// Table: genre
export interface Genre {
  ID: number;
  name: string;
}

// Table: manga_genre (Junction Table)
export interface MangaGenre {
  manga_ID: number;
  genre_ID: number;
}

// Table: chapter
export interface Chapter {
  ID: number;
  number: number; // Tipe NUMERIC di-mapping ke number
  name?: string | null;
  date_added: Date;
  manga_ID: number;
}

// Table: image
export interface Image {
  ID: number; // BIGINT bisa di-mapping ke number jika tidak melebihi batas, atau string/bigint
  page_number: number;
  link: string;
  chapter_ID: number;
}

// Table: bookmark
export interface Bookmark {
  ID: number;
  last_read_chapter_id: number;
  date_added: Date;
  user_ID: number;
  manga_ID: number;
}

// Table: manga_comments
export interface MangaComment {
  ID: number; // BIGINT bisa di-mapping ke number atau string/bigint
  comment: string;
  date_added: Date;
  manga_ID: number;
  user_ID: number;
}

// Table: chapter_comments
export interface ChapterComment {
  ID: number; // BIGINT bisa di--mapping ke number atau string/bigint
  comment: string;
  date_added: Date;
  chapter_ID: number;
  user_ID: number;
}

// Table: salary
export interface Salary {
  ID: number;
  payment_date: Date;
  amount: number; // Tipe NUMERIC di-mapping ke number
  user_ID: number;
}

// Table: task
export interface Task {
  ID: number;
  date_added: Date;
  status: TaskStatus;
  user_ID: number;
  manga_ID: number;
}