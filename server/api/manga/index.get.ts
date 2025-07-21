// Manga Query (no ID provided, no need to retrieve genres?)
import { db } from "~/server/utils/db";
import validator from "validator";

export default defineEventHandler(async (event) => {
  let manga = [];
  let id = getQuery(event).id as string | undefined;
  let title = getQuery(event).title as string | undefined;

  // Retrieve all manga (no ID provided)
  if (
    id == "undefined" ||
    (id == undefined && !title) ||
    title == "undefined"
  ) {
    const result = await db.query(
      `
      SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga
      LIMIT 30`
    );
    manga = result.rows.map((m) => ({
      manga_id: m.id,
      manga_title: m.title,
      manga_original_title: m.original_title,
      manga_description: m.description,
      manga_author: m.author,
      manga_cover: m.cover,
      manga_ratings: m.ratings,
    }));
    return manga;
  }
  // Retrieve manga by ID
  else if (id && id != "undefined") {
    const result = await db.query(
      `
      SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga
      WHERE ID = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Manga not found",
      });
    }
    manga = result.rows.map((m) => ({
      manga_id: m.id,
      manga_title: m.title,
      manga_original_title: m.original_title,
      manga_description: m.description,
      manga_author: m.author,
      manga_cover: m.cover,
      manga_ratings: m.ratings,
    }));
    return manga[0];
  } else if (title && title != "undefined") {
    const result = await db.query(
      `
      SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga
      WHERE title ILIKE $1`,
      [`%${validator.escape(title)}%`]
    );
    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Manga not found",
      });
    }
    manga = result.rows.map((m) => ({
      manga_id: m.id,
      manga_title: m.title,
      manga_original_title: m.original_title,
      manga_description: m.description,
      manga_author: m.author,
      manga_cover: m.cover,
      manga_ratings: m.ratings,
    }))
    return manga;
  }
});
