export default defineEventHandler(async (event) => {
  const manga_id = getRouterParam(event, "mangaID");
  const chapter_number = getRouterParam(event, "chapterID");

  if (!manga_id || !chapter_number) {
    throw createError({
      statusCode: 400,
      message: "Manga ID and Chapter Number are required",
    });
  }

  const body = await readBody(event);
  const { name, images } = body;

  if (!name || !Array.isArray(images) || images.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Chapter name and a non-empty array of images are required",
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1. Insert the new chapter and get its ID
    const chapterInsertQuery = `
      INSERT INTO chapter (manga_ID, number, name) 
      VALUES ($1, $2, $3) 
      RETURNING ID
    `;
    const chapterInsertValues = [manga_id, chapter_number, name];
    const chapterResult = await client.query(
      chapterInsertQuery,
      chapterInsertValues
    );
    const newChapterId = chapterResult.rows[0].id;

    if (!newChapterId) {
      throw new Error("Failed to create new chapter.");
    }

    // 2. Insert all images for the new chapter
    let imageInsertQuery = `INSERT INTO image (page_number, link, chapter_ID) VALUES `;
    let imageValues: any[] = [];
    let valueIndex = 1;

    images.forEach((image: any) => {
      imageInsertQuery += `($${valueIndex++}, $${valueIndex++}, $${valueIndex++}), `;
      imageValues.push(image.page_number, image.link, newChapterId);
    });

    // Remove trailing comma and space
    imageInsertQuery = imageInsertQuery.slice(0, -2);
    imageInsertQuery += ` RETURNING id`;

    const imageResult = await client.query(imageInsertQuery, imageValues);

    if (imageResult.rows.length !== images.length) {
      throw new Error("Failed to insert all images for the chapter.");
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: `Chapter ${chapter_number} and ${images.length} images added successfully.`,
      chapterId: newChapterId,
      imageIds: imageResult.rows.map((row) => row.id),
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw createError({
      statusCode: 500,
      message: `Failed to add chapter and images: ${error.message}`,
    });
  } finally {
    client.release();
  }
});
