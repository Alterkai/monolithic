export default defineEventHandler(async (event) => {
  let manga_id = getRouterParam(event, 'mangaID') as string | undefined;
  let chapter_id = getRouterParam(event, 'chapterID') as string | undefined;

  if (!manga_id || !chapter_id) {
    throw createError({
      statusCode: 400,
      message: 'Manga ID and Chapter ID are required',
    });
  }

  // ChapterID (params) == chapter_number (db)
  const result = await db.query(
    `SELECT comments FROM chapter_with_comments
     WHERE chapter_manga_id = $1 AND chapter_number = $2`,
    [manga_id, chapter_id]
  )
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Chapter comments not found',
    });
  }

  // Results will always return single row
  // Doesn't need to map through rows
  const comments = result.rows[0].comments;
  return comments.map((comment: any) => ({
    id: comment.id,
    comment: comment.comment,
    user_id: comment.user_id,
    username: comment.user_name,
    date_added: comment.date_added,
  }));
})