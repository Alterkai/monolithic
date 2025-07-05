import { db } from '~/server/utils/db';
import jwt from 'jsonwebtoken';
import { User } from '~/types/database';

export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, 'id') as string | undefined;
  let user: User;

  // Get Current User Profile
  // if param isn't defined, get from JWT Token
  if (id == "undefined" || id == undefined) {
    const token = getCookie(event, "auth-token");
    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Decode JWT Token
    let decoded = null;
    try {
      const JWT_SECRET =
        process.env.JWT_SECRET || "secretgoeshere,butthisshouldbechanged>:(";
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("JWT verification failed:", error);
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get ID from JWT Token
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      id = (decoded as jwt.JwtPayload).id;
    } else {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }
    const result = await db.query(
      `
      SELECT id, username, name, email, avatar, date_joined, roles
      FROM user_with_roles
      WHERE id = $1`,
      [id]
    );
    user = result.rows[0];
  } else {
    // Get User Profile by ID
    // Open to Public -- No need for Authentication
    const result = await db.query(
      `
      SELECT id, username, name, email, avatar, date_joined, roles
      FROM user_with_roles
      WHERE id = $1`,
      [id]
    );
    user = result.rows[0];
  }
  return {
    success: true,
    user: user || {},
  };
});