import { db } from "~/server/utils/db";
import validator from "validator";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  // Validate input
  email = validator.normalizeEmail(email);

  // Validate Credentials
  try {
    // Check users
    const result = await db.query(
      `
      SELECT id, username, name, email, password, avatar FROM users
      WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password!",
      });
    }

    const users = result.rows[0];
    const isPasswordValid = await argon2.verify(users.password, password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password!",
      });
    }

    // Retrieve user role
    const userRoleQuery = await db.query(
      `
      SELECT r.name FROM users u
      JOIN user_role ur ON u.id = ur.user_ID
      JOIN role r ON ur.role_id = r.id
      WHERE u.email = $1`,
      [email]
    );

    let role = [];
    if (userRoleQuery.rows.length > 0) {
      role = userRoleQuery.rows.map((role) => role.name);
    }

    // Check if staff
    let isStaff = false;
    const staffRoles = [
      "Founder",
      "Admin",
      "Typesetter",
      "Translator",
      "Quality Control",
      "Cleaner",
      "Redrawer",
    ];
    isStaff = role.some((r) => staffRoles.includes(r));

    // ---- Login Successfull, return user data
    // JWT
    const payload = {
      id: users.id,
      username: users.username,
      email: users.email,
      staff: isStaff,
      roles: role,
    };
    const JWT_SECRET =
      process.env.JWT_SECRET || `secretgoeshere,butthisshouldbechanged>:(`;
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "3d", // 3 days
    });

    // COOKIE
    setCookie(event, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 3, // 3 days
    });

    // ---- Success
    return {
      success: true,
      message: "Login Successful",
      user: {
        id: users.id,
        username: users.username,
        name: users.name,
        email: users.email,
        roles: role,
        isStaff: isStaff,
        avatar: users.avatar
      },
    };
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: 401,
      message: "Invalid email or password!",
    });
  }
});
