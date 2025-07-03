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
    id: manga.manga_id,
    title: manga.manga_title,
    original_title: manga.manga_original_title,
    description: manga.manga_description,
    author: manga.manga_author,
    cover: manga.manga_cover,
    ratings: manga.manga_ratings,
    genre: mangaGenre.rows.map((g: any) => g.name),
    chapters: manga.chapters.map((chapter: any) => ({
      id: chapter.id,
      name: chapter.name,
      number: chapter.number,
      date_added: chapter.date_added,
    })),
  };
  }
);
