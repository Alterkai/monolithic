import { db } from '~/server/utils/db';
import { useAuthStore } from '~/stores/auth';

export default defineEventHandler(async (event) => {
  // Assuming the user is already authenticated
  // Auth is handled in the middleware
  const authStore = useAuthStore();
  const user_id = authStore.user?.id;
  
  const body = await readBody(event);
  let { manga_id } = body;

  if (!manga_id || !user_id) {
    throw createError({
      statusCode: 400,
      message: 'Manga ID and User ID are required',
    });
  }

  try {
    const result = await db.query(`
      INSERT INTO 
      `)
  } catch (error) {
    console.error('Error processing bookmark request:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
})