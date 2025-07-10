import { db } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const mangaId = getRouterParam(event, 'mangaID');
  if (mangaId === undefined || mangaId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Manga ID',
    });
  }
  try {
    const result = await db.query(`
      SELECT total_views
      FROM manga_views
      WHERE manga_id = $1
      `, [parseInt(mangaId)]);
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching manga views:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
})