import { db } from '~/server/utils/db';
import { Manga } from '~/types/database'

export default defineEventHandler(async (event) => {
  let id = getQuery(event).id as string | undefined;
  let manga: Manga[] = [];

  // Retrieve all manga (no ID provided)
  if (id == "undefined" || id == undefined) {
    const result = await db.query(
      `
      SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga`
    )
    manga = result.rows;
  }
  
  else {
    // Retrieve manga by ID
    // Also retrieve all chapters
    const result = await db.query(
      `SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga
      WHERE id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Manga not found",
      });
    }
    manga = result.rows;
  }

  return manga.map(m => ({
    id: m.ID,
    title: m.title,
    original_title: m.original_title,
    description: m.description,
    author: m.author,
    cover: m.cover,
    ratings: m.ratings
  }));
})