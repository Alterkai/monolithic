/**
 * @summary Add a comment to a specific chapter of a manga.
 * @description This endpoint allows users to add comments to a specific chapter of a manga. 
 * It requires the user to be authenticated via a JWT token stored in a cookie named 'auth-token'. 
 * The comment is associated with the user ID extracted from the token.
 *
 * @param {string} mangaID - Manga ID, extracted from the route parameters.
 * @param {string} chapterID - Chapter ID, extracted from the route parameters.
 *
 * @body {{ comment: string }} - The comment to be added.
 *
 * @returns {200, { id: number, message: string }} - Returns an object containing the ID of the newly added comment and a success message.
 */

import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  let manga_id = getRouterParam(event, "mangaID") as string | undefined;
  let chapter_id = getRouterParam(event, "chapterID") as string | undefined;

  if (!manga_id || !chapter_id) {
    throw createError({
      statusCode: 400,
      message: "Manga ID and Chapter ID are required",
    });
  }

  // Read request body
  const body = await readBody(event);
  let { comment } = body;

  // get user ID from JWT token
  let userID = "";
  const token = getCookie(event, "auth-token");
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Authentication token is required",
    });
  }

  let decoded = null;
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("Configuration Incomplete: JWT_SECRET is not set");
    }
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw createError({
      statusCode: 401,
      message: "Invalid authentication token",
    });
  }

  if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
    userID = (decoded as jwt.JwtPayload).id;
  } else {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!comment || !userID) {
    throw createError({
      statusCode: 400,
      message: "Comment and User ID are required",
    });
  }

  // Insert to database
  const result = await db.query(
    `INSERT INTO chapter_comments (comment, user_ID, chapter_ID)
      VALUES ($1, $2,
        (SELECT c.ID
         FROM chapter c
         WHERE c.manga_ID = $3 AND c.number = $4)
      ) RETURNING id`,
    [comment, userID, manga_id, chapter_id]
  );

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 500,
      message: "Failed to add comment",
    });
  }

  return {
    id: result.rows[0].id,
    message: "Comment added successfully",
  };
});
