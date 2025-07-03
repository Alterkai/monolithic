export default defineEventHandler(async (event) => {
  let manga_id = getRouterParam(event, "mangaID") as string | undefined;
  let chapter_id = getRouterParam(event, "chapterID") as string | undefined;

  const result = await db.query(
    `DELETE FROM chapter WHERE chapter_manga_id = $1 AND chapter_number = $2 RETURNING id`,
    [manga_id, chapter_id])
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Chapter not found",
    });
  }
  return {
    message: "Chapter deleted successfully",
    id: result.rows[0].id,
  };
})