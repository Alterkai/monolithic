import { db } from "~/server/utils/db";
import validator from "validator";
import * as argon2 from "argon2";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let { username, name, email, password } = body;

  if (!username || !name || !email || !password) {
    throw createError({ statusCode: 400, message: "All fields are required" });
  }

  // Validate input
  username = validator.escape(username);
  name = validator.escape(name);
  email = validator.normalizeEmail(email);
  password = await argon2.hash(password);

  if (!validator.isEmail(email)) {
    throw createError({ statusCode: 400, message: "Invalid email format" });
  }

  // Save to database
  try {
    const result = await db.query(
      `
      INSERT INTO users (username, name, email, password)
      VALUES ($1, $2, $3, $4)`,
      [username, name, email, password]
    );

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error("Database error:", error);
  }
});
