import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, original_title, description, author, cover, ratings, genre } =
    body;

  // Basic validation for required fields
  if (
    !title ||
    !description ||
    !author ||
    !cover ||
    typeof ratings !== "number" ||
    !genre ||
    !Array.isArray(genre)
  ) {
    throw createError({
      statusCode: 400,
      message: "Missing or invalid data for manga creation.",
    });
  }

  let client;

  try {
    client = await db.connect(); // Get a dedicated client from the pool
    await client.query("BEGIN;"); // Start the transaction
    await client.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;"); // Strongest isolation level

    // Insert manga and get its ID
    const insertMangaResult = await client.query(
      `INSERT INTO manga (title, original_title, description, author, cover, ratings)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [title, original_title, description, author, cover, ratings]
    );

    if (insertMangaResult.rows.length === 0) {
      throw new Error("Failed to retrieve new manga ID.");
    }
    const mangaId = insertMangaResult.rows[0].id; // New manga ID

    // Add genres for the new manga
    for (const genreName of genre) {
      await client.query(`SELECT add_manga_genre($1, $2)`, [
        mangaId,
        genreName,
      ]);
    }

    await client.query("COMMIT;"); // Commit the transaction

    return {
      statusCode: 201,
      message: "Manga and genres added successfully!",
      mangaId: mangaId,
    };
  } catch (error: any) {
    if (client) {
      await client.query("ROLLBACK;"); // Rollback on error
    }
    console.error("Error adding manga and genres:", error);

    throw createError({
      statusCode: 500,
      message: "Failed to add manga and genres due to a database error.",
      data: error.message,
    });
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
});
