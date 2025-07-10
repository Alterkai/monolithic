import isLoggedIn from "~/utils/isLoggedIn";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url || "";

  // Allow all auth routes
  if (url.startsWith("/api/auth")) {
    return;
  }

  // Only logged-in users can POST comments
  if (method === "POST" && url.includes("/comments")) {
   isLoggedIn(getCookie(event, "auth-token"));
  }

  // Only logged-in users can GET, POST, or DELETE their bookmarks
  if (url.includes("/bookmarks")) {
   isLoggedIn(getCookie(event, "auth-token"));
  }
});
