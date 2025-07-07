// Read the manga chapters
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
    `SELECT * FROM chapter_with_images
     WHERE chapter_manga_id = $1 AND chapter_number = $2`,
    [manga_id, chapter_id]
  );

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Chapter not found',
    });
  }

  const c = result.rows[0];
  return {
    chapter: c.chapter_number,
    name: c.chapter_name,
    date_added: c.chapter_date_added,
    images: c.images.map((image: any) => ({
      id: image.id,
      link: image.link,
      order: image.page_number,
    })),
  };
})