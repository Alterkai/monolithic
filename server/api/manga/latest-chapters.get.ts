import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const result = await db.query(
    `
    SELECT manga_id, manga_title, manga_cover, chapter_number, chapter_name, chapter_date_added
    FROM manga_latest_chapters
    ORDER BY chapter_date_added DESC
    LIMIT 20`
  );

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "No recent chapters found",
    });
  }

  return result.rows;
})