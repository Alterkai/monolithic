import { db } from "~/utils/db";

export default defineEventHandler(async (event) => {
  // Validate access roles
  // Only allow access to role "Admin"
  // Already handled in middleware/admin.ts

  let userID = getRouterParam(event, "id") as string | undefined;
  const body = await readBody(event);
  const { username, name, avatar, role } = body;

  // Validate if user exists
  const userCheck = await db.query(
    `
    SELECT id FROM users
    WHERE id = $1`,
    [userID]
  );
  if (userCheck.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  // --- 1. Change User Role ---
  if (role) {
    // To Update Role:
    // Assuming role sent is the final.
    // Meaning all previous roles are removed and only the new role is set.
    await db.query(
      `
      DELETE FROM user_role
      WHERE user_id = $1;
      INSERT INTO user_role (user_id, role)
      VALUES ($2, $3);`,
      [userID, userID, role]
    );
  }

  // --- 2. Change User "Name" ---
  if (name) {
    await db.query(
      `
      UPDATE users
      SET name = $1
      WHERE id = $2;`,
      [name, userID]
    );
  }
});
