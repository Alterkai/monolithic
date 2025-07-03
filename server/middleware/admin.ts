import isAdmin from "~/server/utils/isAdmin"

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url;

  // Only admins may patch user
  if (method === 'PATCH' && url === '/api/user') {
    isAdmin(getCookie(event, 'auth-token'));
  }

  // Only admins can POST, DELETE manga
  if ((method === 'POST' || method === 'DELETE') && url && url.startsWith('/api/manga')) {
    isAdmin(getCookie(event, 'auth-token'));
  }

  // Only admins can POST, DELETE chapters
  if ((method === 'POST' || method === 'DELETE') && url && url.startsWith('/api/chapters')) {
    isAdmin(getCookie(event, 'auth-token'));
  }

  // Only admins can POST, DELETE genres
  if ((method === 'POST' || method === 'DELETE') && url && url.startsWith('/api/genre')) {
    isAdmin(getCookie(event, 'auth-token'));
  }

  // Only admins can DELETE comments
  if (method === 'DELETE' && url && url.startsWith('/api/manga/') && url.endsWith('/comments')) {
    isAdmin(getCookie(event, 'auth-token'));
  }
})