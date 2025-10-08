import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const result = await db.query(`
    SELECT t.*,
      -- Generate a unique value per row based on ID and current date
      -- Use a hashing function like MD5 or SHA256 for better distribution
      MD5(t.manga_id::text || to_char(CURRENT_DATE, 'YYYYMMDD')) AS daily_sort_key
    FROM
        manga_latest_chapters_with_genres t
    ORDER BY
        daily_sort_key
    LIMIT 5;`);

  if (!result || result.rows.length === 0) {
    return [];
  }

  return result.rows.map((dh: any) => ({
    manga_id: dh.manga_id,
    manga_title: dh.manga_title,
    manga_author: dh.manga_author,
    manga_cover: dh.manga_cover,
    chapter_id: dh.chapter_number,
    manga_genres: dh.genres.map((g: any) => ({
      genre_name: g.name,
      genre_id: g.id,
    }))
  }));
});
