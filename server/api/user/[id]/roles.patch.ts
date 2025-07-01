import { db } from '~/server/utils/db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const userID = getRouterParam(event, 'id');

  // Validate access roles
  // Only allow access to role "Admin"
  const token = getCookie(event, 'auth-token');
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'secretgoeshere,butthisshouldbechanged>:(';
  const decoded = jwt.verify(token, JWT_SECRET);

  // Reject if decoded isn't valid/not an object
  if (typeof decoded !== 'object' || decoded === null || !('role' in decoded) || !Array.isArray(decoded.role)) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // Reject if user don't have Admin role
  if (!decoded.role.includes('Admin')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    });
  }

  const body = await readBody(event);
  const { username, name, avatar, role } = body;

  // Change user role
  if (role) {
    // Validate if user exists
    const userCheck = await db.query(
      `
      SELECT id FROM users
      WHERE id = $1`,
      [userID]
    )
    if (userCheck.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
    } else {
      // Update user role
      await db.query(
        // TODO LIST
        // 1. Add Role
        // 2. Remove Role
        // 3. Update Role
        `
        UPDATE user_role
        SET role_id = (SELECT id FROM role WHERE name = $1)
        WHERE user_ID = $2`,
        [role, userID]
      );
    }
  }
})