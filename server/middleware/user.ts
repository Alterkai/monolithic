import isLoggedIn from "~/server/utils/isLoggedIn";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url;

  // Allow auth
  if (url && url.startsWith('/api/auth')) {
    return;
  }

  // Check every POST request
  // Only logged in users may POST, including comments
  if (method === 'POST') {
    isLoggedIn(getCookie(event, 'auth-token'));
  }

  // Only logged in can GET, POST, DELETE bookmarks
  if ((method === 'GET' || method === 'POST' || method === 'DELETE') && url && url.startsWith('/api/bookmarks')) {
    isLoggedIn(getCookie(event, 'auth-token'));
  }
})