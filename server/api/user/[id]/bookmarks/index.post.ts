import { db } from "~/server/utils/db";
import getUserId from "~/utils/getUserId";

export default defineEventHandler(async (event) => {
  // Assuming the user is already authenticated
  // Auth is handled in the middleware

  const user_id = getUserId(getCookie(event, "auth-token") || null);
  const body = await readBody(event);
  let { manga_id, last_read_chapter_id } = body;

  if (!manga_id || !user_id || !last_read_chapter_id) {
    throw createError({
      statusCode: 400,
      message: "Manga ID and User ID are required",
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO bookmark (user_id, manga_id, last_read_chapter_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, manga_id) DO UPDATE SET
          last_read_chapter_id = EXCLUDED.last_read_chapter_id,
          date_added = NOW();
      `,
      [user_id, manga_id, last_read_chapter_id]
    );
  } catch (error) {
    console.error("Error processing bookmark request:", error);
    throw createError({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});
