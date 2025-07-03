export default defineEventHandler(async (event) => {
  let body = await readBody(event);
  let { title, original_title, description, author, cover, ratings, genre } = body;
  
  // Validate required fields
  // jujur malaz

  // Insert manga
  const result = await db.query(
    `INSERT INTO manga (title, original_title, description, author, cover, ratings)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [title, original_title, description, author, cover, ratings]
  )
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create manga',
    });
  }

  // Insert genre
  // jujur malaz (2)
})