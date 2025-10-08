export default defineEventHandler(async (event) => {
  let manga_id = getRouterParam(event, "mangaID") as string | undefined;
  if (!manga_id) {
    throw createError({
      statusCode: 400,
      message: "Manga ID is required",
    });
  }

  const result = await db.query(
    `DELETE FROM manga WHERE id = $1 RETURNING id`,
    [manga_id]
  )
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Manga not found",
    });
  }

  return {
    message: "Manga deleted successfully",
    manga_id: result.rows[0].id,
  };
})