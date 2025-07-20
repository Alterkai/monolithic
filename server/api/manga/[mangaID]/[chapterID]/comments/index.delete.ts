/**
 * @summary Delete a user's comment.
 * @description Deletes a specific comment. This endpoint requires the user to be authenticated.
 * A user can only delete their own comments.
 *
 * @param {string} mangaID - The ID of the manga (used for URL structure, not in logic).
 * @param {string} chapterID - The ID of the chapter (used for URL structure, not in logic).
 *
 * @body {{ commentId: number }} - The request body must be a JSON object containing the ID of the comment to be deleted.
 *
 * @returns {200, { message: string }} - On success, returns a confirmation message.
 * @returns {400} - If the commentId is missing from the request body.
 * @returns {401} - If the user is not authenticated or the token is invalid.
 * @returns {403} - If the user tries to delete a comment that does not exist or does not belong to them.
 * @returns {500} - For any other server-side errors.
 */

import jwt from "jsonwebtoken";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  // 1. Get User ID from JWT token (Authentication)
  const token = getCookie(event, "auth-token");
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Authentication token is required",
    });
  }

  let userID: string;
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("Server configuration error: JWT_SECRET is not set.");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      userID = (decoded as jwt.JwtPayload).id;
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw createError({
      statusCode: 401,
      message: "Invalid or expired authentication token",
    });
  }

  // 2. Read comment ID from request body
  const body = await readBody(event);
  const { commentId } = body;

  if (!commentId) {
    throw createError({
      statusCode: 400,
      message: "Comment ID is required in the request body.",
    });
  }

  // 3. Delete from database, ensuring the user owns the comment
  try {
    const result = await db.query(
      `DELETE FROM chapter_comments
       WHERE id = $1 AND user_ID = $2`,
      [commentId, userID]
    );

    // Check if any row was actually deleted
    if (result.rowCount === 0) {
      // This happens if the comment doesn't exist OR the user doesn't own it.
      // For security, we don't tell the user which one it is.
      throw createError({
        statusCode: 403, // Forbidden
        message: "Comment not found or you do not have permission to delete it.",
      });
    }

    return {
      message: "Comment deleted successfully",
    };
  } catch (error: any) {
    // Re-throw specific errors, otherwise throw a generic 500
    if (error.statusCode) {
      throw error;
    }
    console.error("Error deleting comment:", error);
    throw createError({
      statusCode: 500,
      message: "An unexpected error occurred while deleting the comment.",
    });
  }
});
