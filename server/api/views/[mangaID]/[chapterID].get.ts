import { db } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const mangaId = getRouterParam(event, 'mangaID');
  const chapterId = getRouterParam(event, 'chapterID');
  if (mangaId === undefined || mangaId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Manga ID',
    });
  }
  if (chapterId === undefined || chapterId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Chapter ID',
    });
  }
  try {
    const result = await db.query(`
      SELECT total_views
      FROM chapter_views
      WHERE manga_id = $1 AND chapter_id = $2
      `, [parseInt(mangaId), parseInt(chapterId)]);
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching chapter views:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
})