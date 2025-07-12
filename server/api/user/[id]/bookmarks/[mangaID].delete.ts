import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const mangaId = getRouterParam(event, "mangaID");
  const userId = getRouterParam(event, "id");

  if (!mangaId || !userId) {
    throw createError({
      statusCode: 400,
      message: "Manga ID and User ID are required",
    });
  }

  try {
    const result = await db.query(
      `
      DELETE FROM bookmark
      WHERE user_id = $1 AND manga_id = $2
      `,
      [userId, mangaId]
    );

    if (result.rowCount === 0) {
      throw createError({
        statusCode: 404,
        message: "Bookmark not found",
      });
    }

    return { message: "Bookmark deleted successfully" };
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    throw createError({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
})