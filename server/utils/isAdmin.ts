import jwt from "jsonwebtoken";

export default function isAdmin(token: any) {
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
  const JWT_SECRET =
    process.env.JWT_SECRET || "secretgoeshere,butthisshouldbechanged>:(";
  const decoded = jwt.verify(token, JWT_SECRET);
  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("role" in decoded) ||
    !Array.isArray(decoded.role)
  ) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
  if (!decoded.role.includes("Admin")) {
    throw createError({
      statusCode: 403,
      message: "Unauthorized",
    });
  }
}