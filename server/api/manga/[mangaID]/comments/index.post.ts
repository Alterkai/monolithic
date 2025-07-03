import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  let manga_id = getRouterParam(event, 'mangaID') as string | undefined;
  if (!manga_id) {
    throw createError({
      statusCode: 400,
      message: 'Manga ID is required',
    });
  }

  // Get user ID from JWT Token
  const token = getCookie(event, 'auth-token');
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication token is required',
    });
  }

  let userID = "";
  let decoded = null;
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "secretgoeshere,butthisshouldbechanged>:(";
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw createError({
      statusCode: 401,
      message: 'Invalid authentication token',
    });
  }
  if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
    userID = (decoded as jwt.JwtPayload).id;

    // Read request body
    const body = await readBody(event);
    let { comment } = body;

    if (!comment || !userID) {
      throw createError({
        statusCode: 400,
        message: 'Comment and User ID are required',
      });
    }

    // Insert comment into database
    const result = await db.query(
      `INSERT INTO manga_comments (comment, user_id, manga_id)
       VALUES ($1, $2, $3) RETURNING id`,
      [comment, userID, manga_id]
    );

    return { id: result.rows[0].id };
  } else {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
})