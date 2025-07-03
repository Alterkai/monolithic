// Manga Query (no ID provided, no need to retrieve genres?)
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  let manga = [];
  let id = getQuery(event).id as string | undefined;

  // Retrieve all manga (no ID provided)
  if (id == "undefined" || id == undefined) {
    const result = await db.query(
      `
      SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga`
    );
    manga = result.rows;
    return manga
  } 
  // Retrieve manga by ID
  else {
    const result = await db.query(
      `
      SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga
      WHERE ID = $1`,
      [id]
    )
    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Manga not found",
      });
    }
    manga = result.rows;
    return manga[0]
  }
});
