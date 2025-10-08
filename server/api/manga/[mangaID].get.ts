// Manga with Params
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, "mangaID");
  let manga = [];

  // Retrieve manga by ID
  // Also retrieve all chapters
  const result = await db.query(
    `SELECT * FROM manga_with_chapters
    WHERE manga_id = $1`,
    [id]
  );
  const mangaGenre = await db.query(
    `
    SELECT g.name FROM manga_genre
    JOIN genre g ON manga_genre.genre_id = g.ID
    WHERE manga_genre.manga_id = $1`,
    [id]
  );
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Manga not found",
    });
  }
  manga = result.rows[0];

  return {
    manga_id: manga.manga_id,
    manga_title: manga.manga_title,
    manga_original_title: manga.manga_original_title,
    manga_description: manga.manga_description,
    manga_author: manga.manga_author,
    manga_cover: manga.manga_cover,
    manga_ratings: manga.manga_ratings,
    manga_genres: mangaGenre.rows.map((g: any) => ({
      genre_name: g.name
    })),
    manga_chapters: manga.chapters.map((chapter: any) => ({
      chapter_id: chapter.number,
      chapter_name: chapter.name,
      chapter_date_added: chapter.date_added,
      chapter_views: chapter.views
    })),
  };
});
