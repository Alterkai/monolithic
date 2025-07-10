import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const mangaID = getRouterParam(event, "mangaID") as string | undefined;
  const userId = getRouterParam(event, "id") as string | undefined;

  if (!mangaID || !userId) {
    throw createError({
      statusCode: 400,
      message: "Manga ID and User ID are required",
    });
  }

  try {
    const result = await db.query(
      `
      SELECT * FROM bookmark_with_manga
      WHERE user_id = $1 AND manga_id = $2
      `,
      [userId, mangaID]
    );

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Bookmark not found",
      });
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    throw createError({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});
