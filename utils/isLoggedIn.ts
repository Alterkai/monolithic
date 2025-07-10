import jwt from 'jsonwebtoken';

export default function isLoggedIn(token: any) {
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
  
  const JWT_SECRET = process.env.JWT_SECRET || "secretgoeshere,butthisshouldbechanged>:(";
  const decoded = jwt.verify(token, JWT_SECRET);
  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("id" in decoded)
  ) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
  return (decoded as jwt.JwtPayload).id;
}