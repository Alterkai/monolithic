import isAdmin from "~/utils/isAdmin";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url || "";

  // Only admin can access staff routes
  if (url.startsWith("/api/staff")) {
    isAdmin(getCookie(event, "auth-token"));
  }

  // Only admins may patch user data
  if (method === "PATCH" && url.startsWith("/api/user/")) {
    isAdmin(getCookie(event, "auth-token"));
  }

  // Only admins can POST new manga or DELETE manga
  if (
    (method === "POST" && url === "/api/manga") ||
    (method === "DELETE" && url.startsWith("/api/manga/"))
  ) {
    isAdmin(getCookie(event, "auth-token"));
  }

  // Only admins can POST new chapters (upload)
  if (method === "POST" && url.includes("/upload")) {
    isAdmin(getCookie(event, "auth-token"));
  }

  // Only admins can DELETE comments
  if (method === "DELETE" && url.includes("/comments")) {
    isAdmin(getCookie(event, "auth-token"));
  }
});
