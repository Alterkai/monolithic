// URL: /api/user/bookmarks
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, "id") as string | undefined;

  try {
    const result = await db.query(
      `
      SELECT * FROM bookmark_with_manga
      WHERE user_id = $1
      `,
      [id]
    );
    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Bookmarks not found",
      });
    }
    return result.rows.map(b => ({
      manga_id: b.manga_id,
      manga_title: b.manga_title,
      chapter_last_read: b.last_read_chapter,
      chapter_date_added: b.date_added,
    }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw createError({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});
