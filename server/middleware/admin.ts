import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url;

  if (method === 'PATCH' && url === '/api/user') {
    
    // Validate access roles
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
        message: 'Unauthorized',
      });
    }

  }
})