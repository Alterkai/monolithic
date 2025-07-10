import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  let manga_id = getRouterParam(event, "mangaID") as string | undefined;

  if (!manga_id) {
    throw createError({
      statusCode: 400,
      message: "Manga ID is required",
    });
  }

  const result = await db.query(
    `SELECT comments FROM manga_with_comments
     WHERE manga_id = $1`,
    [manga_id]
  );
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Manga comments not found",
    });
  }

  return result.rows[0].comments.map((comment: any) => ({
    id: comment.id,
    comment: comment.comment,
    user_id: comment.user_id,
    username: comment.user_name,
    date_added: comment.date_added,
  }));
});
