export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })

  return sendNoContent(event)
})