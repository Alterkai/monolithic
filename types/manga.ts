export interface Manga {
  manga_id: number;
  manga_title: string;
  manga_original_title: string;
  manga_description: string;
  manga_author: string;
  manga_cover: string;
  manga_ratings: number;
  manga_genres?: Genre[];
  manga_chapters?: Chapter[];
  manga_views?: number;
}

export interface Genre {
  genre_id: number;
  genre_name: string;
}

export interface Chapter {
  // Chapter_id: chapter_number in database.
  // To look for certain chapter from a manga, 
  // do a lookout using (SQL) chapter.number + manga.id combo.
  chapter_id: number;
  chapter_name: string;
  chapter_date_added: Date;
  chapter_views: number;
}
